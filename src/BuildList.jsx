import { useState, useEffect } from "react";

const STORAGE_KEY = "fw_build_list";
const TEAM_MEMBERS = ["Eric", "Jasper", "Kay", "Miles", "Shiv", "Matt", "Austin", "Adrian", "Ilias", "Other"];
const PRIORITY_LABELS = { 1: "P1 — Critical", 2: "P2 — High", 3: "P3 — Medium", 4: "P4 — Low" };
const PRIORITY_COLORS = { 1: "#ef4444", 2: "#f59e0b", 3: "#3b82f6", 4: "#64748b" };
const STATUS_OPTIONS = ["Idea", "In Progress", "Blocked", "Done"];
const STATUS_COLORS = { "Idea": "#8b5cf6", "In Progress": "#f59e0b", "Blocked": "#ef4444", "Done": "#10b981" };

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function BuildList() {
  const [items, setItems] = useState(loadItems);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterPriority, setFilterPriority] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterPerson, setFilterPerson] = useState(null);
  const [sortBy, setSortBy] = useState("priority");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState(3);
  const [status, setStatus] = useState("Idea");
  const [category, setCategory] = useState("");

  useEffect(() => { saveItems(items); }, [items]);

  const resetForm = () => {
    setTitle(""); setDescription(""); setSubmittedBy(""); setAssignedTo("");
    setPriority(3); setStatus("Idea"); setCategory(""); setEditId(null); setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const item = {
      id: editId || genId(),
      title: title.trim(),
      description: description.trim(),
      submittedBy,
      assignedTo,
      priority,
      status,
      category: category.trim(),
      createdAt: editId ? items.find(i => i.id === editId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editId) {
      setItems(prev => prev.map(i => i.id === editId ? item : i));
    } else {
      setItems(prev => [...prev, item]);
    }
    resetForm();
  };

  const startEdit = (item) => {
    setTitle(item.title); setDescription(item.description || ""); setSubmittedBy(item.submittedBy || "");
    setAssignedTo(item.assignedTo || ""); setPriority(item.priority); setStatus(item.status);
    setCategory(item.category || ""); setEditId(item.id); setShowForm(true);
  };

  const deleteItem = (id) => {
    if (confirm("Remove this item?")) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const movePriority = (id, dir) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const np = Math.max(1, Math.min(4, i.priority + dir));
      return { ...i, priority: np, updatedAt: new Date().toISOString() };
    }));
  };

  const cycleStatus = (id) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const idx = STATUS_OPTIONS.indexOf(i.status);
      const next = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
      return { ...i, status: next, updatedAt: new Date().toISOString() };
    }));
  };

  // Filter & sort
  let displayed = [...items];
  if (filterPriority) displayed = displayed.filter(i => i.priority === filterPriority);
  if (filterStatus) displayed = displayed.filter(i => i.status === filterStatus);
  if (filterPerson) displayed = displayed.filter(i => i.submittedBy === filterPerson || i.assignedTo === filterPerson);

  displayed.sort((a, b) => {
    if (sortBy === "priority") return a.priority - b.priority || a.title.localeCompare(b.title);
    if (sortBy === "status") return STATUS_OPTIONS.indexOf(a.status) - STATUS_OPTIONS.indexOf(b.status);
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "updated") return new Date(b.updatedAt) - new Date(a.updatedAt);
    return 0;
  });

  const counts = {
    total: items.length,
    idea: items.filter(i => i.status === "Idea").length,
    inProgress: items.filter(i => i.status === "In Progress").length,
    blocked: items.filter(i => i.status === "Blocked").length,
    done: items.filter(i => i.status === "Done").length,
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-400 text-sm leading-relaxed">
        Team-wide list of <strong className="text-white">AI opportunities and build requests</strong>. Anyone can add items they'd like to leverage AI on. Prioritize, assign, and track progress.
      </p>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total", value: counts.total, color: "#64748b" },
          { label: "Ideas", value: counts.idea, color: STATUS_COLORS["Idea"] },
          { label: "In Progress", value: counts.inProgress, color: STATUS_COLORS["In Progress"] },
          { label: "Blocked", value: counts.blocked, color: STATUS_COLORS["Blocked"] },
          { label: "Done", value: counts.done, color: STATUS_COLORS["Done"] },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            <span className="text-gray-500">{s.label}:</span>
            <span className="font-semibold" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
        >
          + Add Item
        </button>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="text-xs px-2 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 outline-none">
          <option value="priority">Sort: Priority</option>
          <option value="status">Sort: Status</option>
          <option value="newest">Sort: Newest</option>
          <option value="updated">Sort: Recently Updated</option>
        </select>

        <select value={filterPriority || ""} onChange={e => setFilterPriority(e.target.value ? Number(e.target.value) : null)}
          className="text-xs px-2 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 outline-none">
          <option value="">All Priorities</option>
          {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <select value={filterStatus || ""} onChange={e => setFilterStatus(e.target.value || null)}
          className="text-xs px-2 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 outline-none">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={filterPerson || ""} onChange={e => setFilterPerson(e.target.value || null)}
          className="text-xs px-2 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 outline-none">
          <option value="">All People</option>
          {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {(filterPriority || filterStatus || filterPerson) && (
          <button onClick={() => { setFilterPriority(null); setFilterStatus(null); setFilterPerson(null); }}
            className="text-xs px-2 py-1 text-gray-500 hover:text-gray-300 transition-colors">
            Clear filters
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-blue-800/40 bg-blue-950/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-blue-400">{editId ? "Edit Item" : "Add New Item"}</h3>
            <button type="button" onClick={resetForm} className="text-xs text-gray-500 hover:text-gray-300">Cancel</button>
          </div>

          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="What should we build or automate?"
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500"
            autoFocus required />

          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description / context (optional)"
            rows={2} className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500 resize-none" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Submitted By</label>
              <select value={submittedBy} onChange={e => setSubmittedBy(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs outline-none">
                <option value="">Select...</option>
                {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Assigned To</label>
              <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs outline-none">
                <option value="">Unassigned</option>
                {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Priority</label>
              <select value={priority} onChange={e => setPriority(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs outline-none">
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Category</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Sales, Ops, Data"
                className="w-full px-2 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs placeholder-gray-600 outline-none" />
            </div>
          </div>

          <button type="submit"
            className="text-xs px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors">
            {editId ? "Save Changes" : "Add to Build List"}
          </button>
        </form>
      )}

      {/* Items list */}
      <div className="space-y-2">
        {displayed.length === 0 && (
          <div className="text-center py-8 text-gray-600 text-sm">
            {items.length === 0 ? "No items yet. Click '+ Add Item' to start building the list." : "No items match the current filters."}
          </div>
        )}

        {displayed.map((item) => (
          <div key={item.id}
            className="rounded-lg border p-3 transition-all hover:border-gray-600"
            style={{ borderColor: `${PRIORITY_COLORS[item.priority]}20`, background: `${PRIORITY_COLORS[item.priority]}03` }}>
            <div className="flex items-start gap-3">
              {/* Priority controls */}
              <div className="flex flex-col items-center gap-0.5 pt-0.5">
                <button onClick={() => movePriority(item.id, -1)} className="text-gray-600 hover:text-gray-300 text-xs leading-none">▲</button>
                <span className="text-xs font-bold w-6 text-center rounded py-0.5"
                  style={{ color: PRIORITY_COLORS[item.priority], background: `${PRIORITY_COLORS[item.priority]}15` }}>
                  P{item.priority}
                </span>
                <button onClick={() => movePriority(item.id, 1)} className="text-gray-600 hover:text-gray-300 text-xs leading-none">▼</button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-white">{item.title}</span>
                  <button onClick={() => cycleStatus(item.id)}
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium cursor-pointer transition-colors"
                    style={{ background: `${STATUS_COLORS[item.status]}15`, color: STATUS_COLORS[item.status] }}>
                    {item.status}
                  </button>
                  {item.category && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">{item.category}</span>}
                </div>
                {item.description && <p className="text-xs text-gray-400 mt-1">{item.description}</p>}
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-600">
                  {item.submittedBy && <span>By: <strong className="text-gray-400">{item.submittedBy}</strong></span>}
                  {item.assignedTo && <span>Assigned: <strong className="text-gray-400">{item.assignedTo}</strong></span>}
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(item)}
                  className="text-xs px-2 py-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors">
                  Edit
                </button>
                <button onClick={() => deleteItem(item.id)}
                  className="text-xs px-2 py-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-950/30 transition-colors">
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gray-700/30 bg-gray-900/30 p-3">
        <p className="text-xs text-gray-600">
          Data is stored in your browser's local storage. Each team member sees their own list unless items are shared. Click a status badge to cycle through: Idea → In Progress → Blocked → Done. Use ▲▼ to reprioritize.
        </p>
      </div>
    </div>
  );
}
