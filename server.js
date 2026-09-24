try {
  require('dotenv').config();
} catch (_) {
  // dotenv is optional in production; Render env vars are provided directly.
}
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // Allow larger chat attachments (base64 documents) — default 1MB is too small for PDFs/images.
  maxHttpBufferSize: 16 * 1024 * 1024,
});

app.use(express.json());

// Presence map + members API MUST be registered before express.static so /api/room/... is never shadowed.
const users = new Map();
/** In-memory + disk fallback when MongoDB is unavailable (dev / broken Atlas credentials). */
const memoryMessages = new Map(); // roomId -> msg[]
const memoryEmails = new Map(); // userName -> email
const memoryReports = []; // { roomId, messageId, reporter, reason, time }
const memoryRoomMeta = new Map(); // roomId -> { createdAt, createdBy }
const ROOM_META_ID = '__room_meta__';
const RESERVED_COLLECTIONS = new Set(['emails', 'reports', 'room_members']);

const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'nexova-store.json');
let storeSaveTimer = null;

function loadDiskStore() {
  try {
    if (!fs.existsSync(STORE_PATH)) return;
    const raw = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
    const rooms = raw && raw.rooms && typeof raw.rooms === 'object' ? raw.rooms : {};
    for (const [roomId, entry] of Object.entries(rooms)) {
      const id = String(roomId || '').trim();
      if (!id) continue;
      if (entry && entry.meta && entry.meta.createdAt) {
        memoryRoomMeta.set(id, {
          createdAt: entry.meta.createdAt,
          createdBy: String(entry.meta.createdBy || '').trim(),
        });
      }
      if (entry && Array.isArray(entry.messages) && entry.messages.length) {
        memoryMessages.set(id, entry.messages.slice(-500));
      }
    }
    const emails = raw && raw.emails && typeof raw.emails === 'object' ? raw.emails : {};
    for (const [name, email] of Object.entries(emails)) {
      if (name && email) memoryEmails.set(String(name), String(email));
    }
    console.log(`Loaded local store: ${Object.keys(rooms).length} room(s) from ${STORE_PATH}`);
  } catch (err) {
    console.error('Failed to load local store:', err.message);
  }
}

function saveDiskStoreSoon() {
  if (storeSaveTimer) clearTimeout(storeSaveTimer);
  storeSaveTimer = setTimeout(() => {
    storeSaveTimer = null;
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      const rooms = {};
      const roomIds = new Set([...memoryMessages.keys(), ...memoryRoomMeta.keys()]);
      for (const id of roomIds) {
        rooms[id] = {
          meta: memoryRoomMeta.get(id) || null,
          messages: memoryMessages.get(id) || [],
        };
      }
      const emails = {};
      for (const [name, email] of memoryEmails.entries()) emails[name] = email;
      fs.writeFileSync(STORE_PATH, JSON.stringify({ rooms, emails }, null, 0), 'utf8');
    } catch (err) {
      console.error('Failed to save local store:', err.message);
    }
  }, 250);
}

loadDiskStore();

function memoryPushMessage(roomId, msg) {
  const id = String(roomId || '').trim();
  if (!id) return msg;
  if (!memoryMessages.has(id)) memoryMessages.set(id, []);
  memoryMessages.get(id).push(msg);
  const list = memoryMessages.get(id);
  if (list.length > 500) list.splice(0, list.length - 500);
  saveDiskStoreSoon();
  return msg;
}

function memoryHistory(roomId) {
  return [...(memoryMessages.get(String(roomId || '').trim()) || [])];
}

function ensureRoomMeta(roomId, createdBy) {
  const id = String(roomId || '').trim();
  if (!id) return null;
  if (!memoryRoomMeta.has(id)) {
    memoryRoomMeta.set(id, {
      createdAt: new Date().toISOString(),
      createdBy: String(createdBy || '').trim(),
    });
    saveDiskStoreSoon();
  }
  return memoryRoomMeta.get(id);
}

async function getRoomCreatedAt(roomId) {
  const id = String(roomId || '').trim();
  if (!id) return null;

  if (mongoReady()) {
    try {
      const meta = await getMongoRoomMeta(id);
      if (meta?.createdAt) return new Date(meta.createdAt).toISOString();
    } catch (_) {}
  }

  const mem = memoryRoomMeta.get(id);
  if (mem?.createdAt) return mem.createdAt;

  const hist = memoryHistory(id);
  if (hist.length) {
    let min = Infinity;
    hist.forEach((m) => {
      const t = new Date(m.time).getTime();
      if (!Number.isNaN(t) && t < min) min = t;
    });
    if (min !== Infinity) return new Date(min).toISOString();
  }

  return null;
}

async function getMongoRoomMeta(roomId) {
  if (!mongoReady()) return null;
  const id = String(roomId || '').trim();
  if (!id) return null;
  const coll = mongoose.connection.db.collection(toSafeCollectionName(id));
  const doc = await coll.findOne({ _id: ROOM_META_ID });
  if (doc) return doc;
  // Legacy: messages-only collection had no meta
  return null;
}

