# Realtime Chat App (updated UI)

## What is included
This zip contains a minimal full-stack realtime chat app with an updated WhatsApp-style UI:
- Backend: `server.js` (Express + Socket.IO + MongoDB + JWT auth)
- Models: `models/User.js`, `models/Message.js`
- Frontend: `public/index.html`, `public/style.css` (modern UI with light/dark modes)
- `package.json` and `.env.example`

## How to run
1. Make sure Node.js and MongoDB (or Atlas) are available.
2. Unzip, open folder, copy `.env.example` -> `.env` and update if needed.
3. `npm install`
4. `npm start`
5. Open `http://localhost:5000`

If you want the version without needing MongoDB, tell me and I will prepare an in-memory variant.
