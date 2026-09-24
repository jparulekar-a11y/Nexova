const LANG_KEYS = ['en', 'fr', 'es', 'pt', 'hi', 'mr', 'kn', 'te', 'pa', 'sa'];
const LANG_LABELS = {
  en: 'English', fr: 'Français', es: 'Español', pt: 'Português',
  hi: 'हिंदी', mr: 'मराठी', kn: 'ಕನ್ನಡ', te: 'తెలుగు', pa: 'ਪੰਜਾਬੀ', sa: 'संस्कृतम्'
};

// Which script each language uses (Sanscript scheme names). en/es/pt = no conversion.
const LANG_TO_SCRIPT = {
  hi: 'devanagari', mr: 'devanagari', sa: 'devanagari',
  te: 'telugu', kn: 'kannada', pa: 'gurmukhi',
  en: null, es: null, pt: null
};

const LANG_DIGIT_MAPS = {
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  mr: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  sa: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  te: ['౦', '౧', '౨', '౩', '౪', '౫', '౬', '౭', '౮', '౯'],
  kn: ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'],
  pa: ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯']
};

// English → target language phrase maps (lowercase keys). Longest phrases first when iterating.
const PHRASE_MAPS = {
  fr: {
    'good morning': 'Bonjour', 'good afternoon': 'Bon après-midi', 'good evening': 'Bonsoir',
    'good night': 'Bonne nuit', 'good day': 'Bonjour', 'good bye': 'Au revoir', 'goodbye': 'Au revoir',
    'hello': 'Bonjour', 'hi': 'Salut', 'hey': 'Salut',
    'thank you': 'Merci', 'thanks': 'Merci', 'please': 'S\'il vous plaît', 'sorry': 'Désolé',
    'yes': 'Oui', 'no': 'Non', 'ok': 'D\'accord', 'okay': 'D\'accord',
    'how are you': 'Comment allez-vous', 'how are you doing': 'Comment allez-vous',
    'i am fine': 'Je vais bien', 'i\'m fine': 'Je vais bien', 'i am good': 'Je vais bien',
    'see you': 'À bientôt', 'see you later': 'À bientôt', 'see you soon': 'À bientôt',
    'welcome': 'Bienvenue', 'congratulations': 'Félicitations', 'good luck': 'Bonne chance',
    'happy birthday': 'Joyeux anniversaire', 'happy new year': 'Bonne année',
    'good': 'bon', 'morning': 'matin', 'night': 'nuit', 'day': 'journée',
    'water': 'eau', 'food': 'nourriture', 'love': 'amour', 'friend': 'ami', 'friends': 'amis',
    'beautiful': 'beau', 'nice': 'sympa', 'great': 'super', 'wonderful': 'merveilleux',
    'please help': 'Aidez-moi s\'il vous plaît', 'help': 'aide', 'help me': 'Aidez-moi',
    'i love you': 'Je t\'aime', 'miss you': 'Tu me manques', 'take care': 'Prends soin de toi',
    'my name is': 'Je m\'appelle', 'i am': 'Je suis', 'what is your name': 'Comment vous appelez-vous',
    'this is': 'Ceci est', 'this': 'ceci', 'is': 'est'
  },
  es: {
    'good morning': 'Buenos días', 'good afternoon': 'Buenas tardes', 'good evening': 'Buenas tardes',
    'good night': 'Buenas noches', 'good day': 'Buenos días', 'good bye': 'Adiós', 'goodbye': 'Adiós',
    'hello': 'Hola', 'hi': 'Hola', 'hey': 'Hola',
    'thank you': 'Gracias', 'thanks': 'Gracias', 'please': 'Por favor', 'sorry': 'Lo siento',
    'yes': 'Sí', 'no': 'No', 'ok': 'Vale', 'okay': 'Vale',
    'how are you': '¿Cómo estás?', 'how are you doing': '¿Cómo estás?',
    'i am fine': 'Estoy bien', 'i\'m fine': 'Estoy bien', 'i am good': 'Estoy bien',
    'see you': 'Hasta luego', 'see you later': 'Hasta luego', 'see you soon': 'Hasta pronto',
    'welcome': 'Bienvenido', 'congratulations': 'Felicidades', 'good luck': 'Buena suerte',
    'happy birthday': 'Feliz cumpleaños', 'happy new year': 'Feliz Año Nuevo',
    'good': 'bueno', 'morning': 'mañana', 'night': 'noche', 'day': 'día',
    'water': 'agua', 'food': 'comida', 'love': 'amor', 'friend': 'amigo', 'friends': 'amigos',
    'beautiful': 'hermoso', 'nice': 'agradable', 'great': 'genial', 'wonderful': 'maravilloso',
    'help': 'ayuda', 'help me': 'Ayúdame', 'i love you': 'Te quiero', 'take care': 'Cuídate',
    'my name is': 'Me llamo', 'i am': 'Soy', 'what is your name': '¿Cómo te llamas?',
    'this is': 'Esto es', 'this': 'esto', 'is': 'es'
  },
  pt: {
    'good morning': 'Bom dia', 'good afternoon': 'Boa tarde', 'good evening': 'Boa noite',
    'good night': 'Boa noite', 'good day': 'Bom dia', 'good bye': 'Tchau', 'goodbye': 'Tchau',
    'hello': 'Olá', 'hi': 'Oi', 'hey': 'Oi',
    'thank you': 'Obrigado', 'thanks': 'Obrigado', 'please': 'Por favor', 'sorry': 'Desculpe',
    'yes': 'Sim', 'no': 'Não', 'ok': 'Ok', 'okay': 'Ok',
    'how are you': 'Como você está?', 'how are you doing': 'Como você está?',
    'i am fine': 'Estou bem', 'i\'m fine': 'Estou bem', 'i am good': 'Estou bem',
    'see you': 'Até mais', 'see you later': 'Até logo', 'see you soon': 'Até logo',
    'welcome': 'Bem-vindo', 'congratulations': 'Parabéns', 'good luck': 'Boa sorte',
    'happy birthday': 'Feliz aniversário', 'happy new year': 'Feliz Ano Novo',
    'good': 'bom', 'morning': 'manhã', 'night': 'noite', 'day': 'dia',
    'water': 'água', 'food': 'comida', 'love': 'amor', 'friend': 'amigo', 'friends': 'amigos',
    'beautiful': 'bonito', 'nice': 'legal', 'great': 'ótimo', 'wonderful': 'maravilhoso',
    'help': 'ajuda', 'help me': 'Me ajude', 'i love you': 'Eu te amo', 'take care': 'Cuide-se',
    'my name is': 'Meu nome é', 'i am': 'Eu sou', 'what is your name': 'Qual é o seu nome?',
    'this is': 'Isto é', 'this': 'isto', 'is': 'é'
  },
  hi: {
    'good morning': 'सुप्रभात', 'good night': 'शुभ रात्रि', 'goodbye': 'अलविदा', 'bye': 'अलविदा',
    'hello': 'नमस्कार', 'hi': 'नमस्कार', 'hey': 'नमस्कार', 'namaste': 'नमस्कार', 'namaskar': 'नमस्कार',
    'thank you': 'धन्यवाद', 'thanks': 'धन्यवाद', 'please': 'कृपया', 'sorry': 'क्षमा करें',
    'yes': 'हाँ', 'no': 'नहीं', 'ok': 'ठीक है', 'okay': 'ठीक है',
    'how are you': 'आप कैसे हैं?', 'see you': 'फिर मिलते हैं', 'welcome': 'स्वागत है',
    'good luck': 'शुभकामनाएँ', 'happy birthday': 'जन्मदिन मुबारक', 'happy new year': 'नया साल मुबारक',
    'good': 'अच्छा', 'morning': 'सुबह', 'night': 'रात', 'water': 'पानी', 'food': 'खाना',
    'love': 'प्यार', 'friend': 'दोस्त', 'friends': 'दोस्त', 'help': 'मदद', 'i love you': 'मैं तुमसे प्यार करता हूँ',
    'my name is': 'मेरा नाम', 'i am': 'मैं', 'jaideep': 'जयदीप', 'what is your name': 'आपका नाम क्या है', 'come': 'आओ', 'go': 'जाओ',
    'this is': 'यह है', 'this': 'यह', 'is': 'है'
  },
  mr: {
    'good morning': 'शुभ प्रभात', 'good night': 'शुभ रात्री', 'goodbye': 'नमस्कार', 'bye': 'नमस्कार',
    'hello': 'नमस्कार', 'hi': 'नमस्कार', 'hey': 'नमस्कार', 'namaste': 'नमस्कार', 'namaskar': 'नमस्कार',
    'thank you': 'धन्यवाद', 'thanks': 'धन्यवाद', 'please': 'कृपया', 'sorry': 'माफ करा',
    'yes': 'होय', 'no': 'नाही', 'ok': 'ठीक आहे',
    'how are you': 'तुम्ही कसे आहात?', 'welcome': 'स्वागत आहे', 'good': 'चांगले',
    'morning': 'सकाळ', 'water': 'पाणी', 'food': 'अन्न', 'love': 'प्रेम', 'friend': 'मित्र',
    'my name is': 'माझे नाव', 'i am': 'मी', 'jaideep': 'जयदीप', 'what is your name': 'तुमचे नाव काय आहे', 'come': 'ये', 'go': 'जा',
    'this is': 'हे आहे', 'this': 'हे', 'is': 'आहे'
  },
  kn: {
    'good morning': 'ಶುಭೋದಯ', 'good night': 'ಶುಭ ರಾತ್ರಿ', 'hello': 'ನಮಸ್ಕಾರ', 'hi': 'ನಮಸ್ಕಾರ', 'namaste': 'ನಮಸ್ಕಾರ', 'namaskar': 'ನಮಸ್ಕಾರ',
    'thank you': 'ಧನ್ಯವಾದ', 'thanks': 'ಧನ್ಯವಾದ', 'please': 'ದಯವಿಟ್ಟು', 'sorry': 'ಕ್ಷಮಿಸಿ',
    'yes': 'ಹೌದು', 'no': 'ಇಲ್ಲ', 'ok': 'ಸರಿ', 'welcome': 'ಸ್ವಾಗತ', 'good': 'ಒಳ್ಳೆಯದು',
    'morning': 'ಬೆಳಿಗ್ಗೆ', 'water': 'ನೀರು', 'food': 'ಆಹಾರ', 'love': 'ಪ್ರೀತಿ', 'friend': 'ಸ್ನೇಹಿತ',
    'my name is': 'ನನ್ನ ಹೆಸರು', 'what is your name': 'ನಿಮ್ಮ ಹೆಸರು ಏನು',
    'this is': 'ಇದು ಆಗಿದೆ', 'this': 'ಇದು', 'is': 'ಆಗಿದೆ'
  },
  te: {
    'good morning': 'శుభోదయం', 'good night': 'శుభ రాత్రి', 'hello': 'నమస్కారం', 'hi': 'నమస్కారం', 'namaste': 'నమస్కారం', 'namaskar': 'నమస్కారం',
    'thank you': 'ధన్యవాదాలు', 'thanks': 'ధన్యవాదాలు', 'please': 'దయచేసి', 'sorry': 'క్షమించండి',
    'yes': 'అవును', 'no': 'కాదు', 'ok': 'సరే', 'welcome': 'స్వాగతం', 'good': 'మంచి',
    'morning': 'ఉదయం', 'water': 'నీరు', 'food': 'ఆహారం', 'love': 'ప్రేమ', 'friend': 'స్నేహితుడు',
    'my name is': 'నా పేరు', 'what is your name': 'మీ పేరు ఏమిటి',
    'this is': 'ఇది ఉంది', 'this': 'ఇది', 'is': 'ఉంది'
  },
  pa: {
    'good morning': 'ਸ਼ੁਭ ਸਵੇਰ', 'good night': 'ਸ਼ੁਭ ਰਾਤ', 'hello': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'hi': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'namaste': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'namaskar': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
    'thank you': 'ਧੰਨਵਾਦ', 'thanks': 'ਧੰਨਵਾਦ', 'please': 'ਕ੍ਰਿਪਾ ਕਰਕੇ', 'sorry': 'ਮਾਫ ਕਰੋ',
    'yes': 'ਹਾਂ', 'no': 'ਨਹੀਂ', 'ok': 'ਠੀਕ ਹੈ', 'welcome': 'ਜੀ ਆਇਆ ਨੂੰ', 'good': 'ਚੰਗਾ',
    'morning': 'ਸਵੇਰ', 'water': 'ਪਾਣੀ', 'food': 'ਖਾਣਾ', 'love': 'ਪਿਆਰ', 'friend': 'ਦੋਸਤ',
    'my name is': 'ਮੇਰਾ ਨਾਮ', 'what is your name': 'ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ',
    'this is': 'ਇਹ ਹੈ', 'this': 'ਇਹ', 'is': 'ਹੈ'
  },
  sa: {
    'good morning': 'सुप्रभातम्', 'good night': 'शुभरात्रिः', 'hello': 'नमस्ते', 'hi': 'नमस्ते', 'namaste': 'नमस्ते', 'namaskar': 'नमस्कारः',
    'thank you': 'धन्यवादः', 'thanks': 'धन्यवादः', 'please': 'कृपया', 'sorry': 'क्षम्यताम्',
    'yes': 'आम्', 'no': 'न', 'ok': 'अस्तु', 'welcome': 'स्वागतम्', 'good': 'शोभनम्',
    'morning': 'प्रभातम्', 'water': 'जलम्', 'food': 'अन्नम्', 'love': 'प्रेम', 'friend': 'मित्रम्',
    'my name is': 'मम नाम', 'what is your name': 'भवतः नाम किम्',
    'this is': 'एतत् अस्ति', 'this': 'एतत्', 'is': 'अस्ति'
  }
};

const LATIN_RUN = /[a-zA-Z]+/g;

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function translatePhrasesWithMap(text, map) {
  if (!text || !map) return text;
  const trimmed = text.trim().toLowerCase();
  if (!trimmed) return text;
  const direct = map[trimmed];
  if (direct) return direct;
  let out = text;
  const entries = Object.entries(map).sort((a, b) => b[0].length - a[0].length);
  for (const [en, translated] of entries) {
    const re = new RegExp('\\b' + escapeRegex(en) + '\\b', 'gi');
    out = out.replace(re, translated);
  }
  return out;
}

function convertDigitsToLang(text, lang) {
  const digits = LANG_DIGIT_MAPS[lang];
  if (!digits || !text) return text;
  return text.replace(/\d/g, (d) => digits[Number(d)] || d);
}

// Convert segment: first phrase translation (if map exists), then transliterate remaining Latin to script.
function convertSegment(text, lang) {
  if (!text || lang === 'en') return text;
  let out = text;
  const phraseMap = PHRASE_MAPS[lang];
  if (phraseMap) {
    // Force-translate "hello" / "hi" first so they never get transliterated (e.g. to एल्ल्ओ).
    const helloStr = phraseMap['hello'] || phraseMap['hi'];
    if (helloStr) {
      out = out.replace(/\bhello\b/gi, helloStr);
      out = out.replace(/\bhi\b/gi, helloStr);
    }
    out = translatePhrasesWithMap(out, phraseMap);
  }
  if (LANG_TO_SCRIPT[lang]) {
    out = out.replace(LATIN_RUN, (lat) => transliterateToLang(lat, lang));
  }
  out = convertDigitsToLang(out, lang);
  return out;
}