/** Ensure a Mongo collection named after the room, with meta (createdAt/createdBy/members). */
async function ensureRoomInMongo(roomId, createdBy) {
  if (!mongoReady()) return ensureRoomMeta(roomId, createdBy);
  const id = String(roomId || '').trim();
  if (!id) return null;
  const name = String(createdBy || '').trim();
  const collName = toSafeCollectionName(id);
  const db = mongoose.connection.db;
  await db.createCollection(collName).catch(() => {});
  const coll = db.collection(collName);

  const existing = await coll.findOne({ _id: ROOM_META_ID });
  if (!existing) {
    const createdAt = new Date();
    const members = name ? [name] : [];
    await coll.insertOne({
      _id: ROOM_META_ID,
      docType: 'room_meta',
      roomId: id,
      createdAt,
      createdBy: name,
      members,
    });
    memoryRoomMeta.set(id, { createdAt: createdAt.toISOString(), createdBy: name });
    saveDiskStoreSoon();
    return memoryRoomMeta.get(id);
  }

  if (name) {
    await coll.updateOne({ _id: ROOM_META_ID }, { $addToSet: { members: name } });
  }
  const meta = {
    createdAt: existing.createdAt
      ? new Date(existing.createdAt).toISOString()
      : new Date().toISOString(),
    createdBy: String(existing.createdBy || name || '').trim(),
  };
  memoryRoomMeta.set(id, meta);
  saveDiskStoreSoon();
  return meta;
}

async function addMemberToMongoRoom(roomId, userName) {
  if (!mongoReady()) return;
  const id = String(roomId || '').trim();
  const name = String(userName || '').trim();
  if (!id || !name) return;
  try {
    const coll = mongoose.connection.db.collection(toSafeCollectionName(id));
    await coll.updateOne(
      { _id: ROOM_META_ID },
      { $addToSet: { members: name }, $setOnInsert: { docType: 'room_meta', roomId: id } },
      { upsert: false }
    );
  } catch (_) {}
}

function memoryFindMessage(roomId, messageId) {
  const list = memoryMessages.get(String(roomId || '').trim()) || [];
  return list.find((m) => String(m._id) === String(messageId)) || null;
}

function memoryDeleteMessage(roomId, messageId) {
  const id = String(roomId || '').trim();
  const list = memoryMessages.get(id);
  if (!list) return false;
  const idx = list.findIndex((m) => String(m._id) === String(messageId));
  if (idx < 0) return false;
  list.splice(idx, 1);
  saveDiskStoreSoon();
  return true;
}

function mongoReady() {
  return mongoose.connection.readyState === 1;
}

