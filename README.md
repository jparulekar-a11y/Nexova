# MultiLang Chat

A WhatsApp-style chat app with support for **9 options**: English, Hindi, Marathi, Spanish, Kannada, Telugu, Punjabi, Sanskrit, and **Sign Language (ASL)** for accessibility.

## Features

- **Multi-language UI** – Switch the entire interface between English, हिंदी, मराठी, Español, ಕನ್ನಡ, తెలుగు, ਪੰਜਾਬੀ, संस्कृतम्, and 👋 Sign Language (ASL).
- **Sign language (ASL)** – For deaf and hard-of-hearing users: choose "Sign Language (ASL)" and use **"Show in Sign"** on any message to see finger-spelling (letters A–Z and 0–9).
- **Real-time chat** – Messages are delivered instantly via Socket.io.
- **Rooms** – Join with a shared Room ID or create a new room (share the generated ID with others).
- **Persistent language** – Your selected language is saved in the browser.

## Quick start

```bash
cd MultiLang
npm install
npm start
```

Open **http://localhost:3000** in your browser. Choose a language, enter your name and a room ID (or create a room), then start chatting.

## Tech stack

- **Backend:** Node.js, Express, Socket.io
- **Frontend:** Vanilla HTML/CSS/JS, responsive layout
- **i18n:** JSON locale files per language

## Project structure

```
MultiLang/
├── server.js           # Express + Socket.io server
├── package.json
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── locales/        # en, hi, mr, es, kn, te, pa, sa, asl
└── README.md
```

## Adding more languages

1. Add a new JSON file in `public/locales/` (e.g. `fr.json`) with the same keys as `en.json`.
2. Add the language to `LANG_KEYS` and `LANG_LABELS` in `app.js`.
3. Add a dropdown button in `index.html` with `data-lang="fr"` and the label.