function transliterateToLang(text, lang) {
  if (!text || typeof Sanscript === 'undefined') return text;
  const script = LANG_TO_SCRIPT[lang];
  if (!script) return text;
  try {
    const opts = lang === 'hi' ? { syncope: true } : {};
    return Sanscript.t(text, 'itrans', script, opts);
  } catch (e) {
    return text;
  }
}

// Convert full string: phrase translation + optional script transliteration.
function transliterateString(val, lang) {
  if (lang === 'en') return val;
  return convertSegment(val, lang);
}

async function translateByApi(text, targetLang) {
  const content = String(text || '').trim();
  if (!content || !targetLang || targetLang === 'en') return '';
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: content,
        sourceLang: 'auto',
        targetLang
      }),
    });
    const data = await res.json();
    if (data && data.ok && data.translatedText) {
      return String(data.translatedText).trim();
    }
  } catch {}
  return '';
}

async function translateTextWithFallback(text, lang) {
  const content = String(text || '').trim();
  if (!content) return '';
  if (lang === 'en') return content;

  // Fast local conversion first (phrase map + transliteration + digits).
  const local = transliterateString(content, lang);
  // Full sentence translation fallback from API.
  const apiTranslated = await translateByApi(content, lang);
  return apiTranslated || local;
}

/** Translate incoming chat text into the viewer's UI language (auto-detect source, then optional explicit pair). */
async function translateForViewer(text, senderLangApp, targetLangApp) {
  const content = String(text || '').trim();
  if (!content) return '';
  const tgt = String(targetLangApp || 'en').toLowerCase();
  const sender = String(senderLangApp || 'auto').toLowerCase();

  async function callApi(sourceLang) {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          sourceLang,
          targetLang: tgt,
        }),
      });
      const data = await res.json();
      if (data && data.ok && data.translatedText) {
        return String(data.translatedText).trim();
      }
    } catch {}
    return '';
  }

  // 1) Auto-detect actual language of the text (handles wrong/missing userLang on old messages).
  let out = await callApi('auto');
  if (out && out !== content) return out;

  // 2) If we know the sender's UI language and it differs from yours, try an explicit pair (helps when auto fails).
  if (sender && sender !== 'auto' && sender !== tgt) {
    out = await callApi(sender);
    if (out && out !== content) return out;
  }

  // 3) Best effort: use any successful response even if unchanged, else original.
  if (out) return out;
  return content;
}

function incomingMessageNeedsTranslation(msg, isSent) {
  if (isSent) return false;
  return !!(msg.text && String(msg.text).trim());
}

const TTS_LANG = {
  en: 'en-US', fr: 'fr-FR', es: 'es-ES', pt: 'pt-BR',
  hi: 'hi-IN', mr: 'mr-IN', kn: 'kn-IN', te: 'te-IN', pa: 'pa-IN', sa: 'hi-IN'
};
/** Prefer exact lang, then close Indic voices (browser/OS often lack mr/pa/sa). */
const TTS_LANG_CANDIDATES = {
  en: ['en-US', 'en-GB', 'en-IN', 'en'],
  fr: ['fr-FR', 'fr-CA', 'fr'],
  es: ['es-ES', 'es-MX', 'es-US', 'es'],
  pt: ['pt-BR', 'pt-PT', 'pt'],
  hi: ['hi-IN', 'hi'],
  mr: ['mr-IN', 'mr', 'hi-IN', 'hi'],
  kn: ['kn-IN', 'kn', 'hi-IN'],
  te: ['te-IN', 'te', 'hi-IN'],
  pa: ['pa-IN', 'pa', 'hi-IN', 'hi'],
  sa: ['sa-IN', 'sa', 'hi-IN', 'hi'],
};
const TTS_VOICE_KEY = 'nexova-tts-voice';
let ttsVoiceGender = localStorage.getItem(TTS_VOICE_KEY) || 'female';
let ttsVoicesReady = false;

function ensureTtsVoices(cb) {
  if (!window.speechSynthesis) {
    if (cb) cb([]);
    return;
  }
  const load = () => {
    const list = speechSynthesis.getVoices() || [];
    if (list.length) ttsVoicesReady = true;
    if (cb) cb(list);
  };
  load();
  if (!ttsVoicesReady) {
    speechSynthesis.addEventListener('voiceschanged', load, { once: true });
  }
}

function voiceLangMatches(voiceLang, code) {
  const vl = String(voiceLang || '').toLowerCase();
  const c = String(code || '').toLowerCase();
  if (!vl || !c) return false;
  return vl === c || vl.startsWith(c + '-') || (c.length === 2 && vl.split('-')[0] === c);
}

function scoreIndicVoiceGender(name, gender) {
  const n = String(name || '');
  // macOS / Windows / Chrome Indian voice names
  const femaleRe = /female|woman|lekha|geeta|soumya|vani|piya|veena|heera|kalpana|neha|kavya|shruti|samantha|victoria|karen|moira|fiona|tessa|susan|hazel|zira|linda|meera|google.*female/i;
  const maleRe = /male|\bman\b|ravi|ajit|arjun|kishore|amit|alex|daniel|david|fred|jorge|thomas|mark|aaron|tom|google.*male|microsoft david|microsoft mark|microsoft ravi/i;
  if (gender === 'male') {
    if (maleRe.test(n)) return 3;
    if (femaleRe.test(n)) return 0;
    return 1;
  }
  if (femaleRe.test(n)) return 3;
  if (maleRe.test(n)) return 0;
  return 1;
}

function pickTtsVoice(langCode, gender) {
  if (!window.speechSynthesis) return { voice: null, exact: false, usedLang: null };
  const voices = speechSynthesis.getVoices() || [];
  if (!voices.length) return { voice: null, exact: false, usedLang: null };

  const candidates = TTS_LANG_CANDIDATES[langCode] || [TTS_LANG[langCode] || 'en-US'];
  let matched = [];
  let matchedCode = null;
  for (const code of candidates) {
    matched = voices.filter((v) => voiceLangMatches(v.lang, code));
    if (matched.length) {
      matchedCode = code;
      break;
    }
  }

  const exactShort = (TTS_LANG[langCode] || 'en').split('-')[0].toLowerCase();
  const exact = matchedCode
    ? voiceLangMatches(matchedCode, exactShort) || matchedCode.toLowerCase().startsWith(exactShort)
    : false;

  // Never silently force English for Indic text — keep related Indic voice if we found one
  const list = matched.length ? matched : [];
  if (!list.length) {
    return { voice: null, exact: false, usedLang: null };
  }

  list.sort((a, b) => {
    const gs = scoreIndicVoiceGender(b.name, gender) - scoreIndicVoiceGender(a.name, gender);
    if (gs) return gs;
    if (a.localService !== b.localService) return a.localService ? -1 : 1;
    return String(a.name).localeCompare(String(b.name));
  });

  return { voice: list[0], exact: !!exact, usedLang: matchedCode };
}

function showTtsStatus(msg, ms) {
  const el = document.getElementById('voiceStatus');
  if (!el) return;
  el.hidden = false;
  el.textContent = msg;
  clearTimeout(showTtsStatus._t);
  showTtsStatus._t = setTimeout(() => {
    el.hidden = true;
    el.textContent = '';
  }, ms || 4000);
}

function speakMessageText(text, btnEl) {
  const content = String(text || '').trim();
  if (!content) return;
  if (!window.speechSynthesis) {
    alert(t('ttsUnsupported'));
    return;
  }
  speechSynthesis.cancel();
  document.querySelectorAll('.msg-speak-btn.speaking').forEach((b) => b.classList.remove('speaking'));

  const run = () => {
    const picked = pickTtsVoice(currentLang, ttsVoiceGender);
    if (!picked.voice) {
      showTtsStatus(t('ttsNoIndicVoice').replace('{lang}', LANG_LABELS[currentLang] || currentLang), 5000);
      return;
    }

    const utter = new SpeechSynthesisUtterance(content);
    utter.voice = picked.voice;
    utter.lang = picked.voice.lang || TTS_LANG[currentLang] || 'en-US';
    utter.rate = 0.92;
    utter.pitch = ttsVoiceGender === 'female' ? 1.05 : 0.92;

    if (!picked.exact && ['hi', 'mr', 'kn', 'te', 'pa', 'sa'].includes(currentLang)) {
      const used = picked.usedLang || picked.voice.lang;
      showTtsStatus(
        t('ttsFallbackVoice')
          .replace('{lang}', LANG_LABELS[currentLang] || currentLang)
          .replace('{voiceLang}', used)
          .replace('{voice}', picked.voice.name),
        4500
      );
    }

    if (btnEl) {
      btnEl.classList.add('speaking');
      utter.onend = () => btnEl.classList.remove('speaking');
      utter.onerror = () => {
        btnEl.classList.remove('speaking');
        showTtsStatus(t('ttsSpeakError'), 3500);
      };
    }
    speechSynthesis.speak(utter);
  };

  ensureTtsVoices(() => {
    // Chrome sometimes returns [] until voiceschanged fires once more
    if (!(speechSynthesis.getVoices() || []).length) {
      setTimeout(run, 250);
    } else {
      run();
    }
  });
}

// On space: convert the word/phrase just typed (before cursor) to target language.
function convertCurrentWordOnSpace(inputEl, lang) {
  if (lang === 'en') return;
  const val = inputEl.value;
  const cursor = inputEl.selectionStart;
  const wordStart = val.slice(0, cursor).replace(/\s+$/, '').lastIndexOf(' ') + 1;
  const word = val.slice(wordStart, cursor).trim();
  if (!word || !/[a-zA-Z]/.test(word)) return;
  const converted = convertSegment(word, lang);
  if (converted === word) return;
  const newVal = val.slice(0, wordStart) + converted + val.slice(cursor);
  inputEl.value = newVal;
  inputEl.setSelectionRange(wordStart + converted.length, wordStart + converted.length);
}

// Live conversion: current word/phrase → target language (phrases + script).
function applyTransliteration(inputEl, lang) {
  if (lang === 'en') return;
  const val = inputEl.value;
  const wordStart = val.lastIndexOf(' ') + 1;
  const word = val.slice(wordStart).trim();
  if (!word || !/[a-zA-Z]/.test(word)) return;
  const converted = convertSegment(word, lang);
  if (converted === word) return;
  const newVal = val.slice(0, wordStart) + converted;
  inputEl.value = newVal;
  inputEl.setSelectionRange(newVal.length, newVal.length);
}

let locale = {};
let currentLang = localStorage.getItem('multilang-lang') || 'en';
let currentTheme = localStorage.getItem('nexova-theme') || 'classic';
let currentWallpaper = localStorage.getItem('nexova-wallpaper') || 'scenic';
let socket = null;
let currentRoomId = null;
let myName = '';
let myLang = currentLang;

document.body.setAttribute('data-theme', currentTheme);
document.body.setAttribute('data-wallpaper', currentWallpaper);

const RECENT_ROOMS_KEY = 'nexova-recent-rooms';
let roomListCache = [];
/** Messages in the current room (for re-translate when UI language changes). */
let roomMessagesCache = [];

function getMessageId(msg) {
  const id = msg._id ?? msg.id;
  if (id == null) return '';
  return String(id);
}