function getRoomMembers(roomId) {
  const id = String(roomId || '').trim();
  if (!id) return [];
  const names = new Set();
  for (const [, u] of users) {
    if (u && u.roomId === id && u.userName) names.add(String(u.userName).trim());
  }
  return [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

/** Distinct userName from Mongo room meta + messages + local history + online sockets. */
async function getRoomMembersMerged(roomId) {
  const id = String(roomId || '').trim();
  const online = getRoomMembers(id);
  const fromMessages = new Set();
  memoryHistory(id).forEach((m) => {
    const s = String(m && m.userName ? m.userName : '').trim();
    if (s) fromMessages.add(s);
  });
  const creator = memoryRoomMeta.get(id)?.createdBy;
  if (creator) fromMessages.add(String(creator).trim());
  try {
    if (mongoReady() && id) {
      const coll = mongoose.connection.db.collection(toSafeCollectionName(id));
      const meta = await coll.findOne({ _id: ROOM_META_ID });
      if (meta && Array.isArray(meta.members)) {
        meta.members.forEach((n) => {
          const s = String(n || '').trim();
          if (s) fromMessages.add(s);
        });
      }
      if (meta?.createdBy) fromMessages.add(String(meta.createdBy).trim());
      const raw = await coll.distinct('userName', { docType: { $ne: 'room_meta' } });
      raw.forEach((n) => {
        const s = String(n || '').trim();
        if (s) fromMessages.add(s);
      });
      // Legacy room_*_messages collections
      const legacy = legacyCollectionName(id);
      if (legacy !== toSafeCollectionName(id)) {
        try {
          const legacyRaw = await mongoose.connection.db.collection(legacy).distinct('userName');
          legacyRaw.forEach((n) => {
            const s = String(n || '').trim();
            if (s) fromMessages.add(s);
          });
        } catch (_) {}
      }
    }
  } catch (_) {}
  const merged = [...new Set([...online, ...fromMessages])].filter(Boolean).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );
  return { members: merged, online };
}

async function resolveRoomCreatedBy(roomId) {
  const id = String(roomId || '').trim();
  if (mongoReady()) {
    try {
      const meta = await getMongoRoomMeta(id);
      if (meta?.createdBy) return String(meta.createdBy).trim();
    } catch (_) {}
  }
  return String(memoryRoomMeta.get(id)?.createdBy || '').trim();
}

async function broadcastRoomMembers(roomId) {
  const rid = String(roomId || '').trim();
  if (!rid) return;
  try {
    const { members, online } = await getRoomMembersMerged(rid);
    const createdAt = await getRoomCreatedAt(rid);
    const createdBy = await resolveRoomCreatedBy(rid);
    // Keep Mongo members list in sync when connected
    if (mongoReady() && members.length) {
      try {
        await mongoose.connection.db.collection(toSafeCollectionName(rid)).updateOne(
          { _id: ROOM_META_ID },
          { $addToSet: { members: { $each: members } } }
        );
      } catch (_) {}
    }
    io.to(rid).emit('room_members', {
      roomId: rid,
      members,
      online,
      memberCount: members.length,
      createdAt: createdAt || null,
      createdBy: createdBy || '',
    });
  } catch (_) {
    const online = getRoomMembers(rid);
    io.to(rid).emit('room_members', {
      roomId: rid,
      members: online,
      online,
      memberCount: online.length,
      createdAt: null,
      createdBy: '',
    });
  }
}

app.get('/api/room/:roomId/members', async (req, res) => {
  const roomId = String(req.params.roomId || '').trim();
  if (!roomId) return res.status(400).json({ ok: false, members: [] });
  try {
    const { members, online } = await getRoomMembersMerged(roomId);
    const createdAt = await getRoomCreatedAt(roomId);
    const createdBy = await resolveRoomCreatedBy(roomId);
    res.json({
      ok: true,
      roomId,
      members,
      online,
      memberCount: members.length,
      createdAt: createdAt || null,
      createdBy: createdBy || '',
      mongo: mongoReady(),
      collection: toSafeCollectionName(roomId),
    });
  } catch (_) {
    const online = getRoomMembers(roomId);
    const createdAt = await getRoomCreatedAt(roomId);
    res.json({
      ok: true,
      roomId,
      members: online,
      online,
      memberCount: online.length,
      createdAt: createdAt || null,
      createdBy: '',
      mongo: mongoReady(),
    });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

const TRANSLATE_API_URL = process.env.TRANSLATE_API_URL || 'https://libretranslate.de/translate';
const TRANSLATE_API_KEY = process.env.TRANSLATE_API_KEY || '';
const APP_TO_TRANSLATE_LANG = {
  en: 'en',
  fr: 'fr',
  es: 'es',
  pt: 'pt',
  hi: 'hi',
  mr: 'mr',
  kn: 'kn',
  te: 'te',
  pa: 'pa',
  sa: 'sa',
};

async function translateWithLibre({ text, source, target }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const body = {
      q: text,
      source: source || 'auto',
      target,
      format: 'text',
    };
    if (TRANSLATE_API_KEY) body.api_key = TRANSLATE_API_KEY;

    const res = await fetch(TRANSLATE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Translate HTTP ${res.status}`);
    const data = await res.json();
    const translated = String(data?.translatedText || '').trim();
    return translated || '';
  } finally {
    clearTimeout(timeout);
  }
}

async function translateWithMyMemory({ text, source, target }) {
  const src = source && source !== 'auto' ? source : 'en';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const params = new URLSearchParams({
      q: text,
      langpair: `${src}|${target}`,
    });
    const res = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`, {
      method: 'GET',
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
    const data = await res.json();
    const translated = String(data?.responseData?.translatedText || '').trim();
    if (!translated || translated.toLowerCase() === text.toLowerCase()) return '';
    return translated;
  } finally {
    clearTimeout(timeout);
  }
}

/** Fallback when LibreTranslate is down / rate-limited (common on public instances). */
async function translateWithGoogleGtxChunk(text, targetIso, signal) {
  const params = new URLSearchParams({
    client: 'gtx',
    sl: 'auto',
    tl: targetIso,
    dt: 't',
    q: text,
  });
  const res = await fetch('https://translate.googleapis.com/translate_a/single?' + params.toString(), {
    method: 'GET',
    signal,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; NexovaChat/1.0)',
      Accept: 'application/json',
    },
  });
  if (!res.ok) return '';
  const data = await res.json();
  if (!Array.isArray(data) || !Array.isArray(data[0])) return '';
  let out = '';
  for (const seg of data[0]) {
    if (seg && typeof seg[0] === 'string') out += seg[0];
  }
  return out.trim();
}

async function translateWithGoogleGtx(text, targetIso) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  const MAX = 3200;
  try {
    if (text.length <= MAX) {
      const translated = await translateWithGoogleGtxChunk(text, targetIso, controller.signal);
      if (!translated || translated === text) return '';
      return translated;
    }
    const parts = [];
    for (let i = 0; i < text.length; ) {
      let end = Math.min(i + MAX, text.length);
      if (end < text.length) {
        const sp = text.lastIndexOf(' ', end);
        if (sp > i + 200) end = sp;
      }
      const chunk = text.slice(i, end).trim();
      if (chunk) {
        const t = await translateWithGoogleGtxChunk(chunk, targetIso, controller.signal);
        if (!t) return '';
        parts.push(t);
      }
      i = end;
    }
    const joined = parts.join(' ').trim();
    if (!joined || joined === text) return '';
    return joined;
  } catch {
    return '';
  } finally {
    clearTimeout(timeout);
  }
}

app.post('/api/translate', async (req, res) => {
  const text = String(req.body?.text || '').trim();
  const sourceLang = String(req.body?.sourceLang || 'auto').trim().toLowerCase();
  const targetLang = String(req.body?.targetLang || '').trim().toLowerCase();

  if (!text || !targetLang) return res.status(400).json({ ok: false, translatedText: '' });
  if (!APP_TO_TRANSLATE_LANG[targetLang]) return res.status(400).json({ ok: false, translatedText: '' });

  const target = APP_TO_TRANSLATE_LANG[targetLang];
  const source =
    sourceLang === 'auto' || !sourceLang || !APP_TO_TRANSLATE_LANG[sourceLang]
      ? 'auto'
      : APP_TO_TRANSLATE_LANG[sourceLang];

  // Same language → no API call (only when source is known, not auto).
  if (source !== 'auto' && source === target) {
    return res.json({ ok: true, translatedText: text, provider: 'none' });
  }

  // Provider chain: LibreTranslate -> MyMemory (known source only) -> Google gtx (reliable fallback).
  try {
    const viaLibre = await translateWithLibre({ text, source, target });
    if (viaLibre && viaLibre !== text) {
      return res.json({ ok: true, translatedText: viaLibre, provider: 'libre' });
    }
  } catch {}

  if (source !== 'auto') {
    try {
      const viaMyMemory = await translateWithMyMemory({ text, source, target });
      if (viaMyMemory) return res.json({ ok: true, translatedText: viaMyMemory, provider: 'mymemory' });
    } catch {}
  }

  try {
    const viaGtx = await translateWithGoogleGtx(text, target);
    if (viaGtx) return res.json({ ok: true, translatedText: viaGtx, provider: 'gtx' });
  } catch {}

  return res.json({ ok: false, translatedText: '' });
});

// MongoDB connection (Nexova database)
const MONGO_URI = process.env.MONGO_URI || '';
const LOCAL_MONGO_URI = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/Nexova';

function redactMongoUri(uri) {
  try {
    const u = new URL(uri);
    if (u.password) u.password = '***';
    return u.toString();
  } catch {
    return uri;
  }
}

function withAuthSource(uri) {
  try {
    const u = new URL(uri);
    if (!u.searchParams.has('authSource')) u.searchParams.set('authSource', 'admin');
    return u.toString();
  } catch {
    return uri;
  }
}

async function connectMongoWithFallback() {
  const tried = [];
  const candidates = [];
  if (MONGO_URI) {
    candidates.push(MONGO_URI);
    candidates.push(withAuthSource(MONGO_URI));
  }
  if (LOCAL_MONGO_URI) candidates.push(LOCAL_MONGO_URI);
  const seen = new Set();
  for (const uri of candidates) {
    if (!uri || seen.has(uri)) continue;
    seen.add(uri);
    tried.push(uri);
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 7000 });
      console.log(`Connected to MongoDB: ${redactMongoUri(uri)}`);
      try {
        await mongoose.connection.db.dropCollection('room_members');
        console.log('Dropped legacy collection: room_members');
      } catch (_) {
        /* not present — ok */
      }
      return;
    } catch (err) {
      console.error(`MongoDB connection failed (${redactMongoUri(uri)}): ${err.message}`);
      try {
        if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
      } catch {}
    }
  }
  console.error(
    'MongoDB unavailable — using local disk store for chat history/members. Fix MONGO_URI (Atlas Database Access password) to use cloud data. Tried:',
    tried.map(redactMongoUri).join(' , ')
  );
}

