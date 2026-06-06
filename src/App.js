import { useEffect, useState, useCallback } from "react";

const COLORS = [
  { bg: "#fef9c3", border: "#fde047", dot: "#facc15", name: "yellow" },
  { bg: "#fce7f3", border: "#f9a8d4", dot: "#ec4899", name: "pink" },
  { bg: "#dbeafe", border: "#93c5fd", dot: "#3b82f6", name: "blue" },
  { bg: "#dcfce7", border: "#86efac", dot: "#22c55e", name: "green" },
  { bg: "#ede9fe", border: "#c4b5fd", dot: "#8b5cf6", name: "purple" },
  { bg: "#ffedd5", border: "#fdba74", dot: "#f97316", name: "orange" },
];

function formatTime(ts) {
  const d = new Date(ts), now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function dueStatus(due) {
  if (!due) return null;
  const today = getTodayStr();
  if (due < today) return "overdue";
  if (due === today) return "soon";
  return "ok";
}

function dueLabel(due) {
  if (!due) return "";
  const today = getTodayStr();
  if (due < today) return "Overdue";
  if (due === today) return "Due today";
  return "Due " + new Date(due + "T12:00").toLocaleDateString([], { month: "short", day: "numeric" });
}

const DUE_STYLES = {
  overdue: { background: "#fee2e2", color: "#991b1b" },
  soon:    { background: "#fef3c7", color: "#92400e" },
  ok:      { background: "#dcfce7", color: "#166534" },
};

// ── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ value, label, bg, border }) {
  return (
    <div style={{
      background: bg, border: `1.5px solid ${border}`,
      borderRadius: 14, padding: "12px 14px",
      display: "flex", flexDirection: "column", gap: 2, flex: 1,
    }}>
      <span style={{ fontSize: 24, fontWeight: 700 }}>{value}</span>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", color: "#888" }}>{label}</span>
    </div>
  );
}

function ColorDot({ color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={color.name}
      aria-label={`Select ${color.name}`}
      style={{
        width: 22, height: 22, borderRadius: "50%",
        background: color.dot, border: active ? "2.5px solid #111" : "2.5px solid transparent",
        cursor: "pointer", transform: active ? "scale(1.25)" : "scale(1)",
        transition: "transform .12s", padding: 0,
      }}
    />
  );
}

