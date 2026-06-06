# 📓 Noted — Colorful Notes App

A fun, colorful notes app built with **React** (frontend) and **Express** (backend). Create, color-code, pin, edit, and set due dates on your notes.

---

## ✨ Features

- 🎨 **Color-coded notes** — 6 color themes per note
- 📌 **Pin notes** — keep important ones at the top
- ✏️ **Inline editing** — edit notes without leaving the page
- 🗓 **Due dates** — set reminders with overdue/today/upcoming badges
- 🔍 **Search & filter** — find notes instantly
- 📊 **Stats bar** — see total, pinned, and due-today counts at a glance

---

## 🛠 Tech Stack

| Layer    | Tech              |
|----------|-------------------|
| Frontend | React, CSS-in-JS  |
| Backend  | Node.js, Express  |
| Icons    | Tabler Icons      |
| Fonts    | Nunito (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/notes-app.git
cd notes-app
```

### 2. Start the backend

```bash
cd server
npm install
node server.js
```

The backend runs on `http://localhost:5000`.

### 3. Start the frontend

```bash
cd client
npm install
npm start
```

The app opens at `http://localhost:3000`.

---

## 📡 API Endpoints

| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| GET    | `/notes`          | Get all notes     |
| POST   | `/notes`          | Create a note     |
| PATCH  | `/notes/:id`      | Edit or pin a note|
| DELETE | `/notes/:id`      | Delete a note     |

---

## 📁 Project Structure

```
notes-app/
├── client/
│   ├── public/
│   │   └── index.html        # Font & icon CDN links go here
│   └── src/
│       ├── App.jsx            # Main React component
│       └── index.js
├── server/
│   └── server.js             # Express API
└── README.md
```

---

## 🌐 Deployment

### Frontend → Vercel
```bash
npm install -g vercel
vercel
```

### Frontend → Netlify
```bash
npm run build
# drag the build/ folder to netlify.com/drop
```

---

## 📸 Preview

> Color-coded sticky notes with due date badges, inline editing, and a fun playful UI.

---

## 📄 License

MIT — free to use and modify.