connectMongoWithFallback();

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mongo: mongoReady(),
    store: fs.existsSync(STORE_PATH),
  });
});

// Message model (stored inside each room's collection)
const messageSchema = new mongoose.Schema({
  roomId: { type: String, index: true },
  docType: { type: String, default: 'message' },
  text: String,
  userName: String,
  userLang: String,
  time: { type: Date, default: Date.now },
  attachment: mongoose.Schema.Types.Mixed,
  edited: { type: Boolean, default: false },
});

// Email model (stores email <-> userName)
const emailSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    userName: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

const Email = mongoose.model('Email', emailSchema, 'emails');

const reportSchema = new mongoose.Schema(
  {
    roomId: { type: String, index: true },
    messageId: String,
    reporter: String,
    reportedUser: String,
    reason: String,
    messageSnippet: String,
  },
  { timestamps: true }
);
const Report = mongoose.models.Report || mongoose.model('Report', reportSchema, 'reports');

// Identity APIs (email -> name)
app.get('/api/identity', async (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  const userName = String(req.query.userName || '').trim();
  if (!email && !userName) return res.json({ ok: false, userName: '', email: '' });
  try {
    const doc = email
      ? await Email.findOne({ email }).lean()
      : await Email.findOne({ userName }).lean();
    return res.json({ ok: true, userName: doc?.userName || '', email: doc?.email || '' });
  } catch (err) {
    return res.status(500).json({ ok: false, userName: '', email: '' });
  }
});

app.post('/api/identity', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const userName = String(req.body?.userName || '').trim();
  if (!email || !userName) return res.status(400).json({ ok: false });
  try {
    await Email.updateOne({ email }, { $set: { email, userName } }, { upsert: true });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false });
  }
});

