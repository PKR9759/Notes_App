import { useEffect, useMemo, useState } from "react";
import api from "../config/api";

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null); // Track which card's menu is open

    const [isEditing, setIsEditing] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState(null);

    const [noteForm, setNoteForm] = useState({
        title: "",
        body: "",
        category: ""
    });

    useEffect(() => {
        fetchNotes();
        // Close action dropdowns if clicking anywhere else
        const handleOutsideClick = () => setActiveMenuId(null);
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await api.get("/notes");
            setNotes(res.data.notes);
        } catch (err) {
            console.error("Error fetching notes:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!noteForm.title.trim() || !noteForm.body.trim()) return;

        try {
            if (isEditing) {
                // Update existing note
                const res = await api.put(`/notes/${currentNoteId}`, noteForm);
                setNotes((prev) =>
                    prev.map((n) => (n.id === currentNoteId ? { ...n, ...res.data.note } : n))
                );
            } else{
                // Create new note
                const res = await api.post("/notes", noteForm);
                setNotes((prev) => [res.data.note, ...prev]);
            }

            closeModal();
        } catch (err) {
            console.error("Error saving note:", err);
        }
    };

    const pinNote = async (noteId, e) => {
        e.stopPropagation(); // Stop menu from closing or opening
        try {
            const res = await api.patch(`/notes/${noteId}/pin`);
            setNotes((prev) =>
                prev.map((n) => (n.id === noteId ? { ...n, pinned: res.data.note.pinned } : n))
            );
        } catch (err) {
            console.error("Error toggling pin:", err);
        }
    };

    const openEditModal = (note, e) => {
        e.stopPropagation();
        setIsEditing(true);
        setCurrentNoteId(note.id);
        setNoteForm({
            title: note.title,
            body: note.body,
            category: note.category || ""
        });
        setShowModal(true);
        setActiveMenuId(null);
    };

    const deleteNote = async (noteId, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this note?")) return;

        try {
            await api.delete(`/notes/${noteId}`);
            setNotes((prev) => prev.filter((n) => n.id !== noteId));
            setActiveMenuId(null);
        } catch (err) {
            console.error("Error deleting note:", err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentNoteId(null);
        setNoteForm({ title: "", body: "", category: "" });
    };

    const categories = [
        "All",
        ...new Set(notes.map((n) => n.category).filter(Boolean))
    ];

    const filteredNotes = useMemo(() => {
        return notes.filter((note) => {
            const matchesSearch =
                (note.title || "").toLowerCase().includes(search.toLowerCase()) ||
                (note.body || "").toLowerCase().includes(search.toLowerCase());
            const matchesCategory = category === "All" || note.category === category;
            return matchesSearch && matchesCategory;
        });
    }, [notes, search, category]);

    const pinnedNotes = useMemo(() => filteredNotes.filter((n) => n.pinned), [filteredNotes]);
    const unpinnedNotes = useMemo(() => filteredNotes.filter((n) => !n.pinned), [filteredNotes]);

    const renderNoteCard = (note) => (
        <div
            key={note.id}
            className="bg-white rounded-xl shadow border border-gray-100 p-5 hover:shadow-md transition flex flex-col justify-between relative min-h-[200px]"
        >
            <div>
                <div className="flex justify-between items-start mb-2 gap-4">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 pr-6">
                        {note.title}
                    </h2>
                    
                    {/* Action Menu (Pin, Edit, Delete) Container */}
                    <div className="absolute top-4 right-4 flex items-center gap-1">
                        <button
                            onClick={(e) => pinNote(note.id, e)}
                            className={`p-1 rounded hover:bg-gray-100 text-sm transition ${
                                note.pinned ? "opacity-100" : "opacity-30 hover:opacity-100"
                            }`}
                            title={note.pinned ? "Unpin Note" : "Pin Note"}
                        >
                            📌
                        </button>

                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(activeMenuId === note.id ? null : note.id);
                                }}
                                className="p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition font-bold text-sm"
                            >
                                ⋮
                            </button>

                            {/* Dropdown Options */}
                            {activeMenuId === note.id && (
                                <div className="absolute right-0 mt-1 w-28 bg-white border rounded-lg shadow-lg py-1 z-10 animate-in fade-in slide-in-from-top-1 duration-100">
                                    <button
                                        onClick={(e) => openEditModal(note, e)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={(e) => deleteNote(note.id, e)}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-4 whitespace-pre-wrap mt-1">
                    {note.body}
                </p>
            </div>

            <div className="mt-5 flex justify-between items-center">
                <span className="bg-gray-100 text-xs font-medium text-gray-600 px-2.5 py-1 rounded-md max-w-[140px] truncate">
                    {note.category || "Uncategorized"}
                </span>

                <button className="text-blue-600 hover:underline text-xs font-semibold">
                    View
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto p-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                        + New Note
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[140px]"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Notes Output Display */}
                {filteredNotes.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20 text-sm">
                        No notes found matching filters.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {pinnedNotes.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pinned</h3>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {pinnedNotes.map(renderNoteCard)}
                                </div>
                            </div>
                        )}

                        {unpinnedNotes.length > 0 && (
                            <div>
                                {pinnedNotes.length > 0 && (
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-2">Others</h3>
                                )}
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {unpinnedNotes.map(renderNoteCard)}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Dialog for Create/Edit */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                        <h3 className="text-lg font-bold mb-4 text-gray-900">
                            {isEditing ? "Edit Note" : "Create New Note"}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={noteForm.title}
                                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter title"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                                <input
                                    type="text"
                                    value={noteForm.category}
                                    onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                                    placeholder="e.g., Ideas, Work"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Content</label>
                                <textarea
                                    rows="4"
                                    required
                                    value={noteForm.body}
                                    onChange={(e) => setNoteForm({ ...noteForm, body: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none resize-none"
                                    placeholder="Type contents..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    {isEditing ? "Save Changes" : "Create Note"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;