function NoteCard({ note, onDelete, onPin, onSave }) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const c = COLORS[note.color] || COLORS[0];
  const ds = dueStatus(note.due);

  const handleSave = () => {
    if (editText.trim()) onSave(note.id, editText.trim());
    setEditing(false);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: c.bg,
        border: `2px ${note.pinned ? "dashed" : "solid"} ${c.border}`,
        borderRadius: 18, padding: 16,
        display: "flex", flexDirection: "column", gap: 10,
        position: "relative", transition: "transform .12s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {editing ? (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 18,
          background: "rgba(255,255,255,0.97)", padding: 12,
          display: "flex", flexDirection: "column", gap: 8, zIndex: 1,
        }}>
          <textarea
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave(); }}
            style={{
              flex: 1, border: "none", outline: "none", resize: "none",
              fontSize: 14, fontFamily: "Nunito, sans-serif",
              background: "transparent", lineHeight: 1.6, color: "#111",
            }}
          />
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button
              onClick={() => { setEditing(false); setEditText(note.text); }}
              style={{
                fontSize: 12, padding: "5px 12px", borderRadius: 8,
                border: "1.5px solid #ddd", background: "transparent",
                color: "#666", cursor: "pointer", fontFamily: "inherit",
              }}
            >Cancel</button>
            <button
              onClick={handleSave}
              style={{
                fontSize: 12, fontWeight: 700, padding: "5px 12px",
                borderRadius: 8, border: "none", background: "#7c3aed",
                color: "#fff", cursor: "pointer", fontFamily: "inherit",
              }}
            >Save</button>
          </div>
        </div>
      ) : null}

      <p style={{
        fontSize: 14, lineHeight: 1.65, margin: 0,
        wordBreak: "break-word", whiteSpace: "pre-wrap", flex: 1,
      }}>
        {note.text}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {ds && (
          <div style={{
            ...DUE_STYLES[ds],
            fontSize: 11, fontWeight: 600, display: "flex",
            alignItems: "center", gap: 4, padding: "3px 8px",
            borderRadius: 6, width: "fit-content",
          }}>
            🗓 {dueLabel(note.due)}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "#999" }}>{formatTime(note.ts)}</span>
          <div style={{ display: "flex", gap: 3, opacity: hovered ? 1 : 0, transition: "opacity .12s" }}>
            {[
              { icon: "ti-pin",  label: note.pinned ? "Unpin" : "Pin", action: () => onPin(note.id) },
              { icon: "ti-edit", label: "Edit",   action: () => setEditing(true) },
              { icon: "ti-trash",label: "Delete", action: () => onDelete(note.id), danger: true },
            ].map(({ icon, label, action, danger }) => (
              <ActionBtn key={icon} icon={icon} label={label} onClick={action} danger={danger} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={label} aria-label={label} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 26, height: 26, border: "none", borderRadius: 7, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
        background: hov ? (danger ? "#fee2e2" : "rgba(0,0,0,0.12)") : "rgba(0,0,0,0.07)",
        color: hov && danger ? "#991b1b" : "#333", transition: "background .1s",
      }}
    >
      <i className={`ti ${icon}`} aria-hidden="true" />
    </button>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [notes, setNotes]       = useState([]);
  const [text, setText]         = useState("");
  const [selColor, setSelColor] = useState(0);
  const [dueDate, setDueDate]   = useState("");
  const [filter, setFilter]     = useState("all");
  const [query, setQuery]       = useState("");
  const [toast, setToast]       = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  // ── API ───────────────────────────────────────────────────────────────────

  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:5000/notes");
      const data = await res.json();
      setNotes(data.map((n, i) => ({
        color: i % COLORS.length,
        pinned: false,
        due: "",
        ts: Date.now(),
        ...n,
      })));
    } catch (e) { console.error("Fetch failed:", e); }
  };

  useEffect(() => { fetchNotes(); }, []);

  const addNote = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, color: selColor, due: dueDate }),
      });
      setText(""); setDueDate("");
      fetchNotes();
      showToast("Note added ✨");
    } catch (e) { console.error(e); }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:5000/notes/${id}`, { method: "DELETE" });
      fetchNotes();
      showToast("Deleted!");
    } catch (e) { console.error(e); }
  };

  const saveNote = async (id, newText) => {
    try {
      await fetch(`http://localhost:5000/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });
      fetchNotes();
      showToast("Saved!");
    } catch (e) {
      // fallback: update locally if PATCH not implemented
      setNotes(prev => prev.map(n => n.id === id ? { ...n, text: newText } : n));
      showToast("Saved!");
    }
  };

  const togglePin = async (id) => {
    const note = notes.find(n => n.id === id);
    try {
      await fetch(`http://localhost:5000/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !note?.pinned }),
      });
      fetchNotes();
    } catch {
      setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
    }
    showToast(note?.pinned ? "Unpinned" : "Pinned 📌");
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  const today = getTodayStr();
  const filtered = notes
    .filter(n => {
      if (filter === "pinned") return n.pinned;
      if (filter === "due") return !!n.due;
      return true;
    })
    .filter(n => !query || n.text.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.pinned - a.pinned || b.ts - a.ts);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; background: #fafaf8; min-height: 100vh; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: .5; }
        ::placeholder { color: #bbb; }
        textarea:focus, input:focus { outline: none; }
      `}</style>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 14, background: "#fce7f3",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>
              <i className="ti ti-notes" aria-hidden="true" style={{ color: "#9d174d" }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>
              Noted{" "}
              <span style={{ fontSize: 14, fontWeight: 400, color: "#aaa" }}>
                {notes.length > 0 && `(${notes.length})`}
              </span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[["all","All"], ["pinned","📌 Pinned"], ["due","🔔 Due"]].map(([f, label]) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 99,
                border: "1.5px solid", fontFamily: "Nunito, sans-serif",
                borderColor: filter === f ? "#7c3aed" : "#ddd",
                background: filter === f ? "#7c3aed" : "transparent",
                color: filter === f ? "#fff" : "#888", cursor: "pointer", transition: "all .12s",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem" }}>
          <StatCard value={notes.length}                               label="total"     bg="#fef3c7" border="#fde68a" />
          <StatCard value={notes.filter(n => n.pinned).length}         label="pinned"    bg="#dbeafe" border="#bfdbfe" />
          <StatCard value={notes.filter(n => n.due === today).length}  label="due today" bg="#dcfce7" border="#bbf7d0" />
        </div>

        {/* Compose */}
        <div style={{
          background: "#fff", border: "2px solid #e5e7eb", borderRadius: 18,
          padding: 16, marginBottom: "1.5rem",
        }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote(); }}
            placeholder="What's on your mind? ✨"
            maxLength={500}
            rows={3}
            style={{
              width: "100%", border: "none", resize: "none",
              fontSize: 15, fontFamily: "Nunito, sans-serif",
              lineHeight: 1.6, background: "transparent",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap", borderTop: "1px solid #f0f0ee", paddingTop: 10 }}>
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              {COLORS.map((c, i) => (
                <ColorDot key={i} color={c} active={selColor === i} onClick={() => setSelColor(i)} />
              ))}
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              min={today}
              title="Set due date"
              style={{
                flex: 1, minWidth: 120, border: "1.5px solid #e5e7eb",
                borderRadius: 8, padding: "5px 10px", fontSize: 12,
                fontFamily: "Nunito, sans-serif", color: "#666", background: "#fff",
              }}
            />
            <span style={{ fontSize: 11, color: "#ccc", marginLeft: "auto" }}>{text.length}/500 · ⌘↵</span>
            <button
              onClick={addNote}
              disabled={!text.trim()}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: text.trim() ? "#7c3aed" : "#e5e7eb",
                color: text.trim() ? "#fff" : "#aaa",
                border: "none", borderRadius: 10, padding: "7px 18px",
                fontSize: 13, fontWeight: 700, cursor: text.trim() ? "pointer" : "not-allowed",
                fontFamily: "Nunito, sans-serif", transition: "background .15s",
              }}
            >
              <i className="ti ti-plus" aria-hidden="true" /> Add
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "1.25rem" }}>
          <i className="ti ti-search" aria-hidden="true" style={{
            position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
            color: "#ccc", fontSize: 15, pointerEvents: "none",
          }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search notes…"
            style={{
              width: "100%", padding: "8px 12px 8px 34px",
              border: "1.5px solid #e5e7eb", borderRadius: 10,
              background: "#fff", fontSize: 14,
              fontFamily: "Nunito, sans-serif",
            }}
          />
        </div>

        {/* Notes grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "#ccc" }}>
              <i className="ti ti-mood-empty" aria-hidden="true" style={{ fontSize: 36, display: "block", marginBottom: 10 }} />
              <p style={{ fontSize: 14 }}>No notes here yet!</p>
            </div>
          ) : (
            filtered.map(n => (
              <NoteCard key={n.id} note={n} onDelete={deleteNote} onPin={togglePin} onSave={saveNote} />
            ))
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%",
          transform: "translateX(-50%)",
          background: "#1a1a1a", color: "#fff",
          fontSize: 13, padding: "8px 20px", borderRadius: 10,
          pointerEvents: "none", whiteSpace: "nowrap",
          animation: "fadeUp 0.2s ease", zIndex: 999,
        }}>
          {toast}
        </div>
      )}
    </>
  );
}