// Rooms API (from MongoDB collections)
app.get('/api/rooms', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ ok: false, rooms: [] });
    }
    const db = mongoose.connection.db;
    const cols = await db.listCollections({}, { nameOnly: true }).toArray();
    const roomCollections = cols
      .map((c) => c.name)
      .filter((name) => {
        if (!name || RESERVED_COLLECTIONS.has(name)) return false;
        if (name.startsWith('system.')) return false;
        return true;
      });

    const rooms = await Promise.all(
      roomCollections.map(async (collectionName) => {
        let roomId = collectionName;
        if (collectionName.startsWith('room_') && collectionName.endsWith('_messages')) {
          roomId = collectionName.slice(5, -9);
        }
        let lastUsedAt = null;
        try {
          const last = await db
            .collection(collectionName)
            .find({ docType: { $ne: 'room_meta' }, time: { $exists: true } }, { projection: { time: 1 } })
            .sort({ time: -1 })
            .limit(1)
            .next();
          lastUsedAt = last?.time || null;
          if (!lastUsedAt) {
            const meta = await db.collection(collectionName).findOne({ _id: ROOM_META_ID });
            lastUsedAt = meta?.createdAt || null;
          }
        } catch {}
        return { roomId, lastUsedAt, collection: collectionName };
      })
    );

    rooms.sort((a, b) => {
      const at = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
      const bt = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
      return bt - at;
    });

    return res.json({ ok: true, rooms });
  } catch (err) {
    return res.status(500).json({ ok: false, rooms: [] });
  }
});

// Delete a room collection from DB
app.delete('/api/rooms/:roomId', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ ok: false, message: 'DB not connected' });
    }
    const roomId = String(req.params.roomId || '').trim();
    if (!roomId) return res.status(400).json({ ok: false, message: 'roomId required' });
    const collectionName = toSafeCollectionName(roomId);
    const db = mongoose.connection.db;
    const exists = await db.listCollections({ name: collectionName }, { nameOnly: true }).hasNext();
    if (exists) {
      await db.dropCollection(collectionName);
    }
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'delete failed' });
  }
});

// Rename room collection in DB
app.patch('/api/rooms/:roomId', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ ok: false, message: 'DB not connected' });
    }
    const roomId = String(req.params.roomId || '').trim();
    const newRoomId = String(req.body?.newRoomId || '').trim();
    if (!roomId || !newRoomId) {
      return res.status(400).json({ ok: false, message: 'roomId and newRoomId required' });
    }
    if (roomId === newRoomId) return res.json({ ok: true, roomId: newRoomId });

    const oldCollection = toSafeCollectionName(roomId);
    const newCollection = toSafeCollectionName(newRoomId);
    const db = mongoose.connection.db;
    const oldExists = await db.listCollections({ name: oldCollection }, { nameOnly: true }).hasNext();
    if (!oldExists) return res.status(404).json({ ok: false, message: 'room not found' });
    const newExists = await db.listCollections({ name: newCollection }, { nameOnly: true }).hasNext();
    if (newExists) return res.status(409).json({ ok: false, message: 'target room already exists' });

    await db.collection(oldCollection).rename(newCollection);
    // Keep roomId field consistent with new room id
    await db.collection(newCollection).updateMany({ roomId }, { $set: { roomId: newRoomId } });
    return res.json({ ok: true, roomId: newRoomId });
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'rename failed' });
  }
});

function sanitizeRoomKey(roomId) {
  const base = String(roomId || 'room').trim().toLowerCase();
  return base.replace(/[^a-z0-9_-]+/g, '_').slice(0, 80) || 'room';
}

/** Collection named after the room (e.g. room "ghcyy" → collection "ghcyy"). */
function toSafeCollectionName(roomId) {
  const safe = sanitizeRoomKey(roomId);
  if (RESERVED_COLLECTIONS.has(safe) || safe.startsWith('system')) return `room_${safe}`;
  return safe;
}

/** Older naming scheme — still read for migration. */
function legacyCollectionName(roomId) {
  return `room_${sanitizeRoomKey(roomId)}_messages`;
}

function getRoomMessageModel(roomId) {
  const collection = toSafeCollectionName(roomId);
  const modelName = `Message_${collection}`;
  return mongoose.models[modelName] || mongoose.model(modelName, messageSchema, collection);
}

/** Live voice calls: roomId -> { startedAt, peers: Map(socketId -> { userName }) } */
const voiceCalls = new Map();

function voiceCallPeerList(roomId) {
  const call = voiceCalls.get(roomId);
  if (!call) return [];
  return [...call.peers.entries()].map(([socketId, info]) => ({
    socketId,
    userName: info.userName,
  }));
}

function leaveVoiceCall(socket) {
  const roomId = socket.voiceCallRoomId;
  if (!roomId) return;
  const call = voiceCalls.get(roomId);
  socket.voiceCallRoomId = null;
  if (!call) return;
  call.peers.delete(socket.id);
  socket.to(roomId).emit('voice_call_peer_left', { roomId, socketId: socket.id });
  if (call.peers.size === 0) {
    voiceCalls.delete(roomId);
  } else {
    io.to(roomId).emit('voice_call_state', {
      roomId,
      startedAt: call.startedAt,
      peers: voiceCallPeerList(roomId),
    });
  }
}

