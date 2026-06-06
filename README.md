# 📓 Noted — Colorful Notes App

A fun, colorful notes app built with **React** (frontend) and **Flask + MongoDB** (backend). Create, color-code, pin, edit, and set due dates on your notes.

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

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | React, CSS-in-JS            |
| Backend  | Python, Flask, Flask-CORS   |
| Database | MongoDB                     |
| Icons    | Tabler Icons                |
| Fonts    | Nunito (Google Fonts)       |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- Python 3.8+
- MongoDB running locally on port `27017`

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/notes-app.git
cd notes-app
```

---

### 2. Start the backend

```bash
cd server
pip install flask flask-cors pymongo
python app.py
```

The backend runs on `http://localhost:5000`.

> Make sure MongoDB is running before starting the server.  
> On most systems: `mongod` or `brew services start mongodb-community`

---

### 3. Start the frontend

```bash
cd client
npm install
npm start
```

The app opens at `http://localhost:3000`.

---

## 📡 API Endpoints

| Method | Endpoint        | Description     |
|--------|-----------------|-----------------|
| GET    | `/notes`        | Get all notes   |
| POST   | `/notes`        | Create a note   |
| DELETE | `/notes/:id`    | Delete a note   |

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
│   └── app.py                # Flask API
└── README.md
```

---

## 🌐 Deployment

### Frontend → Vercel
```bash
npm install -g vercel
vercel
```

### Backend → Render
1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set build command to `pip install -r requirements.txt` and start command to `python app.py`

---

## 📸 Preview

> Color-coded sticky notes with due date badges, inline editing, and a fun playful UI.

---

## 📄 License

MIT — free to use and modify.