/** Normalize for reliable search (Unicode, zero-width chars). */
function normalizeForSearch(s) {
  return String(s || '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/\u200b/g, '');
}

/** Case-insensitive match on message text, sender name, link URL, and file name. */
function messageMatchesSearch(msg, q) {
  if (!q) return true;
  const parts = [String(msg.text || ''), String(msg.userName || '')];
  const att = msg.attachment;
  if (att) {
    if (att.url) parts.push(String(att.url));
    if (att.name) parts.push(String(att.name));
  }
  return normalizeForSearch(parts.join(' ')).includes(normalizeForSearch(q));
}

let chatSearchDebounceTimer = null;

function applyChatSearchHighlights(container, qRaw, qLower) {
  if (!qRaw || !container) return;
  const children = [...container.children].filter((el) => el.classList.contains('msg'));
  children.forEach((el, idx) => {
    if (el.hidden) return;
    let msg = null;
    if (el.dataset.id) {
      msg = roomMessagesCache.find((m) => getMessageId(m) === el.dataset.id);
    }
    if (!msg) msg = roomMessagesCache[idx];
    if (!msg) return;

    const textEl = el.querySelector('.msg-text');
    // Highlight from what's on screen; allow match via cache text too (filter uses cache).
    // Skip while "Translating..." so we don't mark the wrong string; translate callback re-runs search.
    if (textEl && !textEl.classList.contains('msg-text-translating')) {
      const visible = textEl.textContent || '';
      const cacheMsgText = String(msg.text || '');
      const textMatchesQuery =
        textIncludesQueryInsensitive(visible, qLower) || textIncludesQueryInsensitive(cacheMsgText, qLower);
      if (textMatchesQuery && visible.trim()) {
        if (!textEl.dataset.searchPlain) textEl.dataset.searchPlain = visible;
        textEl.innerHTML = highlightText(textEl.dataset.searchPlain, qRaw);
      }
    }

    const authorEl = el.querySelector('.msg-author');
    if (authorEl && authorEl.textContent && textIncludesQueryInsensitive(authorEl.textContent, qLower)) {
      if (!authorEl.dataset.searchPlain) authorEl.dataset.searchPlain = authorEl.textContent;
      authorEl.innerHTML = highlightText(authorEl.dataset.searchPlain, qRaw);
    }

    el.querySelectorAll('a.msg-attachment-link').forEach((a) => {
      if (a.textContent && textIncludesQueryInsensitive(a.textContent, qLower)) {
        if (!a.dataset.searchPlain) a.dataset.searchPlain = a.textContent;
        a.innerHTML = highlightText(a.dataset.searchPlain, qRaw);
      }
    });

    el.querySelectorAll('a.msg-attachment-doc-link').forEach((a) => {
      if (a.textContent && textIncludesQueryInsensitive(a.textContent, qLower)) {
        if (!a.dataset.searchPlain) a.dataset.searchPlain = a.textContent;
        a.innerHTML = highlightText(a.dataset.searchPlain, qRaw);
      }
    });

    el.querySelectorAll('.msg-attachment-doc').forEach((d) => {
      if (d.querySelector('a.msg-attachment-doc-link')) return;
      if (d.textContent && textIncludesQueryInsensitive(d.textContent, qLower)) {
        if (!d.dataset.searchPlain) d.dataset.searchPlain = d.textContent;
        d.innerHTML = highlightText(d.dataset.searchPlain, qRaw);
      }
    });
  });
}

function applyChatSearch() {
  const input = document.getElementById('chatSearchInput');
  const qRaw = (input?.value || '').trim();
  const qLower = qRaw.toLowerCase();
  const container = document.getElementById('messages');
  const countEl = document.getElementById('chatSearchCount');
  if (!container) return;
  restoreChatSearchHighlights(container);
  const children = [...container.children].filter((el) => el.classList.contains('msg'));
  let visible = 0;
  children.forEach((el, idx) => {
    let msg = null;
    if (el.dataset.id) {
      msg = roomMessagesCache.find((m) => getMessageId(m) === el.dataset.id);
    }
    if (!msg) msg = roomMessagesCache[idx];
    if (!msg) {
      el.hidden = false;
      el.classList.remove('msg-search-match');
      return;
    }
    const match = !qLower || messageMatchesSearch(msg, qLower);
    el.hidden = !match;
    el.classList.toggle('msg-search-match', !!(qLower && match));
    if (match) visible++;
  });
  if (countEl) {
    if (qLower) {
      countEl.hidden = false;
      countEl.textContent =
        visible === 0 ? 'No matches' : visible === 1 ? '1 match' : `${visible} matches`;
    } else {
      countEl.hidden = true;
      countEl.textContent = '';
    }
  }
  applyChatSearchHighlights(container, qRaw, qLower);
}

function scheduleChatSearch() {
  clearTimeout(chatSearchDebounceTimer);
  chatSearchDebounceTimer = setTimeout(applyChatSearch, 160);
}

function loadRecentRooms() {
  try {
    const raw = localStorage.getItem(RECENT_ROOMS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecentRooms(list) {
  localStorage.setItem(RECENT_ROOMS_KEY, JSON.stringify(list.slice(0, 20)));
}

function formatRelativeTime(ts) {
  const t = typeof ts === 'number' ? ts : Date.parse(ts);
  if (!t) return '';
  const diff = Date.now() - t;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

function upsertRecentRoom(roomId, userName) {
  const id = (roomId || '').trim();
  if (!id) return;
  const list = loadRecentRooms().filter((r) => r && r.roomId && r.roomId !== id);
  list.unshift({ roomId: id, userName: (userName || '').trim() || '', lastUsedAt: Date.now() });
  saveRecentRooms(list);
  refreshRoomsFromDb();
}

function resetRoomRowMenuStyles(menu) {
  if (!menu) return;
  menu.style.position = '';
  menu.style.top = '';
  menu.style.left = '';
  menu.style.right = '';
  menu.style.bottom = '';
  menu.style.zIndex = '';
}

function positionRoomRowMenu(menuBtn, menu) {
  const rect = menuBtn.getBoundingClientRect();
  const menuWidth = 168;
  let left = rect.right - menuWidth;
  left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
  let top = rect.bottom + 6;
  menu.style.position = 'fixed';
  menu.style.top = `${top}px`;
  menu.style.left = `${left}px`;
  menu.style.right = 'auto';
  menu.style.bottom = 'auto';
  menu.style.zIndex = '100';
  requestAnimationFrame(() => {
    const mh = menu.offsetHeight || 100;
    const maxBottom = window.innerHeight - 8;
    if (top + mh > maxBottom) {
      const above = rect.top - mh - 6;
      if (above >= 8) {
        menu.style.top = `${above}px`;
      } else {
        menu.style.top = `${Math.max(8, maxBottom - mh)}px`;
      }
    }
  });
}

function closeAllRoomRowMenus() {
  document.querySelectorAll('.room-row-menu').forEach((m) => {
    m.hidden = true;
    resetRoomRowMenuStyles(m);
  });
  document.querySelectorAll('.room-menu-btn').forEach((b) => b.setAttribute('aria-expanded', 'false'));
}

function renderRecentRooms() {
  const body = document.getElementById('recentRoomsBody');
  const empty = document.getElementById('recentRoomsEmpty');
  if (!body || !empty) return;
  const list = roomListCache.length ? roomListCache : loadRecentRooms();
  body.innerHTML = '';
  if (!list.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  list.forEach((r) => {
    const tr = document.createElement('tr');
    tr.className = 'room-row' + (r.roomId === currentRoomId ? ' active' : '');
    tr.dataset.roomId = r.roomId;
    const labelRename = escapeHtml(t('roomMenuRename'));
    const labelDelete = escapeHtml(t('roomMenuDelete'));
    tr.innerHTML = `<td title="${escapeHtml(r.roomId)}">${escapeHtml(r.roomId)}</td><td>${escapeHtml(formatRelativeTime(r.lastUsedAt))}</td><td class="room-row-actions-cell"><div class="room-menu-wrap"><button type="button" class="room-menu-btn" title="Room options" aria-label="Room options" aria-haspopup="true" aria-expanded="false">⋮</button><div class="room-row-menu" hidden role="menu"><button type="button" class="rename-room" role="menuitem">${labelRename}</button><button type="button" class="delete-room danger" role="menuitem">${labelDelete}</button></div></div></td>`;
    tr.addEventListener('click', () => {
      document.getElementById('roomId').value = r.roomId;
      joinRoom(r.roomId, document.getElementById('userName').value?.trim(), false);
    });
    const menuBtn = tr.querySelector('.room-menu-btn');
    const menu = tr.querySelector('.room-row-menu');
    const renameBtn = tr.querySelector('.rename-room');
    const deleteBtn = tr.querySelector('.delete-room');

    menu.addEventListener('click', (e) => e.stopPropagation());

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = !menu.hidden;
      closeAllRoomRowMenus();
      if (wasOpen) return;
      menu.hidden = false;
      positionRoomRowMenu(menuBtn, menu);
      menuBtn.setAttribute('aria-expanded', 'true');
    });

    renameBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      menu.hidden = true;
      resetRoomRowMenuStyles(menu);
      menuBtn.setAttribute('aria-expanded', 'false');
      const next = window.prompt('Rename room ID', r.roomId);
      const newRoomId = String(next || '').trim();
      if (!newRoomId || newRoomId === r.roomId) return;
      try {
        const res = await fetch(`/api/rooms/${encodeURIComponent(r.roomId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newRoomId }),
        });
        const data = await res.json();
        if (!data?.ok) return;
        roomListCache = roomListCache.map((x) => (x.roomId === r.roomId ? { ...x, roomId: newRoomId } : x));
        saveRecentRooms(loadRecentRooms().map((x) => (x.roomId === r.roomId ? { ...x, roomId: newRoomId } : x)));
        if (currentRoomId === r.roomId) {
          // Re-join renamed room so its history loads immediately
          document.getElementById('roomId').value = newRoomId;
          joinRoom(newRoomId, document.getElementById('userName').value?.trim(), false);
        }
        await refreshRoomsFromDb();
      } catch {}
    });

    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      menu.hidden = true;
      resetRoomRowMenuStyles(menu);
      menuBtn.setAttribute('aria-expanded', 'false');
      const ok = window.confirm(`Delete room "${r.roomId}" from dashboard and database?`);
      if (!ok) return;
      try {
        const res = await fetch(`/api/rooms/${encodeURIComponent(r.roomId)}`, { method: 'DELETE' });
        const data = await res.json();
        if (!data?.ok) return;
        roomListCache = roomListCache.filter((x) => x.roomId !== r.roomId);
        saveRecentRooms(loadRecentRooms().filter((x) => x.roomId !== r.roomId));
        if (currentRoomId === r.roomId) showWelcome();
        renderRecentRooms();
      } catch {}
    });
    body.appendChild(tr);
  });
}

async function refreshRoomsFromDb() {
  try {
    const res = await fetch('/api/rooms');
    const data = await res.json();
    if (data?.ok && Array.isArray(data.rooms)) {
      roomListCache = data.rooms
        .filter((r) => r && r.roomId)
        .map((r) => ({ roomId: r.roomId, lastUsedAt: r.lastUsedAt || null }));
      renderRecentRooms();
      return;
    }
  } catch {}
  // Fallback to local rooms if DB endpoint is unavailable
  roomListCache = [];
  renderRecentRooms();
}

async function loadLocale(lang) {
  const res = await fetch(`/locales/${lang}.json`);
  if (!res.ok) {
    if (LANG_KEYS.indexOf(lang) === -1) {
      await loadLocale('en');
    }
    return;
  }
  locale = await res.json();
  currentLang = lang;
  myLang = currentLang;
  localStorage.setItem('multilang-lang', lang);
  document.body.setAttribute('data-lang', lang);
  updateUI();
  rerenderChatMessagesFromCache();
  renderRecentRooms();
}

function t(key) {
  return locale[key] != null ? locale[key] : key;
}

function updateUI() {
  document.getElementById('appTitle').textContent = t('appName');
  document.getElementById('currentLangLabel').textContent = LANG_LABELS[currentLang] || currentLang;
  document.getElementById('yourNameLabel').textContent = t('yourName');
  document.getElementById('userName').placeholder = t('enterName');
  document.getElementById('roomIdLabel').textContent = t('roomId');
  document.getElementById('roomId').placeholder = t('enterRoomId');
  document.getElementById('joinBtn').textContent = t('joinRoom');
  document.getElementById('createBtn').textContent = t('createRoom');
  document.getElementById('hintJoin').textContent = locale.hint != null ? locale.hint : t('enterRoomId') + ' ' + t('yourName') + '.';
  document.getElementById('welcomeTitle').textContent = t('appName');
  document.getElementById('messageInput').placeholder = t('typeMessage');
  document.getElementById('sendBtn').setAttribute('aria-label', t('send'));
  const voiceBtn = document.getElementById('voiceBtn');
  if (voiceBtn) {
    const label = t('voiceMenu');
    voiceBtn.setAttribute('aria-label', label);
    voiceBtn.title = label;
  }
  const voiceDictateLabel = document.getElementById('voiceDictateLabel');
  if (voiceDictateLabel) voiceDictateLabel.textContent = t('voiceCommand');
  const voiceMsgLabel = document.getElementById('voiceMsgLabel');
  if (voiceMsgLabel) voiceMsgLabel.textContent = t('voiceMessageRecord');
  const voiceCallLabel = document.getElementById('voiceCallLabel');
  if (voiceCallLabel) voiceCallLabel.textContent = t('liveVoiceCall');
  const voiceCallTitle = document.getElementById('voiceCallTitle');
  if (voiceCallTitle) voiceCallTitle.textContent = t('liveVoiceCall');
  const voiceCallMuteBtn = document.getElementById('voiceCallMuteBtn');
  if (voiceCallMuteBtn) {
    voiceCallMuteBtn.textContent = voiceCallMuteBtn.getAttribute('aria-pressed') === 'true' ? t('unmuteMic') : t('muteMic');
  }
  const voiceCallLeaveBtn = document.getElementById('voiceCallLeaveBtn');
  if (voiceCallLeaveBtn) voiceCallLeaveBtn.textContent = t('leaveCall');
  document.querySelectorAll('.msg-speak-btn').forEach((btn) => {
    btn.setAttribute('aria-label', t('readAloud'));
    btn.title = t('readAloud');
  });
  const settingsVoiceBtn = document.getElementById('settingsVoice');
  if (settingsVoiceBtn) settingsVoiceBtn.textContent = t('readAloudVoice');
  const settingsVoiceTitle = document.getElementById('settingsVoiceTitle');
  if (settingsVoiceTitle) settingsVoiceTitle.textContent = t('readAloudVoice');
  const settingsVoiceHint = document.getElementById('settingsVoiceHint');
  if (settingsVoiceHint) settingsVoiceHint.textContent = t('readAloudHint');
  const voiceFemaleLabel = document.getElementById('voiceFemaleLabel');
  if (voiceFemaleLabel) voiceFemaleLabel.textContent = t('voiceFemale');
  const voiceMaleLabel = document.getElementById('voiceMaleLabel');
  if (voiceMaleLabel) voiceMaleLabel.textContent = t('voiceMale');
  const voicePreviewBtn = document.getElementById('voicePreviewBtn');
  if (voicePreviewBtn) voicePreviewBtn.textContent = t('voicePreview');
  const settingsAlertsBtn = document.getElementById('settingsAlerts');
  if (settingsAlertsBtn) settingsAlertsBtn.textContent = t('alertsSettings');
  const settingsAlertsTitle = document.getElementById('settingsAlertsTitle');
  if (settingsAlertsTitle) settingsAlertsTitle.textContent = t('alertsSettings');
  const autoReadLabel = document.getElementById('autoReadLabel');
  if (autoReadLabel) autoReadLabel.textContent = t('autoReadLabel');
  const autoReadHint = document.getElementById('autoReadHint');
  if (autoReadHint) autoReadHint.textContent = t('autoReadHint');
  const notifyLabel = document.getElementById('notifyLabel');
  if (notifyLabel) notifyLabel.textContent = t('notifyLabel');
  const notifyHint = document.getElementById('notifyHint');
  if (notifyHint) notifyHint.textContent = t('notifyHint');
  const notifyEnableBtn = document.getElementById('notifyEnableBtn');
  if (notifyEnableBtn) notifyEnableBtn.textContent = t('notifyEnable');
  updateMuteRoomButton();
}

function formatTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = d.toDateString() === today ? t('today') : d.toDateString() === yesterday.toDateString() ? t('yesterday') : d.toLocaleDateString();
  return dateStr + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(s) {
  const el = document.createElement('span');
  el.textContent = s;
  return el.innerHTML;
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Wrap case-insensitive matches of query in <mark> (plain text in, safe HTML out). */
function highlightText(plain, query) {
  const content = String(plain ?? '');
  const q = String(query ?? '').trim();
  if (!q) return escapeHtml(content);
  let re;
  try {
    // `u` = Unicode-aware matching (helps with mixed scripts / special chars).
    re = new RegExp(escapeRegex(q), 'giu');
  } catch {
    re = new RegExp(escapeRegex(q), 'gi');
  }
  let result = '';
  let lastIndex = 0;
  let m;
  while ((m = re.exec(content)) !== null) {
    result += escapeHtml(content.slice(lastIndex, m.index));
    result += '<mark class="msg-search-highlight">' + escapeHtml(m[0]) + '</mark>';
    lastIndex = m.lastIndex;
  }
  result += escapeHtml(content.slice(lastIndex));
  return result;
}

function textIncludesQueryInsensitive(text, qLower) {
  if (!qLower) return true;
  return normalizeForSearch(text).includes(normalizeForSearch(qLower));
}

function restoreChatSearchHighlights(container) {
  if (!container) return;
  container.querySelectorAll('[data-search-plain]').forEach((el) => {
    const plain = el.dataset.searchPlain;
    el.textContent = plain;
    delete el.dataset.searchPlain;
  });
}

/** For href/src/download — do not use escapeHtml on data URLs (breaks & in URLs). */
function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;');
}

const MUTED_ROOMS_KEY = 'nexova-muted-rooms';
const AUTO_READ_KEY = 'nexova-auto-read';
const NOTIFY_KEY = 'nexova-desktop-notify';
let autoReadIncoming = localStorage.getItem(AUTO_READ_KEY) === '1';
let desktopNotifyEnabled = localStorage.getItem(NOTIFY_KEY) === '1';

function getMutedRooms() {
  try {
    const raw = JSON.parse(localStorage.getItem(MUTED_ROOMS_KEY) || '[]');
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}

function isRoomMuted(roomId) {
  return getMutedRooms().includes(String(roomId || ''));
}

function setRoomMuted(roomId, muted) {
  const id = String(roomId || '').trim();
  if (!id) return;
  const set = new Set(getMutedRooms());
  if (muted) set.add(id);
  else set.delete(id);
  localStorage.setItem(MUTED_ROOMS_KEY, JSON.stringify([...set]));
  updateMuteRoomButton();
}

function updateMuteRoomButton() {
  const btn = document.getElementById('muteRoomBtn');
  if (!btn) return;
  const muted = !!(currentRoomId && isRoomMuted(currentRoomId));
  btn.classList.toggle('is-muted', muted);
  btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
  const label = muted ? t('unmuteRoom') : t('muteRoom');
  btn.setAttribute('aria-label', label);
  btn.title = label;
}

function notifyDesktop(title, body) {
  if (!desktopNotifyEnabled || typeof Notification === 'undefined') return;
  if (Notification.permission !== 'granted') return;
  if (!document.hidden && document.hasFocus()) return;
  try {
    const n = new Notification(title || 'Nexova', {
      body: String(body || '').slice(0, 120),
      tag: 'nexova-' + (currentRoomId || 'chat'),
      silent: false,
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch (_) {}
}

function handleIncomingMessageSideEffects(msg, isSent, msgEl) {
  if (isSent) return;
  if (!currentRoomId || isRoomMuted(currentRoomId)) return;

  const author = msg.userName || 'User';
  const preview =
    (msg.attachment && msg.attachment.type === 'audio' && t('voiceMessage')) ||
    (msg.text || '').trim() ||
    t('newMessage');

  notifyDesktop(author + ' · ' + (currentRoomId || 'Nexova'), preview);

  if (!autoReadIncoming) return;
  if (msg.attachment && msg.attachment.type === 'audio') return;

  const textEl = msgEl && msgEl.querySelector('.msg-text');
  const trySpeak = () => {
    const shown = textEl ? (textEl.textContent || '').trim() : (msg.text || '').trim();
    if (!shown || (textEl && textEl.classList.contains('msg-text-translating'))) return false;
    if (shown === t('translating')) return false;
    speakMessageText(shown);
    return true;
  };
  if (!trySpeak() && textEl) {
    let tries = 0;
    const iv = setInterval(() => {
      tries += 1;
      if (trySpeak() || tries > 40) clearInterval(iv);
    }, 200);
  }
}

function deleteOwnMessage(messageId) {
  if (!socket || !socket.connected || !currentRoomId || !messageId) return;
  socket.emit('message_delete', {
    roomId: currentRoomId,
    messageId: String(messageId),
    userName: myName,
  });
}

async function editOwnMessage(messageId, newText) {
  if (!socket || !socket.connected || !currentRoomId || !messageId) return '';
  const raw = String(newText || '').trim();
  if (!raw) return '';
  const translatedText = await translateTextWithFallback(raw, currentLang);
  socket.emit('message_edit', {
    roomId: currentRoomId,
    messageId: String(messageId),
    userName: myName,
    text: translatedText,
    userLang: currentLang,
  });
  // Update immediately so Save doesn't flash the old text while waiting for the server.
  applyMessageEditToUi({
    roomId: currentRoomId,
    messageId: String(messageId),
    text: translatedText,
    userLang: currentLang,
    edited: true,
  });
  return translatedText;
}

function reportMessage(messageId) {
  if (!socket || !socket.connected || !currentRoomId || !messageId) return;
  const reason = window.prompt(t('reportPrompt'), t('reportDefaultReason'));
  if (reason == null) return;
  socket.emit('message_report', {
    roomId: currentRoomId,
    messageId: String(messageId),
    userName: myName,
    reason: reason.trim() || t('reportDefaultReason'),
  });
}

function removeMessageFromUi(messageId) {
  const mid = String(messageId || '');
  roomMessagesCache = roomMessagesCache.filter((m) => String(m._id || m.id) !== mid);
  document.querySelectorAll('.msg[data-id]').forEach((el) => {
    if (el.getAttribute('data-id') === mid) el.remove();
  });
}

function applyMessageEditToUi(payload) {
  if (!payload) return;
  const mid = String(payload.messageId || '');
  const cached = roomMessagesCache.find((m) => String(m._id || m.id) === mid);
  if (cached) {
    cached.text = payload.text;
    cached.edited = true;
    if (payload.userLang) cached.userLang = payload.userLang;
  }
  let el = null;
  document.querySelectorAll('.msg[data-id]').forEach((node) => {
    if (node.getAttribute('data-id') === mid) el = node;
  });
  if (!el) return;
  const textEl = el.querySelector('.msg-text');
  const isSent = el.classList.contains('sent');
  if (!textEl) return;
  textEl.hidden = false;
  if (!isSent && incomingMessageNeedsTranslation({ text: payload.text, userLang: payload.userLang }, false)) {
    textEl.textContent = t('translating');
    textEl.classList.add('msg-text-translating');
    translateForViewer(payload.text, payload.userLang || 'auto', currentLang).then((out) => {
      textEl.textContent = out || payload.text;
      textEl.classList.remove('msg-text-translating');
      scheduleChatSearch();
    });
  } else {
    textEl.textContent = payload.text || '';
  }
  let editedEl = el.querySelector('.msg-edited');
  if (!editedEl) {
    const meta = el.querySelector('.msg-meta');
    if (meta) {
      editedEl = document.createElement('span');
      editedEl.className = 'msg-edited';
      meta.insertBefore(editedEl, meta.firstChild);
    }
  }
  if (editedEl) editedEl.textContent = t('edited');
}

function closeAllMsgMenus() {
  document.querySelectorAll('.msg-menu.open').forEach((m) => {
    m.classList.remove('open');
    m.hidden = true;
  });
  document.querySelectorAll('.msg-menu-btn[aria-expanded="true"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
}

function startInlineEdit(msgEl, messageId, currentText) {
  const textEl = msgEl.querySelector('.msg-text');
  if (!textEl || msgEl.querySelector('.msg-edit-row')) return;
  closeAllMsgMenus();
  textEl.hidden = true;
  const row = document.createElement('div');
  row.className = 'msg-edit-row';
  row.innerHTML =
    '<input type="text" class="msg-edit-input" maxlength="2000" />' +
    '<button type="button" class="msg-edit-save">' + escapeHtml(t('saveEdit')) + '</button>' +
    '<button type="button" class="msg-edit-cancel">' + escapeHtml(t('cancelEdit')) + '</button>';
  textEl.after(row);
  const input = row.querySelector('.msg-edit-input');
  input.value = currentText || '';
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);

  const finish = () => {
    row.remove();
    textEl.hidden = false;
  };
  row.querySelector('.msg-edit-cancel').addEventListener('click', (e) => {
    e.preventDefault();
    finish();
  });
  row.querySelector('.msg-edit-save').addEventListener('click', async (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    await editOwnMessage(messageId, val);
    finish();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      row.querySelector('.msg-edit-save').click();
    } else if (e.key === 'Escape') {
      finish();
    }
  });
}

function renderMessage(msg, isSent) {
  const div = document.createElement('div');
  div.className = 'msg ' + (isSent ? 'sent' : 'received');
  const mid = msg._id || msg.id;
  if (mid != null) div.dataset.id = String(mid);
  const name = isSent ? t('you') : (msg.userName || 'User');
  let attachmentHtml = '';
  if (msg.attachment) {
    const att = msg.attachment;
    if (att.type === 'audio' && att.data) {
      const src = escapeAttr(att.data);
      const dur = att.duration ? ' · ' + Math.round(Number(att.duration)) + 's' : '';
      attachmentHtml =
        '<div class="msg-attachment msg-attachment-audio">' +
        '<div class="msg-audio-label">' + escapeHtml(t('voiceMessage')) + escapeHtml(dur) + '</div>' +
        '<audio controls preload="metadata" src="' + src + '" class="msg-attachment-audio-el"></audio></div>';
    } else if (att.type === 'media' && att.data) {
      const isVideo = att.mime && att.mime.startsWith('video/');
      attachmentHtml = isVideo
        ? '<div class="msg-attachment"><video src="' + escapeHtml(att.data) + '" controls class="msg-attachment-media"></video></div>'
        : '<div class="msg-attachment"><img src="' + escapeHtml(att.data) + '" alt="Attachment" class="msg-attachment-media" /></div>';
    } else if (att.type === 'link' && att.url) {
      attachmentHtml = '<div class="msg-attachment"><a href="' + escapeHtml(att.url) + '" target="_blank" rel="noopener" class="msg-attachment-link">' + escapeHtml(att.url) + '</a></div>';
    } else if (att.type === 'document' && att.name) {
      if (att.data) {
        const safeName = escapeHtml(att.name);
        const hrefSrc = escapeAttr(att.data);
        const dlName = escapeAttr(att.name);
        const mime = att.mime || '';
        const isImg = mime.startsWith('image/');
        attachmentHtml =
          '<div class="msg-attachment msg-attachment-doc">' +
          (isImg
            ? '<img src="' + hrefSrc + '" alt="" class="msg-attachment-doc-thumb" />'
            : '') +
          '<a href="' + hrefSrc + '" download="' + dlName + '" class="msg-attachment-doc-link" target="_blank" rel="noopener">📎 ' + safeName + '</a></div>';
      } else {
        attachmentHtml = '<div class="msg-attachment msg-attachment-doc">' + escapeHtml(att.name) + '</div>';
      }
    }
  }
  const canEditText = isSent && !!(msg.text || '').trim() && !(msg.attachment && msg.attachment.type === 'audio' && !(msg.text || '').trim());
  const menuItems = mid
    ? (isSent
      ? (canEditText ? '<button type="button" class="msg-menu-item" data-action="edit">' + escapeHtml(t('editMessage')) + '</button>' : '') +
        '<button type="button" class="msg-menu-item msg-menu-danger" data-action="delete">' + escapeHtml(t('deleteMessage')) + '</button>'
      : '<button type="button" class="msg-menu-item" data-action="report">' + escapeHtml(t('reportMessage')) + '</button>')
    : '';
  const menuHtml = mid
    ? '<div class="msg-menu-wrap">' +
      '<button type="button" class="msg-menu-btn" aria-label="' + escapeHtml(t('messageOptions')) + '" title="' + escapeHtml(t('messageOptions')) + '" aria-haspopup="true" aria-expanded="false">⋯</button>' +
      '<div class="msg-menu" hidden role="menu">' + menuItems + '</div>' +
      '</div>'
    : '';
  div.innerHTML = `
    <div class="msg-author"></div>
    ${attachmentHtml}
    <div class="msg-text"></div>
    <div class="msg-meta">
      ${msg.edited ? '<span class="msg-edited">' + escapeHtml(t('edited')) + '</span>' : ''}
      <button type="button" class="msg-speak-btn" aria-label="${escapeHtml(t('readAloud'))}" title="${escapeHtml(t('readAloud'))}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      </button>
      ${menuHtml}
      <span class="msg-time"></span>
    </div>
  `;
  const authorEl = div.querySelector('.msg-author');
  authorEl.textContent = name;
  const textEl = div.querySelector('.msg-text');
  const timeEl = div.querySelector('.msg-time');
  timeEl.textContent = formatTime(msg.time);
  const speakBtn = div.querySelector('.msg-speak-btn');
  if (speakBtn) {
    const isAudio = msg.attachment && msg.attachment.type === 'audio';
    if (isAudio && !(msg.text || '').trim()) {
      speakBtn.hidden = true;
    }
    speakBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const shown = (textEl.textContent || '').trim();
      if (!shown || textEl.classList.contains('msg-text-translating')) return;
      speakMessageText(shown, speakBtn);
    });
  }

  const menuBtn = div.querySelector('.msg-menu-btn');
  const menu = div.querySelector('.msg-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !menu.classList.contains('open');
      closeAllMsgMenus();
      if (willOpen) {
        menu.hidden = false;
        menu.classList.add('open');
        menuBtn.setAttribute('aria-expanded', 'true');
      }
    });
    menu.querySelectorAll('.msg-menu-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        closeAllMsgMenus();
        menu.hidden = true;
        if (action === 'delete') {
          if (window.confirm(t('deleteConfirm'))) deleteOwnMessage(mid);
        } else if (action === 'report') {
          reportMessage(mid);
        } else if (action === 'edit') {
          const plain = (msg.text || textEl.textContent || '').trim();
          if (plain === t('translating')) return;
          startInlineEdit(div, mid, plain);
        }
      });
    });
  }

  const rawText = msg.text || '';
  if (incomingMessageNeedsTranslation(msg, isSent)) {
    textEl.textContent = t('translating');
    textEl.classList.add('msg-text-translating');
    translateForViewer(rawText, msg.userLang || 'auto', currentLang).then((out) => {
      textEl.textContent = out || rawText;
      textEl.classList.remove('msg-text-translating');
      scheduleChatSearch();
    });
  } else {
    textEl.textContent = rawText;
    if (!rawText && msg.attachment && msg.attachment.type === 'audio') {
      textEl.hidden = true;
    }
  }
  return div;
}

function rerenderChatMessagesFromCache() {
  const chatArea = document.getElementById('chatArea');
  if (!currentRoomId || !chatArea || chatArea.hidden) return;
  const container = document.getElementById('messages');
  if (!container || !roomMessagesCache.length) return;
  const prevScroll = container.scrollHeight - container.scrollTop;
  container.innerHTML = '';
  roomMessagesCache.forEach((msg) => {
    const isSent = msg.userName === myName;
    container.appendChild(renderMessage(msg, isSent));
  });
  container.scrollTop = container.scrollHeight - prevScroll;
  applyChatSearch();
}

function showChat(roomId) {
  currentRoomId = roomId;
  roomMessagesCache = [];
  document.getElementById('welcome').hidden = true;
  document.getElementById('chatArea').hidden = false;
  document.getElementById('chatRoomBadge').textContent = roomId;
  document.getElementById('messages').innerHTML = '';
  const searchInput = document.getElementById('chatSearchInput');
  if (searchInput) {
    searchInput.value = '';
    applyChatSearch();
  }
  updateMuteRoomButton();
  renderRecentRooms();
}

function showWelcome() {
  currentRoomId = null;
  closeRoomMembersModal();
  if (typeof window.leaveLiveVoiceCall === 'function') window.leaveLiveVoiceCall(true);
  document.getElementById('welcome').hidden = false;
  document.getElementById('chatArea').hidden = true;
  const searchInput = document.getElementById('chatSearchInput');
  if (searchInput) {
    searchInput.value = '';
    applyChatSearch();
  }
  if (socket) socket.disconnect();
  socket = null;
}

function formatRoomCreatedAt(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

function updateRoomDetailsMeta({ roomId, createdAt, memberCount, createdBy }) {
  const idEl = document.getElementById('roomDetailsId');
  const createdEl = document.getElementById('roomDetailsCreated');
  const createdByEl = document.getElementById('roomDetailsCreatedBy');
  const countEl = document.getElementById('roomDetailsCount');
  if (idEl) idEl.textContent = roomId || currentRoomId || '—';
  if (createdEl) createdEl.textContent = formatRoomCreatedAt(createdAt);
  if (createdByEl) createdByEl.textContent = createdBy ? String(createdBy) : '—';
  if (countEl) {
    const n = typeof memberCount === 'number' ? memberCount : '—';
    countEl.textContent = String(n);
  }
}

function renderRoomMembersList(members, onlineList) {
  const list = document.getElementById('roomMembersList');
  if (!list) return;
  try {
    list.innerHTML = '';
    const arr = Array.isArray(members) ? members : [];
    const onlineSet = new Set(
      Array.isArray(onlineList) ? onlineList.map((n) => String(n || '').trim()).filter(Boolean) : []
    );
    if (!arr.length) {
      const li = document.createElement('li');
      li.className = 'room-members-empty';
      li.textContent =
        typeof t === 'function' ? t('noMembersInRoom') || t('noMembersOnline') : 'No members yet.';
      list.appendChild(li);
      return;
    }
    const onlineLabel = typeof t === 'function' ? t('memberOnline') : 'online';
    arr.forEach((name) => {
      const li = document.createElement('li');
      const youLabel = typeof t === 'function' ? t('you') : 'You';
      let line = name === myName ? `${name} (${youLabel})` : String(name);
      if (onlineSet.has(name)) {
        line += ` (${onlineLabel})`;
      }
      li.textContent = line;
      list.appendChild(li);
    });
  } catch (_) {
    list.innerHTML = '';
    const li = document.createElement('li');
    li.className = 'room-members-empty';
    li.textContent = '—';
    list.appendChild(li);
  }
}

function closeRoomMembersModal() {
  const backdrop = document.getElementById('roomMembersBackdrop');
  if (!backdrop) return;
  backdrop.hidden = true;
  backdrop.setAttribute('aria-hidden', 'true');
  const badge = document.getElementById('chatRoomBadge');
  if (badge) badge.setAttribute('aria-expanded', 'false');
}

function openRoomMembersModal() {
  if (!currentRoomId) return;
  const backdrop = document.getElementById('roomMembersBackdrop');
  const list = document.getElementById('roomMembersList');
  const title = document.getElementById('roomMembersTitle');
  if (!backdrop || !list || !title) return;
  title.textContent = typeof t === 'function' ? t('roomDetails') : 'Room details';
  const idLabel = document.getElementById('roomIdDetailLabel');
  const createdLabel = document.getElementById('roomCreatedLabel');
  const createdByLabel = document.getElementById('roomCreatedByLabel');
  const countLabel = document.getElementById('roomMemberCountLabel');
  const membersSub = document.getElementById('roomMembersSubtitle');
  if (idLabel) idLabel.textContent = t('roomId');
  if (createdLabel) createdLabel.textContent = t('roomCreated');
  if (createdByLabel) createdByLabel.textContent = t('roomCreatedBy');
  if (countLabel) countLabel.textContent = t('roomMemberCount');
  if (membersSub) membersSub.textContent = t('roomMemberNames');

  backdrop.hidden = false;
  backdrop.setAttribute('aria-hidden', 'false');
  const badge = document.getElementById('chatRoomBadge');
  if (badge) badge.setAttribute('aria-expanded', 'true');

  const room = String(currentRoomId).trim();
  updateRoomDetailsMeta({
    roomId: room,
    createdAt: null,
    memberCount: myName ? 1 : 0,
    createdBy: '',
  });

  const apiUrl = new URL(`/api/room/${encodeURIComponent(room)}/members`, window.location.origin).href;

  function paint(payload) {
    const members = Array.isArray(payload.members) ? payload.members : [];
    const online = Array.isArray(payload.online) ? payload.online : [];
    updateRoomDetailsMeta({
      roomId: payload.roomId || room,
      createdAt: payload.createdAt,
      memberCount: typeof payload.memberCount === 'number' ? payload.memberCount : members.length,
      createdBy: payload.createdBy || '',
    });
    renderRoomMembersList(members, online);
  }

  paint({ members: myName ? [myName] : [], online: myName ? [myName] : [], memberCount: myName ? 1 : 0, roomId: room });

  fetch(apiUrl, { cache: 'no-store', credentials: 'same-origin' })
    .then((res) => res.text())
    .then((text) => {
      try {
        const data = JSON.parse(text);
        if (data && data.ok) paint(data);
      } catch (_) {}
    })
    .catch(() => {});

  if (socket && socket.connected) {
    socket.emit('room_members_request', { roomId: room });
  }
}

function joinRoom(roomId, userName, create) {
  if (!roomId?.trim()) {
    document.getElementById('roomId').focus();
    return;
  }
  const nameInput = document.getElementById('userName');
  const name = (userName || nameInput.value || '').trim();
  if (!name) {
    nameInput.focus();
    nameInput.classList.add('input-error');
    setTimeout(() => nameInput.classList.remove('input-error'), 1200);
    return;
  }
  if (typeof io === 'undefined') {
    alert(
      'Cannot join rooms on this Vercel site — the chat server is not running here.\n\n' +
      'Use http://localhost:3000 after running npm start, or host the Node server on Render/Railway.'
    );
    return;
  }
  // If Profile email exists, persist mapping (email -> name)
  const email = (localStorage.getItem('nexova-profile-email') || '').trim().toLowerCase();
  if (email && email.includes('@')) {
    fetch('/api/identity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, userName: name }),
    }).catch(() => {});
  }
  myName = name;
  myLang = currentLang;
  const id = roomId.trim();
  upsertRecentRoom(id, name);

  if (!socket) {
    socket = io({
      reconnectionAttempts: 8,
      timeout: 10000,
    });
    socket.on('connect', () => {
      socket.emit('join', { roomId: id, userName: myName, userLang: currentLang });
      const badge = document.getElementById('chatRoomBadge');
      if (badge) badge.title = 'Connected';
    });
    socket.on('connect_error', () => {
      const status = document.getElementById('voiceStatus');
      const msg =
        'Cannot reach chat server. On Vercel the backend is not available — use http://localhost:3000 (npm start).';
      if (status) {
        status.hidden = false;
        status.textContent = msg;
      } else {
        alert(msg);
      }
    });
    socket.on('history', (history) => {
      roomMessagesCache = history || [];
      const container = document.getElementById('messages');
      container.innerHTML = '';
      roomMessagesCache.forEach((msg) => {
        const isSent = msg.userName === myName;
        container.appendChild(renderMessage(msg, isSent));
      });
      container.scrollTop = container.scrollHeight;
      applyChatSearch();
    });
    socket.on('message', (msg) => {
      roomMessagesCache.push(msg);
      const container = document.getElementById('messages');
      const isSent = msg.userName === myName;
      const el = renderMessage(msg, isSent);
      container.appendChild(el);
      container.scrollTop = container.scrollHeight;
      applyChatSearch();
      handleIncomingMessageSideEffects(msg, isSent, el);
    });
    socket.on('message_deleted', (payload) => {
      if (!payload || String(payload.roomId) !== String(currentRoomId)) return;
      removeMessageFromUi(payload.messageId);
    });
    socket.on('message_edited', (payload) => {
      if (!payload || String(payload.roomId) !== String(currentRoomId)) return;
      applyMessageEditToUi(payload);
    });
    socket.on('message_reported', () => {
      showTtsStatus(t('reportThanks'), 2800);
    });
    socket.on('message_error', (payload) => {
      const err = (payload && payload.error) || 'Message was not sent.';
      alert(err);
    });
    socket.on('profile_email', ({ userName, email }) => {
      const current = (myName || document.getElementById('userName').value || '').trim();
      if (!userName || !current || userName !== current) return;
      const mail = (email || '').trim();
      localStorage.setItem('nexova-profile-email', mail);
      const el = document.getElementById('profileEmail');
      if (el) el.textContent = mail || '—';
    });
    socket.on('user_joined', () => {});
    socket.on('room_members', (payload) => {
      const backdrop = document.getElementById('roomMembersBackdrop');
      if (!backdrop || backdrop.hidden) return;
      if (payload && payload.roomId && String(payload.roomId) !== String(currentRoomId)) return;
      updateRoomDetailsMeta({
        roomId: (payload && payload.roomId) || currentRoomId,
        createdAt: payload && payload.createdAt,
        memberCount:
          payload && typeof payload.memberCount === 'number'
            ? payload.memberCount
            : (payload && payload.members && payload.members.length) || 0,
        createdBy: (payload && payload.createdBy) || '',
      });
      const members = payload && Array.isArray(payload.members) ? payload.members : [];
      const online = payload && Array.isArray(payload.online) ? payload.online : [];
      renderRoomMembersList(members, online);
    });
    if (typeof window.wireVoiceCallSocket === 'function') window.wireVoiceCallSocket(socket);
    socket.on('disconnect', () => {
      if (typeof window.leaveLiveVoiceCall === 'function') window.leaveLiveVoiceCall(true);
    });
  } else {
    socket.emit('join', { roomId: id, userName: myName, userLang: currentLang });
  }
  showChat(id);
}

async function sendMessage(text, attachment) {
  const email = (localStorage.getItem('nexova-profile-email') || '').trim();
  if (!myName?.trim() || !email) {
    if (attachment) {
      alert('Add your email in Profile (Settings → Profile) to send photos, files, or links.');
    }
    return false;
  }
  const hasContent = text?.trim() || attachment;
  if (!hasContent || !socket || !currentRoomId) return false;
  if (!socket.connected) {
    alert('Not connected to chat server. Open http://localhost:3000 after running npm start.');
    return false;
  }
  const raw = (text || '').trim();
  const translatedText = raw ? await translateTextWithFallback(raw, currentLang) : '';
  const payload = {
    roomId: currentRoomId,
    text: translatedText,
    userName: myName,
    userLang: currentLang,
    email,
  };
  if (attachment) payload.attachment = attachment;
  socket.emit('message', payload);
  return true;
}

function createRoom() {
  const id = 'room-' + Math.random().toString(36).slice(2, 10);
  document.getElementById('roomId').value = id;
  joinRoom(id, document.getElementById('userName').value?.trim(), true);
}

function init() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.room-menu-wrap')) return;
    closeAllRoomRowMenus();
  });
  window.addEventListener('resize', closeAllRoomRowMenus);

  loadLocale(currentLang);
  refreshRoomsFromDb();
  const userNameInput = document.getElementById('userName');

  let emailLookupTimer = null;
  async function lookupNameByEmail(email) {
    const mail = String(email || '').trim().toLowerCase();
    if (!mail || !mail.includes('@')) return;
    try {
      const res = await fetch(`/api/identity?email=${encodeURIComponent(mail)}`);
      const data = await res.json();
      if (data && data.ok && data.userName) {
        userNameInput.value = data.userName;
      }
    } catch {}
  }
  // Auto-fill name using the email saved in Profile (if any)
  const savedProfileEmail = (localStorage.getItem('nexova-profile-email') || '').trim();
  if (savedProfileEmail) lookupNameByEmail(savedProfileEmail);

  document.getElementById('langTrigger').addEventListener('click', () => {
    const dd = document.getElementById('langDropdown');
    dd.hidden = !dd.hidden;
  });

  document.getElementById('langDropdown').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-lang]');
    if (!btn) return;
    const lang = btn.getAttribute('data-lang');
    document.getElementById('langDropdown').hidden = true;
    loadLocale(lang);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-trigger') && !e.target.closest('.lang-dropdown')) {
      document.getElementById('langDropdown').hidden = true;
    }
    if (!e.target.closest('.composer-emoji-wrap')) {
      document.getElementById('emojiPicker').hidden = true;
    }
    if (!e.target.closest('.composer-attach-wrap')) {
      document.getElementById('attachMenu').hidden = true;
      document.getElementById('attachLinkPanel').hidden = true;
    }
    if (!e.target.closest('.composer-voice-wrap')) {
      const voiceMenu = document.getElementById('voiceMenu');
      if (voiceMenu) voiceMenu.hidden = true;
      const vb = document.getElementById('voiceBtn');
      if (vb) vb.setAttribute('aria-expanded', 'false');
    }
    if (!e.target.closest('.msg-menu-wrap')) {
      closeAllMsgMenus();
      document.querySelectorAll('.msg-menu').forEach((m) => { m.hidden = true; });
    }
  });

  function insertEmojiAtCursor(emoji) {
    const input = document.getElementById('messageInput');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const val = input.value;
    input.value = val.slice(0, start) + emoji + val.slice(end);
    input.selectionStart = input.selectionEnd = start + emoji.length;
    input.focus();
    document.getElementById('emojiPicker').hidden = true;
  }

  function flagFromCode(code) {
    return String.fromCodePoint(0x1F1E6 + code.charCodeAt(0) - 65, 0x1F1E6 + code.charCodeAt(1) - 65);
  }

  const EMOJI_LIST = '😀😊🥰😎😢😡👍👋🙏❤️🔥😂🤔✨🌟💯🎉🙌👏😍🥳😇🤗💪🌈☀️🌙⭐💬📌✅❌';
  const emojiGrid = document.getElementById('emojiPickerGrid');
  Array.from(EMOJI_LIST).forEach((emoji) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = emoji;
    btn.setAttribute('aria-label', 'Insert ' + emoji);
    btn.addEventListener('click', (e) => { e.preventDefault(); insertEmojiAtCursor(emoji); });
    emojiGrid.appendChild(btn);
  });

  const HEART_EMOJI_LIST = '❤️🧡💛💚💙💜🖤🤍🤎🩷🩵🩶💔❣️💕💞💓💗💖💘💝';
  const heartsGrid = document.getElementById('emojiPickerHearts');
  Array.from(HEART_EMOJI_LIST).forEach((emoji) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = emoji;
    btn.setAttribute('aria-label', 'Insert ' + emoji);
    btn.addEventListener('click', (e) => { e.preventDefault(); insertEmojiAtCursor(emoji); });
    heartsGrid.appendChild(btn);
  });

  const FOOD_EMOJI_LIST = '🍎🍊🍋🍌🍉🍇🍓🫐🍒🍑🥭🍍🥥🥝🍅🫒🥑🥦🥬🥒🌶️🫑🌽🥕🫚🧄🧅🥔🍠🥐🥖🫓🥨🥯🥞🧇🧀🍳🥚🍖🍗🥩🦴🍕🍔🍟🌭🥪🌮🌯🫔🥙🧆🍲🫕🥣🥗🍿🧈🍞🥓🍝🍜🍛🍣🍱🥟🦪🍤🍙🍚🍘🍥🥠🥮🍢🍡🍧🍨🍦🥧🧁🍰🎂🍮🍭🍬🍫🍩🍪🌰🥜🍯🥛🍼☕🍵🧃🥤🧋🍶🍺🍻🥂🍷🥃🍸🍹🧉🍾🥄🍴🍽️';
  const foodGrid = document.getElementById('emojiPickerFood');
  Array.from(FOOD_EMOJI_LIST).forEach((emoji) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = emoji;
    btn.setAttribute('aria-label', 'Insert ' + emoji);
    btn.addEventListener('click', (e) => { e.preventDefault(); insertEmojiAtCursor(emoji); });
    foodGrid.appendChild(btn);
  });

  const COUNTRY_CODES = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW'.split(' ');
  const flagsGrid = document.getElementById('emojiPickerFlags');
  COUNTRY_CODES.forEach((code) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = flagFromCode(code);
    btn.setAttribute('aria-label', 'Insert flag ' + code);
    btn.setAttribute('title', code);
    btn.addEventListener('click', (e) => { e.preventDefault(); insertEmojiAtCursor(btn.textContent); });
    flagsGrid.appendChild(btn);
  });

  document.getElementById('emojiBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const picker = document.getElementById('emojiPicker');
    picker.hidden = !picker.hidden;
  });

  document.getElementById('joinBtn').addEventListener('click', async () => {
    // If name is empty but Profile email exists, try auto-fill from DB first
    const nameVal = document.getElementById('userName').value?.trim();
    const emailVal = (localStorage.getItem('nexova-profile-email') || '').trim();
    if (!nameVal && emailVal) await lookupNameByEmail(emailVal);
    joinRoom(document.getElementById('roomId').value, document.getElementById('userName').value?.trim(), false);
  });

  document.getElementById('createBtn').addEventListener('click', async () => {
    const nameVal = document.getElementById('userName').value?.trim();
    const emailVal = (localStorage.getItem('nexova-profile-email') || '').trim();
    if (!nameVal && emailVal) await lookupNameByEmail(emailVal);
    createRoom();
  });

  const messageInput = document.getElementById('messageInput');

  // Convert ONLY on send. Word-by-word conversion on space breaks phrases like "i am":
  // "i" + space → इ, "am" + space → अम्, so "i am" is never seen for phrase mapping.
  // Keeping input as Latin until send lets convertSegment see full phrases and translate correctly.

  document.getElementById('composer').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (localStorage.getItem('nexova-profile-email') || '').trim();
    const nameInput = document.getElementById('userName');
    const nameVal = (myName || nameInput.value || '').trim();
    if (!nameVal) {
      nameInput.focus();
      nameInput.classList.add('input-error');
      setTimeout(() => nameInput.classList.remove('input-error'), 1200);
      return;
    }
    if (!email) {
      // Force user to "log in" by setting email in Profile
      openSettings();
      openProfile();
      profileEmailEditBtn.click();
      const status = document.getElementById('voiceStatus');
      if (status) {
        status.hidden = false;
        status.textContent = 'Add your email in Profile, then send again.';
        setTimeout(() => { status.hidden = true; status.textContent = ''; }, 3500);
      } else {
        alert('Add your email in Settings → Profile, then try sending again.');
      }
      return;
    }
    if (!currentRoomId) {
      document.getElementById('joinBtn').focus();
      alert('Join or create a room first, then send your message.');
      return;
    }
    const input = document.getElementById('messageInput');
    const text = input.value;
    const sent = await sendMessage(text);
    if (sent) input.value = '';
  });

  // --- Voice commands (Web Speech API) ---
  const SPEECH_LANG = {
    en: 'en-US', fr: 'fr-FR', es: 'es-ES', pt: 'pt-BR',
    hi: 'hi-IN', mr: 'mr-IN', kn: 'kn-IN', te: 'te-IN', pa: 'pa-IN', sa: 'hi-IN'
  };
  const LANG_NAME_ALIASES = {
    en: ['english', 'अंग्रेज़ी', 'अंग्रेजी', 'angrezi'],
    fr: ['french', 'français', 'francais', 'francaise', 'फ़्रेंच', 'फ्रेंच'],
    es: ['spanish', 'español', 'espanol', 'castellano', 'स्पेनिश', 'स्पैनिश'],
    pt: ['portuguese', 'português', 'portugues', 'पोर्तुगीज़', 'पुर्तगाली'],
    hi: ['hindi', 'हिंदी', 'हिन्दी'],
    mr: ['marathi', 'मराठी'],
    kn: ['kannada', 'ಕನ್ನಡ', 'कन्नड़', 'कन्नड'],
    te: ['telugu', 'తెలుగు', 'तेलुगू', 'तेलुगु'],
    pa: ['punjabi', 'ਪੰਜਾਬੀ', 'पंजाबी'],
    sa: ['sanskrit', 'संस्कृत', 'संस्कृतम्', 'samskrit']
  };

  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const voiceBtn = document.getElementById('voiceBtn');
  const voiceStatus = document.getElementById('voiceStatus');
  let voiceRecognition = null;
  let voiceListening = false;
  let voiceBaseText = '';
  let voiceStatusTimer = null;

  function showVoiceStatus(msg, autoHideMs) {
    if (!voiceStatus) return;
    voiceStatus.textContent = msg || '';
    voiceStatus.hidden = !msg;
    if (voiceStatusTimer) clearTimeout(voiceStatusTimer);
    if (msg && autoHideMs) {
      voiceStatusTimer = setTimeout(() => {
        voiceStatus.hidden = true;
        voiceStatus.textContent = '';
      }, autoHideMs);
    }
  }

  function setVoiceListeningUI(on) {
    voiceListening = on;
    if (!voiceBtn) return;
    voiceBtn.classList.toggle('listening', on);
    if (on) voiceBtn.classList.remove('recording');
    voiceBtn.setAttribute('aria-pressed', on || voiceMsgRecording ? 'true' : 'false');
    if (on) {
      const menu = document.getElementById('voiceMenu');
      if (menu) menu.hidden = true;
      voiceBtn.setAttribute('aria-expanded', 'false');
    }
  }

  function normalizeVoiceText(s) {
    return String(s || '')
      .trim()
      .toLowerCase()
      .replace(/[.,!?।॥]/g, '')
      .replace(/\s+/g, ' ');
  }

  function matchLangFromPhrase(phrase) {
    const p = normalizeVoiceText(phrase);
    for (const code of LANG_KEYS) {
      const aliases = LANG_NAME_ALIASES[code] || [];
      for (const alias of aliases) {
        if (p === alias || p.endsWith(' ' + alias) || p.includes(' ' + alias + ' ')) return code;
      }
      const label = normalizeVoiceText(LANG_LABELS[code] || '');
      if (label && (p === label || p.endsWith(' ' + label))) return code;
    }
    return null;
  }

  function parseVoiceCommand(utterance) {
    const raw = String(utterance || '').trim();
    const text = normalizeVoiceText(raw);
    if (!text) return null;

    const stopWords = ['stop', 'stop listening', 'cancel', 'रुकें', 'रोको', 'बंद करो', 'arrêt', 'arreter', 'parar', 'detener'];
    if (stopWords.includes(text)) return { type: 'stop' };

    const clearWords = ['clear', 'clear message', 'delete', 'erase', 'मिटाओ', 'हटाओ', 'साफ करो', 'effacer', 'borrar', 'limpar'];
    if (clearWords.includes(text)) return { type: 'clear' };

    const sendCmdRe = '(?:send(?:\\s+(?:it|the\\s+message|message))?|भेजें|भेज दो|भेजो|संदेश भेजो|envoyer|enviar|envia|envíe)';
    const sendWords = [
      'send', 'send it', 'send message', 'send the message',
      'भेजें', 'भेज दो', 'भेजो', 'संदेश भेजो',
      'envoyer', 'enviar', 'envia', 'envíe'
    ];
    if (sendWords.includes(text)) return { type: 'send' };

    // "send hello" / "envoyer bonjour"
    const sendPrefix = text.match(new RegExp('^' + sendCmdRe + '\\s+(.+)$'));
    if (sendPrefix && sendPrefix[1] && !['it', 'message', 'the message'].includes(sendPrefix[1])) {
      return {
        type: 'send_text',
        text: raw.replace(new RegExp('^' + sendCmdRe + '\\s+', 'i'), '').trim(),
      };
    }

    // "my name is jerry send" → send "my name is jerry" (strip trailing command)
    const sendSuffix = text.match(new RegExp('^(.+?)\\s+' + sendCmdRe + '$'));
    if (sendSuffix && sendSuffix[1]) {
      return {
        type: 'send_text',
        text: raw.replace(new RegExp('\\s+' + sendCmdRe + '\\s*$', 'i'), '').trim(),
      };
    }

    // Language switch: "switch to hindi", "change language to spanish", "language french"
    const langCmd = text.match(/^(?:switch to|change (?:to )?language(?: to)?|set language(?: to)?|language|भाषा|langue|idioma)\s+(.+)$/);
    if (langCmd) {
      const code = matchLangFromPhrase(langCmd[1]);
      if (code) return { type: 'language', lang: code };
    }
    // Bare "hindi" / "español" when short
    const bareLang = matchLangFromPhrase(text);
    if (bareLang && text.split(' ').length <= 2) {
      // Only treat as command if it looks like a language name alone
      const aliases = LANG_NAME_ALIASES[bareLang] || [];
      if (aliases.some((a) => text === normalizeVoiceText(a)) || text === normalizeVoiceText(LANG_LABELS[bareLang] || '')) {
        return { type: 'language', lang: bareLang };
      }
    }

    return null;
  }

  async function runVoiceCommand(cmd) {
    if (!cmd) return false;
    if (cmd.type === 'stop') {
      stopVoiceListening();
      showVoiceStatus(t('voiceStopped'), 1800);
      return true;
    }
    if (cmd.type === 'clear') {
      document.getElementById('messageInput').value = '';
      voiceBaseText = '';
      showVoiceStatus(t('voiceCleared'), 1800);
      return true;
    }
    if (cmd.type === 'send' || cmd.type === 'send_text') {
      const input = document.getElementById('messageInput');
      if (cmd.type === 'send_text') {
        const base = voiceBaseText.trim();
        input.value = (base ? base + ' ' : '') + cmd.text;
        voiceBaseText = '';
      }
      stopVoiceListening();
      if (input.value.trim()) {
        document.getElementById('composer').requestSubmit();
        showVoiceStatus(t('voiceSent'), 1800);
      } else {
        showVoiceStatus(t('voiceEmpty'), 2000);
      }
      return true;
    }
    if (cmd.type === 'language' && cmd.lang) {
      stopVoiceListening();
      await loadLocale(cmd.lang);
      showVoiceStatus(t('voiceLangChanged').replace('{lang}', LANG_LABELS[cmd.lang] || cmd.lang), 2200);
      return true;
    }
    return false;
  }

  function stopVoiceListening() {
    if (voiceRecognition) {
      try { voiceRecognition.onend = null; voiceRecognition.stop(); } catch (_) {}
      voiceRecognition = null;
    }
    setVoiceListeningUI(false);
    if (voiceStatus && !voiceStatus.hidden && voiceStatus.textContent === t('voiceListening')) {
      voiceStatus.hidden = true;
      voiceStatus.textContent = '';
    }
  }

  function startVoiceListening() {
    if (!SpeechRecognitionAPI) {
      showVoiceStatus(t('voiceUnsupported'), 3500);
      return;
    }
    if (voiceListening) {
      stopVoiceListening();
      return;
    }

    const input = document.getElementById('messageInput');
    voiceBaseText = (input.value || '').trim();
    if (voiceBaseText) voiceBaseText += ' ';

    const recognition = new SpeechRecognitionAPI();
    voiceRecognition = recognition;
    recognition.lang = SPEECH_LANG[currentLang] || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceListeningUI(true);
      showVoiceStatus(t('voiceListening'));
    };

    recognition.onerror = (event) => {
      const err = event.error || '';
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        showVoiceStatus(t('voicePermission'), 4000);
      } else if (err === 'no-speech') {
        showVoiceStatus(t('voiceNoSpeech'), 2500);
      } else if (err !== 'aborted') {
        showVoiceStatus(t('voiceError'), 2500);
      }
      stopVoiceListening();
    };

    recognition.onend = () => {
      // Chrome often ends after a pause; restart while still in listening mode
      if (voiceListening && voiceRecognition === recognition) {
        try { recognition.start(); } catch (_) { setVoiceListeningUI(false); }
      } else {
        setVoiceListeningUI(false);
      }
    };

    recognition.onresult = async (event) => {
      let interim = '';
      let finalChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const transcript = res[0] && res[0].transcript ? res[0].transcript : '';
        if (res.isFinal) finalChunk += transcript;
        else interim += transcript;
      }

      if (finalChunk) {
        const cmd = parseVoiceCommand(finalChunk);
        if (cmd) {
          await runVoiceCommand(cmd);
          return;
        }
        voiceBaseText = (voiceBaseText + finalChunk).replace(/\s+/g, ' ').trim() + ' ';
        input.value = voiceBaseText.trim();
        showVoiceStatus(t('voiceListening'));
      } else if (interim) {
        input.value = (voiceBaseText + interim).trim();
      }
    };

    try {
      recognition.start();
    } catch (_) {
      showVoiceStatus(t('voiceError'), 2500);
      stopVoiceListening();
    }
  }

  if (voiceBtn) {
    if (!SpeechRecognitionAPI) {
      // Still allow voice messages via menu
    }
    voiceBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // If already listening or recording, tap mic to stop that mode
      if (voiceListening) {
        stopVoiceListening();
        showVoiceStatus(t('voiceStopped'), 1800);
        return;
      }
      if (voiceMsgRecording) {
        stopVoiceMessageRecording();
        return;
      }
      const menu = document.getElementById('voiceMenu');
      if (!menu) {
        startVoiceListening();
        return;
      }
      const open = menu.hidden;
      document.getElementById('attachMenu').hidden = true;
      document.getElementById('attachLinkPanel').hidden = true;
      menu.hidden = !open;
      voiceBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const voiceDictateBtn = document.getElementById('voiceDictateBtn');
  if (voiceDictateBtn) {
    voiceDictateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const menu = document.getElementById('voiceMenu');
      if (menu) menu.hidden = true;
      if (voiceBtn) voiceBtn.setAttribute('aria-expanded', 'false');
      if (!SpeechRecognitionAPI) {
        showVoiceStatus(t('voiceUnsupported'), 3500);
        return;
      }
      startVoiceListening();
    });
  }

  // Voice message recording (audio clip attachment)
  const voiceMsgBtn = document.getElementById('voiceMsgBtn');
  let mediaRecorder = null;
  let voiceMsgChunks = [];
  let voiceMsgStart = 0;
  let voiceMsgStream = null;
  let voiceMsgRecording = false;

  function setVoiceBusyUI(mode) {
    if (!voiceBtn) return;
    voiceBtn.classList.toggle('listening', mode === 'dictate');
    voiceBtn.classList.toggle('recording', mode === 'record');
    voiceBtn.setAttribute('aria-pressed', mode ? 'true' : 'false');
  }

  async function stopVoiceMessageRecording() {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      voiceMsgRecording = false;
      setVoiceBusyUI(null);
      if (voiceMsgStream) {
        voiceMsgStream.getTracks().forEach((tr) => tr.stop());
        voiceMsgStream = null;
      }
      return;
    }
    return new Promise((resolve) => {
      mediaRecorder.onstop = async () => {
        const durationSec = Math.max(0.5, (Date.now() - voiceMsgStart) / 1000);
        const mime = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(voiceMsgChunks, { type: mime });
        voiceMsgChunks = [];
        if (voiceMsgStream) {
          voiceMsgStream.getTracks().forEach((tr) => tr.stop());
          voiceMsgStream = null;
        }
        voiceMsgRecording = false;
        setVoiceBusyUI(null);
        showVoiceStatus(t('voiceMessageSending'), 1500);
        try {
          const dataUrl = await new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(blob);
          });
          const caption = document.getElementById('messageInput').value.trim();
          const sent = await sendMessage(caption, {
            type: 'audio',
            data: dataUrl,
            mime,
            duration: durationSec,
          });
          if (sent) document.getElementById('messageInput').value = '';
        } catch (_) {
          showVoiceStatus(t('voiceMessageError'), 2500);
        }
        resolve();
      };
      try { mediaRecorder.stop(); } catch (_) { resolve(); }
    });
  }

  async function startVoiceMessageRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showVoiceStatus(t('voiceMessageUnsupported'), 3000);
      return;
    }
    if (voiceListening) stopVoiceListening();
    try {
      voiceMsgStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceMsgChunks = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';
      mediaRecorder = mimeType ? new MediaRecorder(voiceMsgStream, { mimeType }) : new MediaRecorder(voiceMsgStream);
      mediaRecorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size) voiceMsgChunks.push(ev.data);
      };
      voiceMsgStart = Date.now();
      mediaRecorder.start();
      voiceMsgRecording = true;
      setVoiceBusyUI('record');
      showVoiceStatus(t('voiceMessageRecording'));
      setTimeout(() => {
        if (voiceMsgRecording) stopVoiceMessageRecording();
      }, 60000);
    } catch (_) {
      showVoiceStatus(t('voicePermission'), 3500);
    }
  }

  if (voiceMsgBtn) {
    voiceMsgBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const menu = document.getElementById('voiceMenu');
      if (menu) menu.hidden = true;
      if (voiceBtn) voiceBtn.setAttribute('aria-expanded', 'false');
      if (voiceMsgRecording) await stopVoiceMessageRecording();
      else await startVoiceMessageRecording();
    });
  }

  // —— Live voice call (WebRTC mesh via Socket.io signaling) ——
  const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];
  let voiceCallActive = false;
  let voiceCallSelfId = null;
  let voiceCallLocalStream = null;
  const voiceCallPcs = new Map(); // peerId -> RTCPeerConnection
  const voiceCallPendingIce = new Map(); // peerId -> RTCIceCandidateInit[]
  const voiceCallPeerNames = new Map(); // peerId -> userName
  const voiceCallAudioEls = new Map();
  let voiceCallStartedAt = 0;
  let voiceCallTimerId = null;
  let voiceCallMuted = false;

  function formatCallDuration(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    if (h > 0) return `${h}:${mm}:${ss}`;
    return `${mm}:${ss}`;
  }

  function updateVoiceCallTimer() {
    const el = document.getElementById('voiceCallTimer');
    if (!el || !voiceCallStartedAt) return;
    el.textContent = formatCallDuration(Date.now() - voiceCallStartedAt);
  }

  function callInitials(name) {
    const parts = String(name || '?').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function renderVoiceCallTiles() {
    const grid = document.getElementById('voiceCallGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const entries = [];
    if (voiceCallSelfId) {
      entries.push({ id: voiceCallSelfId, name: myName || 'You', self: true });
    }
    voiceCallPeerNames.forEach((name, id) => {
      if (id === voiceCallSelfId) return;
      entries.push({ id, name, self: false });
    });
    entries.forEach(({ id, name, self }) => {
      const tile = document.createElement('div');
      tile.className = 'voice-call-tile' + (self ? ' is-self' : '');
      if (self && voiceCallMuted) tile.classList.add('is-muted');
      tile.dataset.socketId = id;
      const avatar = document.createElement('div');
      avatar.className = 'voice-call-avatar';
      avatar.textContent = callInitials(name);
      const label = document.createElement('div');
      label.className = 'voice-call-name';
      label.textContent = name;
      if (self) {
        const you = document.createElement('div');
        you.className = 'voice-call-you';
        you.textContent = '(' + (typeof t === 'function' ? t('you') : 'You') + ')';
        label.appendChild(document.createTextNode(' '));
        label.appendChild(you);
      }
      tile.appendChild(avatar);
      tile.appendChild(label);
      grid.appendChild(tile);
    });
  }

  function showVoiceCallOverlay() {
    const overlay = document.getElementById('voiceCallOverlay');
    if (!overlay) return;
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    const title = document.getElementById('voiceCallTitle');
    if (title) title.textContent = typeof t === 'function' ? t('liveVoiceCall') : 'Live voice call';
    renderVoiceCallTiles();
    updateVoiceCallTimer();
    if (voiceCallTimerId) clearInterval(voiceCallTimerId);
    voiceCallTimerId = setInterval(updateVoiceCallTimer, 1000);
    if (voiceBtn) voiceBtn.classList.add('in-call');
  }

  function hideVoiceCallOverlay() {
    const overlay = document.getElementById('voiceCallOverlay');
    if (overlay) {
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
    }
    if (voiceCallTimerId) {
      clearInterval(voiceCallTimerId);
      voiceCallTimerId = null;
    }
    if (voiceBtn) voiceBtn.classList.remove('in-call');
  }

  async function ensureVoiceCallMic() {
    if (voiceCallLocalStream) return voiceCallLocalStream;
    voiceCallLocalStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
      video: false,
    });
    return voiceCallLocalStream;
  }

  function sendVoiceSignal(to, data) {
    if (!socket || !socket.connected || !currentRoomId) return;
    socket.emit('voice_call_signal', { roomId: currentRoomId, to, data });
  }

  async function flushPendingIce(peerId, pc) {
    const pending = voiceCallPendingIce.get(peerId) || [];
    voiceCallPendingIce.delete(peerId);
    for (const cand of pending) {
      try {
        await pc.addIceCandidate(cand);
      } catch (_) {}
    }
  }

  async function createVoicePeerConnection(peerId, peerName, isInitiator) {
    if (voiceCallPcs.has(peerId)) return voiceCallPcs.get(peerId);
    const stream = await ensureVoiceCallMic();
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    voiceCallPcs.set(peerId, pc);
    voiceCallPeerNames.set(peerId, peerName || 'Member');
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.onicecandidate = (ev) => {
      if (ev.candidate) sendVoiceSignal(peerId, { type: 'ice', candidate: ev.candidate });
    };
    pc.ontrack = (ev) => {
      let audio = voiceCallAudioEls.get(peerId);
      if (!audio) {
        audio = document.createElement('audio');
        audio.autoplay = true;
        audio.playsInline = true;
        audio.style.display = 'none';
        document.body.appendChild(audio);
        voiceCallAudioEls.set(peerId, audio);
      }
      if (ev.streams && ev.streams[0]) audio.srcObject = ev.streams[0];
      else {
        const ms = new MediaStream([ev.track]);
        audio.srcObject = ms;
      }
      audio.play().catch(() => {});
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        cleanupVoicePeer(peerId);
        renderVoiceCallTiles();
      }
    };

    if (isInitiator) {
      const offer = await pc.createOffer({ offerToReceiveAudio: true });
      await pc.setLocalDescription(offer);
      sendVoiceSignal(peerId, { type: 'offer', sdp: pc.localDescription });
    }
    renderVoiceCallTiles();
    return pc;
  }

  function cleanupVoicePeer(peerId) {
    const pc = voiceCallPcs.get(peerId);
    if (pc) {
      try { pc.close(); } catch (_) {}
      voiceCallPcs.delete(peerId);
    }
    const audio = voiceCallAudioEls.get(peerId);
    if (audio) {
      try { audio.srcObject = null; audio.remove(); } catch (_) {}
      voiceCallAudioEls.delete(peerId);
    }
    voiceCallPendingIce.delete(peerId);
    voiceCallPeerNames.delete(peerId);
  }

  async function handleVoiceSignal(from, fromName, data) {
    if (!data || !from) return;
    let pc = voiceCallPcs.get(from);
    if (data.type === 'offer') {
      if (!pc) pc = await createVoicePeerConnection(from, fromName, false);
      else if (fromName) voiceCallPeerNames.set(from, fromName);
      await pc.setRemoteDescription(data.sdp);
      await flushPendingIce(from, pc);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendVoiceSignal(from, { type: 'answer', sdp: pc.localDescription });
      renderVoiceCallTiles();
      return;
    }
    if (data.type === 'answer') {
      if (!pc) return;
      await pc.setRemoteDescription(data.sdp);
      await flushPendingIce(from, pc);
      return;
    }
    if (data.type === 'ice' && data.candidate) {
      if (!pc || !pc.remoteDescription) {
        const list = voiceCallPendingIce.get(from) || [];
        list.push(data.candidate);
        voiceCallPendingIce.set(from, list);
        return;
      }
      try {
        await pc.addIceCandidate(data.candidate);
      } catch (_) {}
    }
  }

  async function leaveLiveVoiceCall(silent) {
    if (!voiceCallActive && !voiceCallLocalStream) {
      hideVoiceCallOverlay();
      return;
    }
    if (socket && socket.connected && !silent) {
      socket.emit('voice_call_leave');
    }
    [...voiceCallPcs.keys()].forEach(cleanupVoicePeer);
    voiceCallPeerNames.clear();
    if (voiceCallLocalStream) {
      voiceCallLocalStream.getTracks().forEach((tr) => tr.stop());
      voiceCallLocalStream = null;
    }
    voiceCallActive = false;
    voiceCallSelfId = null;
    voiceCallMuted = false;
    voiceCallStartedAt = 0;
    const muteBtn = document.getElementById('voiceCallMuteBtn');
    if (muteBtn) {
      muteBtn.setAttribute('aria-pressed', 'false');
      muteBtn.textContent = typeof t === 'function' ? t('muteMic') : 'Mute';
    }
    hideVoiceCallOverlay();
  }

  async function joinLiveVoiceCall() {
    if (!currentRoomId) {
      showVoiceStatus(typeof t === 'function' ? t('joinRoomFirst') : 'Join a room first.', 2500);
      return;
    }
    if (!socket || !socket.connected) {
      showVoiceStatus(typeof t === 'function' ? t('voiceCallNeedServer') : 'Connect to the chat server first.', 3000);
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showVoiceStatus(typeof t === 'function' ? t('voiceCallUnsupported') : 'Live voice calls are not supported here.', 3000);
      return;
    }
    if (voiceCallActive) {
      showVoiceCallOverlay();
      return;
    }
    if (voiceListening) stopVoiceListening();
    if (voiceMsgRecording) await stopVoiceMessageRecording();
    try {
      await ensureVoiceCallMic();
    } catch (_) {
      showVoiceStatus(typeof t === 'function' ? t('voicePermission') : 'Microphone permission needed.', 3500);
      return;
    }
    voiceCallActive = true;
    voiceCallMuted = false;
    showVoiceCallOverlay();
    showVoiceStatus(typeof t === 'function' ? t('voiceCallConnecting') : 'Connecting to voice call…', 2000);
    socket.emit('voice_call_join', { roomId: currentRoomId, userName: myName });
  }

  function wireVoiceCallSocket(sock) {
    if (!sock || sock._nexovaVoiceWired) return;
    sock._nexovaVoiceWired = true;

    sock.on('voice_call_joined', async (payload) => {
      if (!payload || String(payload.roomId) !== String(currentRoomId)) return;
      voiceCallActive = true;
      voiceCallSelfId = payload.selfId;
      voiceCallStartedAt = payload.startedAt || Date.now();
      voiceCallPeerNames.clear();
      (payload.peers || []).forEach((p) => {
        if (p && p.socketId) voiceCallPeerNames.set(p.socketId, p.userName || 'Member');
      });
      showVoiceCallOverlay();
      const existing = payload.existingPeers || [];
      for (const p of existing) {
        try {
          await createVoicePeerConnection(p.socketId, p.userName, true);
        } catch (err) {
          console.warn('voice peer failed', err);
        }
      }
      renderVoiceCallTiles();
    });

    sock.on('voice_call_peer_joined', async (payload) => {
      if (!voiceCallActive || !payload || String(payload.roomId) !== String(currentRoomId)) return;
      if (payload.startedAt) voiceCallStartedAt = payload.startedAt;
      const peer = payload.peer;
      if (peer && peer.socketId && peer.socketId !== voiceCallSelfId) {
        voiceCallPeerNames.set(peer.socketId, peer.userName || 'Member');
        // Existing peers wait for offer from the new joiner
        renderVoiceCallTiles();
      }
    });

    sock.on('voice_call_peer_left', (payload) => {
      if (!payload) return;
      cleanupVoicePeer(payload.socketId);
      renderVoiceCallTiles();
    });

    sock.on('voice_call_signal', async (payload) => {
      if (!voiceCallActive || !payload || String(payload.roomId) !== String(currentRoomId)) return;
      try {
        await handleVoiceSignal(payload.from, payload.fromName, payload.data);
      } catch (err) {
        console.warn('voice signal error', err);
      }
    });

    sock.on('voice_call_peer_mute', (payload) => {
      if (!payload) return;
      const tile = document.querySelector(`.voice-call-tile[data-socket-id="${payload.socketId}"]`);
      if (tile) tile.classList.toggle('is-muted', !!payload.muted);
    });

    sock.on('voice_call_error', (payload) => {
      showVoiceStatus((payload && payload.error) || 'Voice call failed.', 3000);
      leaveLiveVoiceCall(true);
    });

    sock.on('voice_call_state', (payload) => {
      if (!voiceCallActive || !payload) return;
      if (payload.startedAt) voiceCallStartedAt = payload.startedAt;
      if (Array.isArray(payload.peers)) {
        const keep = new Set(payload.peers.map((p) => p.socketId));
        [...voiceCallPeerNames.keys()].forEach((id) => {
          if (id !== voiceCallSelfId && !keep.has(id)) cleanupVoicePeer(id);
        });
        payload.peers.forEach((p) => {
          if (p && p.socketId) voiceCallPeerNames.set(p.socketId, p.userName || 'Member');
        });
        renderVoiceCallTiles();
      }
    });
  }

  // expose for socket disconnect / room leave
  window.leaveLiveVoiceCall = leaveLiveVoiceCall;
  window.wireVoiceCallSocket = wireVoiceCallSocket;

  const voiceCallBtn = document.getElementById('voiceCallBtn');
  if (voiceCallBtn) {
    voiceCallBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const menu = document.getElementById('voiceMenu');
      if (menu) menu.hidden = true;
      if (voiceBtn) voiceBtn.setAttribute('aria-expanded', 'false');
      await joinLiveVoiceCall();
    });
  }

  const voiceCallMuteBtnEl = document.getElementById('voiceCallMuteBtn');
  if (voiceCallMuteBtnEl) {
    voiceCallMuteBtnEl.addEventListener('click', () => {
      if (!voiceCallLocalStream) return;
      voiceCallMuted = !voiceCallMuted;
      voiceCallLocalStream.getAudioTracks().forEach((tr) => {
        tr.enabled = !voiceCallMuted;
      });
      voiceCallMuteBtnEl.setAttribute('aria-pressed', voiceCallMuted ? 'true' : 'false');
      voiceCallMuteBtnEl.textContent = voiceCallMuted
        ? (typeof t === 'function' ? t('unmuteMic') : 'Unmute')
        : (typeof t === 'function' ? t('muteMic') : 'Mute');
      if (socket && socket.connected) socket.emit('voice_call_mute', { muted: voiceCallMuted });
      renderVoiceCallTiles();
    });
  }

  const voiceCallLeaveBtnEl = document.getElementById('voiceCallLeaveBtn');
  if (voiceCallLeaveBtnEl) {
    voiceCallLeaveBtnEl.addEventListener('click', () => leaveLiveVoiceCall(false));
  }

  const muteRoomBtn = document.getElementById('muteRoomBtn');
  if (muteRoomBtn) {
    muteRoomBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentRoomId) return;
      const next = !isRoomMuted(currentRoomId);
      setRoomMuted(currentRoomId, next);
      showVoiceStatus(next ? t('roomMuted') : t('roomUnmuted'), 2200);
    });
  }

  const attachBtn = document.getElementById('attachBtn');
  const attachMenu = document.getElementById('attachMenu');
  const attachLinkPanel = document.getElementById('attachLinkPanel');
  const attachMediaInput = document.getElementById('attachMediaInput');
  const attachDocInput = document.getElementById('attachDocInput');
  const attachLinkInput = document.getElementById('attachLinkInput');
  const attachLinkAdd = document.getElementById('attachLinkAdd');

  attachBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    attachLinkPanel.hidden = true;
    attachMenu.hidden = !attachMenu.hidden;
  });

  // Photo/Document: native <label for> — do not hide the menu in the same click (can block the picker on some browsers).

  document.getElementById('attachLink').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    attachMenu.hidden = true;
    attachLinkInput.value = '';
    attachLinkPanel.hidden = false;
    attachLinkInput.focus();
  });

  attachMediaInput.addEventListener('change', () => {
    attachMenu.hidden = true;
    attachLinkPanel.hidden = true;
    const file = attachMediaInput.files && attachMediaInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const caption = document.getElementById('messageInput').value.trim();
      await sendMessage(caption, { type: 'media', data: reader.result, mime: file.type });
      document.getElementById('messageInput').value = '';
      attachMediaInput.value = '';
    };
    reader.onerror = () => {
      attachMediaInput.value = '';
    };
    reader.readAsDataURL(file);
  });

  attachDocInput.addEventListener('change', () => {
    attachMenu.hidden = true;
    attachLinkPanel.hidden = true;
    const file = attachDocInput.files && attachDocInput.files[0];
    if (!file) return;
    const maxBytes = 12 * 1024 * 1024; // under MongoDB 16MB doc limit
    if (file.size > maxBytes) {
      alert('File is too large (max 12 MB). Try a smaller file.');
      attachDocInput.value = '';
      return;
    }
    const caption = document.getElementById('messageInput').value.trim();
    const reader = new FileReader();
    reader.onload = async () => {
      await sendMessage(caption, {
        type: 'document',
        name: file.name,
        mime: file.type || 'application/octet-stream',
        data: reader.result,
      });
      document.getElementById('messageInput').value = '';
      attachDocInput.value = '';
    };
    reader.onerror = () => {
      alert('Could not read that file. Try again.');
      attachDocInput.value = '';
    };
    reader.readAsDataURL(file);
  });

  attachLinkAdd.addEventListener('click', () => {
    const url = attachLinkInput.value.trim();
    if (!url) return;
    const caption = document.getElementById('messageInput').value.trim();
    sendMessage(caption || url, { type: 'link', url: url });
    document.getElementById('messageInput').value = '';
    attachLinkInput.value = '';
    attachLinkPanel.hidden = true;
  });
  attachLinkInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attachLinkAdd.click();
  });

  const settingsBtn = document.getElementById('settingsBtn');
  const settingsSlider = document.getElementById('settingsSlider');
  const settingsOverlay = document.getElementById('settingsOverlay');
  const settingsClose = document.getElementById('settingsClose');

  function openSettings() {
    settingsOverlay.setAttribute('aria-hidden', 'false');
    settingsOverlay.classList.add('visible');
    settingsSlider.classList.add('open');
  }

  function closeSettings() {
    settingsOverlay.classList.remove('visible');
    settingsSlider.classList.remove('open');
    settingsOverlay.setAttribute('aria-hidden', 'true');
  }

  const chatSearchInput = document.getElementById('chatSearchInput');
  if (chatSearchInput) {
    chatSearchInput.addEventListener('input', scheduleChatSearch);
    chatSearchInput.addEventListener('search', applyChatSearch);
  }

  const chatRoomBadge = document.getElementById('chatRoomBadge');
  const roomMembersBackdrop = document.getElementById('roomMembersBackdrop');
  const roomMembersClose = document.getElementById('roomMembersClose');
  if (chatRoomBadge) {
    chatRoomBadge.addEventListener('click', (e) => {
      e.preventDefault();
      openRoomMembersModal();
    });
  }
  if (roomMembersClose) roomMembersClose.addEventListener('click', closeRoomMembersModal);
  if (roomMembersBackdrop) {
    roomMembersBackdrop.addEventListener('click', (e) => {
      if (e.target === roomMembersBackdrop) closeRoomMembersModal();
    });
  }

  settingsBtn.addEventListener('click', openSettings);
  settingsClose.addEventListener('click', closeSettings);
  settingsOverlay.addEventListener('click', () => {
    if (profileSlider.classList.contains('open')) closeProfile();
    else closeSettings();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (voiceListening) {
        stopVoiceListening();
        showVoiceStatus(t('voiceStopped'), 1800);
        return;
      }
      const rm = document.getElementById('roomMembersBackdrop');
      if (rm && !rm.hidden) closeRoomMembersModal();
      else if (profileSlider.classList.contains('open')) closeProfile();
      else if (settingsSlider.classList.contains('open')) closeSettings();
    }
  });

  const profileSlider = document.getElementById('profileSlider');
  const profileBack = document.getElementById('profileBack');
  const profileNameEl = document.getElementById('profileName');
  const profileEmailEl = document.getElementById('profileEmail');
  const profileInitialsEl = document.getElementById('profileInitials');
  const profileAvatarEl = document.getElementById('profileAvatar');
  const profileAvatarEditBtn = document.getElementById('profileAvatarEdit');
  const profileAvatarInput = document.getElementById('profileAvatarInput');

  const profileEmailEditBtn = document.getElementById('profileEmailEdit');
  const profileEmailEditRow = document.getElementById('profileEmailEditRow');
  const profileEmailInput = document.getElementById('profileEmailInput');
  const profileEmailSave = document.getElementById('profileEmailSave');

  function openProfile() {
    closeSettings();
    settingsOverlay.classList.add('visible');
    settingsOverlay.setAttribute('aria-hidden', 'false');
    profileSlider.classList.add('open');
    const name = myName || document.getElementById('userName').value?.trim() || 'Guest';
    const email = localStorage.getItem('nexova-profile-email') || '';
    profileNameEl.textContent = name || '—';
    profileEmailEl.textContent = email || '—';
    profileEmailEl.classList.remove('hide-for-edit');
    profileEmailEditRow.classList.remove('visible');
    profileEmailEditRow.setAttribute('aria-hidden', 'true');
    profileEmailInput.value = email || '';
    const parts = name.split(/\s+/).filter(Boolean);
    profileInitialsEl.textContent = parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name ? name.slice(0, 2).toUpperCase() : '?';
    const img = localStorage.getItem('nexova-profile-image');
    if (img) {
      profileAvatarEl.style.backgroundImage = 'url(' + img + ')';
      profileAvatarEl.classList.add('has-image');
    } else {
      profileAvatarEl.style.backgroundImage = '';
      profileAvatarEl.classList.remove('has-image');
    }

    // If connected, fetch email from DB for this userName
    if (socket && socket.connected && name && name !== 'Guest') {
      socket.emit('profile_email_get', { userName: name });
    }
  }

  profileAvatarEditBtn.addEventListener('click', () => profileAvatarInput.click());
  profileAvatarInput.addEventListener('change', () => {
    const file = profileAvatarInput.files && profileAvatarInput.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      localStorage.setItem('nexova-profile-image', dataUrl);
      profileAvatarEl.style.backgroundImage = 'url(' + dataUrl + ')';
      profileAvatarEl.classList.add('has-image');
    };
    reader.readAsDataURL(file);
    profileAvatarInput.value = '';
  });

  profileEmailEditBtn.addEventListener('click', () => {
    profileEmailEl.classList.add('hide-for-edit');
    profileEmailEditRow.classList.add('visible');
    profileEmailEditRow.setAttribute('aria-hidden', 'false');
    profileEmailInput.value = profileEmailEl.textContent === '—' ? '' : profileEmailEl.textContent;
    profileEmailInput.focus();
  });

  profileEmailSave.addEventListener('click', () => {
    const email = profileEmailInput.value.trim();
    if (email) localStorage.setItem('nexova-profile-email', email);
    else localStorage.removeItem('nexova-profile-email');
    profileEmailEl.textContent = email || '—';
    profileEmailEl.classList.remove('hide-for-edit');
    profileEmailEditRow.classList.remove('visible');
    profileEmailEditRow.setAttribute('aria-hidden', 'true');

    // Save to MongoDB (keyed by userName) if connected
    const name = (myName || document.getElementById('userName').value || '').trim();
    if (socket && socket.connected && name) {
      socket.emit('profile_email_set', { userName: name, email });
    }

    // Also store mapping email -> name for auto-fill on next visit
    if (email && name) {
      fetch('/api/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), userName: name }),
      }).catch(() => {});
    }
  });

  profileEmailInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') profileEmailSave.click();
  });

  const profileSignOut = document.getElementById('profileSignOut');
  profileSignOut.addEventListener('click', () => {
    // Do NOT delete from DB; just clear local session/email display.
    localStorage.removeItem('nexova-profile-email');
    profileEmailEl.textContent = '—';
    profileEmailInput.value = '';
    profileEmailEl.classList.remove('hide-for-edit');
    profileEmailEditRow.classList.remove('visible');
    profileEmailEditRow.setAttribute('aria-hidden', 'true');

    // Clear local name/session so user must re-enter name
    myName = '';
    const nameInput = document.getElementById('userName');
    nameInput.value = '';
    document.getElementById('roomId').value = '';
    renderRecentRooms();
    closeProfile();
    closeSettings();
    showWelcome();
  });

  function closeProfile() {
    profileSlider.classList.remove('open');
    settingsOverlay.classList.remove('visible');
    settingsOverlay.setAttribute('aria-hidden', 'true');
  }

  document.getElementById('settingsProfile').addEventListener('click', openProfile);
  profileBack.addEventListener('click', () => {
    closeProfile();
    openSettings();
  });
  const settingsThemeBtn = document.getElementById('settingsTheme');
  const settingsThemeSection = document.getElementById('settingsThemeSection');
  const settingsWallpaperSection = document.getElementById('settingsWallpaperSection');
  const settingsVoiceBtn = document.getElementById('settingsVoice');
  const settingsVoiceSection = document.getElementById('settingsVoiceSection');
  const settingsAlertsBtn = document.getElementById('settingsAlerts');
  const settingsAlertsSection = document.getElementById('settingsAlertsSection');
  const themeCards = settingsThemeSection ? settingsThemeSection.querySelectorAll('.theme-card[data-theme-key]') : [];
  const wallpaperCards = settingsWallpaperSection ? settingsWallpaperSection.querySelectorAll('.wallpaper-card') : [];

  function hideAllSettingsSections() {
    if (settingsThemeSection) settingsThemeSection.hidden = true;
    if (settingsWallpaperSection) settingsWallpaperSection.hidden = true;
    if (settingsVoiceSection) settingsVoiceSection.hidden = true;
    if (settingsAlertsSection) settingsAlertsSection.hidden = true;
  }

  function applyTtsVoiceGender(gender) {
    ttsVoiceGender = gender === 'male' ? 'male' : 'female';
    localStorage.setItem(TTS_VOICE_KEY, ttsVoiceGender);
    document.querySelectorAll('.voice-card[data-voice-gender]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-voice-gender') === ttsVoiceGender);
    });
  }

  applyTtsVoiceGender(ttsVoiceGender);
  ensureTtsVoices();
  document.querySelectorAll('.voice-card[data-voice-gender]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTtsVoiceGender(btn.getAttribute('data-voice-gender'));
    });
  });
  const voicePreviewBtn = document.getElementById('voicePreviewBtn');
  if (voicePreviewBtn) {
    voicePreviewBtn.addEventListener('click', () => {
      const sample = t('voicePreviewSample').replace('{lang}', LANG_LABELS[currentLang] || currentLang);
      speakMessageText(sample);
    });
  }
  if (settingsVoiceBtn && settingsVoiceSection) {
    settingsVoiceBtn.addEventListener('click', () => {
      openSettings();
      hideAllSettingsSections();
      settingsVoiceSection.hidden = false;
    });
  }

  const autoReadToggle = document.getElementById('autoReadToggle');
  const notifyToggle = document.getElementById('notifyToggle');
  const notifyEnableBtn = document.getElementById('notifyEnableBtn');
  if (autoReadToggle) {
    autoReadToggle.checked = autoReadIncoming;
    autoReadToggle.addEventListener('change', () => {
      autoReadIncoming = !!autoReadToggle.checked;
      localStorage.setItem(AUTO_READ_KEY, autoReadIncoming ? '1' : '0');
    });
  }
  if (notifyToggle) {
    notifyToggle.checked = desktopNotifyEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted';
    notifyToggle.addEventListener('change', async () => {
      if (notifyToggle.checked) {
        if (typeof Notification === 'undefined') {
          notifyToggle.checked = false;
          alert(t('notifyUnsupported'));
          return;
        }
        let perm = Notification.permission;
        if (perm === 'default') perm = await Notification.requestPermission();
        if (perm !== 'granted') {
          notifyToggle.checked = false;
          desktopNotifyEnabled = false;
          localStorage.setItem(NOTIFY_KEY, '0');
          showVoiceStatus(t('notifyDenied'), 3000);
          return;
        }
        desktopNotifyEnabled = true;
        localStorage.setItem(NOTIFY_KEY, '1');
      } else {
        desktopNotifyEnabled = false;
        localStorage.setItem(NOTIFY_KEY, '0');
      }
    });
  }
  if (notifyEnableBtn) {
    notifyEnableBtn.addEventListener('click', async () => {
      if (typeof Notification === 'undefined') {
        alert(t('notifyUnsupported'));
        return;
      }
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        desktopNotifyEnabled = true;
        localStorage.setItem(NOTIFY_KEY, '1');
        if (notifyToggle) notifyToggle.checked = true;
        showVoiceStatus(t('notifyEnabled'), 2200);
      } else {
        showVoiceStatus(t('notifyDenied'), 3000);
      }
    });
  }
  if (settingsAlertsBtn && settingsAlertsSection) {
    settingsAlertsBtn.addEventListener('click', () => {
      openSettings();
      hideAllSettingsSections();
      settingsAlertsSection.hidden = false;
    });
  }

  function applyTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('nexova-theme', theme);
    themeCards.forEach((btn) => {
      const key = btn.getAttribute('data-theme-key');
      btn.classList.toggle('is-active', key === theme);
    });
  }

  if (themeCards.length) {
    applyTheme(currentTheme);
    themeCards.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-theme-key');
        if (key) applyTheme(key);
      });
    });
  }

  function applyWallpaper(key) {
    currentWallpaper = key;
    document.body.setAttribute('data-wallpaper', key);
    localStorage.setItem('nexova-wallpaper', key);
    wallpaperCards.forEach((btn) => {
      const k = btn.getAttribute('data-wallpaper-key');
      btn.classList.toggle('is-active', k === key);
    });
  }

  if (wallpaperCards.length) {
    applyWallpaper(currentWallpaper);
    wallpaperCards.forEach((btn) => {
      btn.addEventListener('click', () => {
        const k = btn.getAttribute('data-wallpaper-key');
        if (k) applyWallpaper(k);
      });
    });
  }

  settingsThemeBtn.addEventListener('click', () => {
    openSettings();
    hideAllSettingsSections();
    if (settingsThemeSection) settingsThemeSection.hidden = false;
    if (settingsWallpaperSection) settingsWallpaperSection.hidden = false;
  });
}

init();