io.on('connection', (socket) => {
  socket.on('voice_call_join', ({ roomId, userName } = {}) => {
    const rid = String(roomId || socket.roomId || '').trim();
    const name = String(userName || socket.userName || 'User').trim() || 'User';
    if (!rid) {
      socket.emit('voice_call_error', { error: 'Join a chat room first.' });
      return;
    }
    if (socket.voiceCallRoomId && socket.voiceCallRoomId !== rid) {
      leaveVoiceCall(socket);
    }
    if (!voiceCalls.has(rid)) {
      voiceCalls.set(rid, { startedAt: Date.now(), peers: new Map() });
    }
    const call = voiceCalls.get(rid);
    const others = voiceCallPeerList(rid).filter((p) => p.socketId !== socket.id);
    call.peers.set(socket.id, { userName: name });
    socket.voiceCallRoomId = rid;
    socket.emit('voice_call_joined', {
      roomId: rid,
      startedAt: call.startedAt,
      selfId: socket.id,
      peers: voiceCallPeerList(rid),
      existingPeers: others,
    });
    socket.to(rid).emit('voice_call_peer_joined', {
      roomId: rid,
      peer: { socketId: socket.id, userName: name },
      startedAt: call.startedAt,
      peers: voiceCallPeerList(rid),
    });
  });

  socket.on('voice_call_leave', () => {
    leaveVoiceCall(socket);
  });

  socket.on('voice_call_signal', ({ roomId, to, data } = {}) => {
    const rid = String(roomId || socket.voiceCallRoomId || '').trim();
    const target = String(to || '').trim();
    if (!rid || !target || !data) return;
    const call = voiceCalls.get(rid);
    if (!call || !call.peers.has(socket.id) || !call.peers.has(target)) return;
    io.to(target).emit('voice_call_signal', {
      roomId: rid,
      from: socket.id,
      fromName: call.peers.get(socket.id)?.userName || socket.userName || 'User',
      data,
    });
  });

  socket.on('voice_call_mute', ({ muted } = {}) => {
    const rid = socket.voiceCallRoomId;
    if (!rid) return;
    const call = voiceCalls.get(rid);
    if (!call || !call.peers.has(socket.id)) return;
    socket.to(rid).emit('voice_call_peer_mute', {
      roomId: rid,
      socketId: socket.id,
      muted: !!muted,
    });
  });

  socket.on('room_members_request', async (payload, ack) => {
    const requested = String(payload && payload.roomId ? payload.roomId : '').trim();
    const roomId = requested || String(socket.roomId || '').trim();
    let out = { roomId: roomId || requested, members: [], online: [], memberCount: 0, createdAt: null, createdBy: '' };
    try {
      const merged = await getRoomMembersMerged(roomId);
      const createdAt = await getRoomCreatedAt(roomId);
      const createdBy = await resolveRoomCreatedBy(roomId);
      out = {
        roomId: roomId || requested,
        members: merged.members,
        online: merged.online,
        memberCount: merged.members.length,
        createdAt: createdAt || null,
        createdBy: createdBy || '',
      };
    } catch (_) {
      const online = getRoomMembers(roomId);
      out = {
        roomId: roomId || requested,
        members: online,
        online,
        memberCount: online.length,
        createdAt: null,
        createdBy: '',
      };
    }
    socket.emit('room_members', out);
    if (typeof ack === 'function') {
      try {
        ack(out);
      } catch (_) {}
    }
  });

  socket.on('join', async ({ roomId, userName, userLang }) => {
    if (!roomId) return;
    socket.roomId = roomId;
    socket.userName = userName || 'User';
    socket.userLang = userLang || 'en';
    socket.join(roomId);
    users.set(socket.id, { roomId, userName: socket.userName, userLang: socket.userLang });

    try {
      await ensureRoomInMongo(roomId, socket.userName);
      await addMemberToMongoRoom(roomId, socket.userName);
    } catch (err) {
      console.error('ensureRoomInMongo:', err.message);
      ensureRoomMeta(roomId, socket.userName);
    }

    // Load messages for this room from MongoDB (last 6 months only), else memory/disk
    try {
      if (!mongoReady()) {
        socket.emit('history', memoryHistory(roomId));
      } else {
        const collectionName = toSafeCollectionName(roomId);
        await mongoose.connection.createCollection(collectionName).catch(() => {});
        const RoomMessage = getRoomMessageModel(roomId);
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - 6);
        let history = await RoomMessage.find({
          docType: { $ne: 'room_meta' },
          $or: [
            { time: { $gte: cutoff } },
            { time: { $type: 'string', $gte: cutoff.toISOString() } },
          ],
        })
          .sort({ time: 1 })
          .lean();

        // Fall back to legacy room_*_messages if new collection has no chats yet
        if (!history.length) {
          const legacy = legacyCollectionName(roomId);
          try {
            const exists = await mongoose.connection.db
              .listCollections({ name: legacy }, { nameOnly: true })
              .hasNext();
            if (exists) {
              history = await mongoose.connection.db
                .collection(legacy)
                .find({
                  $or: [
                    { time: { $gte: cutoff } },
                    { time: { $type: 'string', $gte: cutoff.toISOString() } },
                  ],
                })
                .sort({ time: 1 })
                .toArray();
            }
          } catch (_) {}
        }

        // Merge any local-only messages not yet in Mongo
        const local = memoryHistory(roomId);
        if (local.length) {
          const seen = new Set(history.map((m) => String(m._id)));
          local.forEach((m) => {
            if (!seen.has(String(m._id))) history.push(m);
          });
          history.sort((a, b) => new Date(a.time) - new Date(b.time));
        }

        socket.emit('history', history);
      }
    } catch (err) {
      console.error('Error loading history:', err.message);
      socket.emit('history', memoryHistory(roomId));
    }

    socket.to(roomId).emit('user_joined', { userName: socket.userName });
    await broadcastRoomMembers(roomId);
  });

  // Profile email: save/update
  socket.on('profile_email_set', async ({ userName, email }) => {
    const name = String(userName || '').trim();
    const mail = String(email || '').trim().toLowerCase();
    if (!name) return;
    if (!mail) {
      memoryEmails.delete(name);
      saveDiskStoreSoon();
      if (!mongoReady()) return;
      try {
        await Email.deleteOne({ userName: name });
      } catch {}
      return;
    }
    memoryEmails.set(name, mail);
    saveDiskStoreSoon();
    if (!mongoReady()) return;
    try {
      await Email.updateOne(
        { email: mail },
        { $set: { email: mail, userName: name } },
        { upsert: true }
      );
    } catch (err) {
      console.error('Error saving email:', err.message);
    }
  });

  // Profile email: fetch by userName
  socket.on('profile_email_get', async ({ userName }) => {
    const name = String(userName || '').trim();
    if (!name) return;
    if (!mongoReady()) {
      socket.emit('profile_email', { userName: name, email: memoryEmails.get(name) || '' });
      return;
    }
    try {
      const doc = await Email.findOne({ userName: name }).lean();
      socket.emit('profile_email', { userName: name, email: doc?.email || memoryEmails.get(name) || '' });
    } catch (err) {
      console.error('Error loading email:', err.message);
    }
  });

  socket.on('message', async (payload) => {
    const { roomId, text, userName, userLang, attachment } = payload;
    const hasContent = text?.trim() || attachment;
    if (!roomId || !hasContent) {
      socket.emit('message_error', { error: 'Empty message.' });
      return;
    }

    const resolvedName = String(userName || socket.userName || '').trim();
    if (!resolvedName) {
      socket.emit('message_error', { error: 'Missing user name.' });
      return;
    }

    // Prefer DB identity; fall back to in-memory email from Profile save
    let hasIdentity = memoryEmails.has(resolvedName);
    if (mongoReady()) {
      try {
        const identity = await Email.findOne({ userName: resolvedName }).lean();
        if (identity?.email) hasIdentity = true;
      } catch {
        /* use memory flag */
      }
    }
    // Also accept client-local identity via socket if they just saved email this session
    if (!hasIdentity) {
      const clientEmail = String(payload.email || '').trim().toLowerCase();
      if (clientEmail.includes('@')) {
        memoryEmails.set(resolvedName, clientEmail);
        saveDiskStoreSoon();
        hasIdentity = true;
      }
    }
    if (!hasIdentity) {
      socket.emit('message_error', {
        error: 'Add your email in Settings → Profile and Save, then send again.',
      });
      return;
    }

    const msgObj = {
      _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      roomId,
      text: (text || '').trim(),
      userName: resolvedName,
      userLang: userLang || socket.userLang || 'en',
      attachment: attachment || undefined,
      time: new Date(),
    };

    if (!mongoReady()) {
      memoryPushMessage(roomId, msgObj);
      io.to(roomId).emit('message', msgObj);
      void broadcastRoomMembers(roomId).catch(() => {});
      return;
    }

    const RoomMessage = getRoomMessageModel(roomId);
    const msgDoc = new RoomMessage({
      roomId,
      docType: 'message',
      text: msgObj.text,
      userName: resolvedName,
      userLang: msgObj.userLang,
      attachment: attachment || undefined,
    });

    try {
      const saved = await msgDoc.save();
      await addMemberToMongoRoom(roomId, resolvedName);
      io.to(roomId).emit('message', saved.toObject());
      void broadcastRoomMembers(roomId).catch(() => {});
    } catch (err) {
      console.error('Error saving message:', err.message);
      // Still deliver in-room so chat is usable when write fails
      memoryPushMessage(roomId, msgObj);
      io.to(roomId).emit('message', msgObj);
      socket.emit('message_error', { error: 'Saved in session only (database write failed).' });
    }
  });

  socket.on('message_delete', async ({ roomId, messageId, userName }) => {
    const rid = String(roomId || socket.roomId || '').trim();
    const mid = String(messageId || '').trim();
    const name = String(userName || socket.userName || '').trim();
    if (!rid || !mid || !name) {
      socket.emit('message_error', { error: 'Cannot delete message.' });
      return;
    }

    let owner = null;
    const mem = memoryFindMessage(rid, mid);
    if (mem) owner = String(mem.userName || '').trim();

    if (mongoReady() && !owner) {
      try {
        const RoomMessage = getRoomMessageModel(rid);
        const doc = await RoomMessage.findById(mid).lean();
        if (doc) owner = String(doc.userName || '').trim();
      } catch (_) {}
    }

    if (!owner || owner !== name) {
      socket.emit('message_error', { error: 'You can only delete your own messages.' });
      return;
    }

    memoryDeleteMessage(rid, mid);
    if (mongoReady()) {
      try {
        const RoomMessage = getRoomMessageModel(rid);
        await RoomMessage.deleteOne({ _id: mid });
      } catch (err) {
        console.error('Error deleting message:', err.message);
      }
    }
    io.to(rid).emit('message_deleted', { roomId: rid, messageId: mid });
  });

  socket.on('message_edit', async ({ roomId, messageId, userName, text, userLang }) => {
    const rid = String(roomId || socket.roomId || '').trim();
    const mid = String(messageId || '').trim();
    const name = String(userName || socket.userName || '').trim();
    const newText = String(text || '').trim();
    if (!rid || !mid || !name || !newText) {
      socket.emit('message_error', { error: 'Cannot edit message.' });
      return;
    }

    let owner = null;
    const mem = memoryFindMessage(rid, mid);
    if (mem) owner = String(mem.userName || '').trim();

    if (mongoReady() && !owner) {
      try {
        const RoomMessage = getRoomMessageModel(rid);
        const doc = await RoomMessage.findById(mid).lean();
        if (doc) owner = String(doc.userName || '').trim();
      } catch (_) {}
    }

    if (!owner || owner !== name) {
      socket.emit('message_error', { error: 'You can only edit your own messages.' });
      return;
    }

    let updated = null;
    if (mem) {
      mem.text = newText;
      mem.edited = true;
      if (userLang) mem.userLang = userLang;
      updated = { ...mem };
    }

    if (mongoReady()) {
      try {
        const RoomMessage = getRoomMessageModel(rid);
        const doc = await RoomMessage.findOneAndUpdate(
          { _id: mid, userName: name },
          { $set: { text: newText, edited: true, ...(userLang ? { userLang } : {}) } },
          { new: true }
        ).lean();
        if (doc) updated = doc;
      } catch (err) {
        console.error('Error editing message:', err.message);
      }
    }

    if (!updated) {
      socket.emit('message_error', { error: 'Message not found.' });
      return;
    }

    io.to(rid).emit('message_edited', {
      roomId: rid,
      messageId: mid,
      text: updated.text,
      userLang: updated.userLang,
      edited: true,
    });
    // Ensure the editor also gets the event even if room join state is stale
    socket.emit('message_edited', {
      roomId: rid,
      messageId: mid,
      text: updated.text,
      userLang: updated.userLang,
      edited: true,
    });
  });

  socket.on('message_report', async ({ roomId, messageId, userName, reason }) => {
    const rid = String(roomId || socket.roomId || '').trim();
    const mid = String(messageId || '').trim();
    const reporter = String(userName || socket.userName || '').trim();
    const why = String(reason || 'inappropriate').trim().slice(0, 200);
    if (!rid || !mid || !reporter) {
      socket.emit('message_error', { error: 'Cannot report message.' });
      return;
    }

    let reportedUser = '';
    let snippet = '';
    const mem = memoryFindMessage(rid, mid);
    if (mem) {
      reportedUser = String(mem.userName || '');
      snippet = String(mem.text || '').slice(0, 200);
    } else if (mongoReady()) {
      try {
        const RoomMessage = getRoomMessageModel(rid);
        const doc = await RoomMessage.findById(mid).lean();
        if (doc) {
          reportedUser = String(doc.userName || '');
          snippet = String(doc.text || '').slice(0, 200);
        }
      } catch (_) {}
    }

    const report = {
      roomId: rid,
      messageId: mid,
      reporter,
      reportedUser,
      reason: why,
      messageSnippet: snippet,
      time: new Date(),
    };
    memoryReports.push(report);
    if (memoryReports.length > 200) memoryReports.splice(0, memoryReports.length - 200);

    if (mongoReady()) {
      try {
        await Report.create(report);
      } catch (err) {
        console.error('Error saving report:', err.message);
      }
    }

    socket.emit('message_reported', { ok: true, messageId: mid });
  });

  socket.on('disconnect', () => {
    const prev = users.get(socket.id);
    leaveVoiceCall(socket);
    users.delete(socket.id);
    if (prev?.roomId) void broadcastRoomMembers(prev.roomId).catch(() => {});
  });
});

const START_PORT = Number(process.env.PORT) || 3000;

const MAX_PORT_TRIES = 20;

function listenWithFallback(port, attemptsLeft) {
  const onError = (err) => {
    if (err?.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy, trying ${nextPort}...`);
      server.off('error', onError);
      listenWithFallback(nextPort, attemptsLeft - 1);
      return;
    }
    console.error('Failed to start server:', err?.message || err);
    process.exit(1);
  };

  server.once('error', onError);
  server.listen(port, () => {
    server.off('error', onError);
    console.log(`Nexova running at http://localhost:${port}`);
  });
}

listenWithFallback(START_PORT, MAX_PORT_TRIES);
