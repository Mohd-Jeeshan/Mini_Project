import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, Calendar, MapPin, Clock, Users, QrCode, Ticket, Loader2 } from 'lucide-react';
import { supabase, CATEGORY_META } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import EventFormModal from '@/components/EventFormModal';
import QRTicketModal, { registerForEvent } from '@/components/QRTicketModal';
import EventCover from '@/components/EventCover';
export default function Events() {
    const { profile } = useAuth();
    const [events, setEvents] = useState([]);
    const [counts, setCounts] = useState({});
    const [myRegs, setMyRegs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [qrOpen, setQrOpen] = useState(false);
    const [qrToken, setQrToken] = useState(null);
    const [qrEvent, setQrEvent] = useState(null);
    const [busyId, setBusyId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    async function load() {
        setLoading(true);
        const [{ data: ev }, { data: regs }] = await Promise.all([
            supabase.from('events').select('*').order('event_date', { ascending: true }),
            supabase.from('registrations').select('*'),
        ]);
        const eventList = ev ?? [];
        const regList = regs ?? [];
        setEvents(eventList);
        setMyRegs(regList.filter((r) => r.status === 'registered'));
        const c = {};
        regList.filter((r) => r.status === 'registered').forEach((r) => { c[r.event_id] = (c[r.event_id] ?? 0) + 1; });
        setCounts(c);
        setLoading(false);
    }
    useEffect(() => { load(); }, []);
    const myEventIds = useMemo(() => new Set(myRegs.map((r) => r.event_id)), [myRegs]);
    const myRegByEvent = useMemo(() => Object.fromEntries(myRegs.map((r) => [r.event_id, r])), [myRegs]);
    const filtered = useMemo(() => {
        return events.filter((e) => {
            if (filter !== 'all' && e.category !== filter)
                return false;
            if (query && !`${e.title} ${e.description} ${e.location}`.toLowerCase().includes(query.toLowerCase()))
                return false;
            return true;
        });
    }, [events, filter, query]);
    async function handleRegister(ev) {
        setBusyId(ev.id);
        try {
            const token = await registerForEvent(ev.id);
            setQrEvent(ev);
            setQrToken(token);
            setQrOpen(true);
            await load();
        }
        catch (err) {
            if (err?.code === '23505') {
                alert('You are already registered for this event.');
            }
            else {
                alert(err?.message || 'Could not register.');
            }
        }
        finally {
            setBusyId(null);
        }
    }
    async function handleCancel(ev) {
        if (!confirm('Cancel your registration for this event?'))
            return;
        const reg = myRegByEvent[ev.id];
        if (!reg)
            return;
        await supabase.from('registrations').delete().eq('id', reg.id);
        await load();
    }
    function openCreate() { setEditing(null); setFormOpen(true); }
    function openEdit(ev) { setEditing(ev); setFormOpen(true); }
    async function handleDelete() {
        if (!confirmDelete)
            return;
        await supabase.from('events').delete().eq('id', confirmDelete.id);
        setConfirmDelete(null);
        await load();
    }
    function viewTicket(ev) {
        const reg = myRegByEvent[ev.id];
        if (!reg)
            return;
        setQrEvent(ev);
        setQrToken(reg.qr_token);
        setQrOpen(true);
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "Events" }), _jsx("p", { className: "text-slate-500 mt-1", children: "Browse, register, and manage campus events." })] }), _jsxs("button", { onClick: openCreate, className: "inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition", children: [_jsx(Plus, { className: "w-4 h-4" }), " Create event"] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }), _jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search events\u2026", className: "w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" })] }), _jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: ['all', ...Object.keys(CATEGORY_META)].map((c) => (_jsx("button", { onClick: () => setFilter(c), className: `px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition ${filter === c ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`, children: c === 'all' ? 'All' : CATEGORY_META[c].label }, c))) })] }), loading ? (_jsxs("div", { className: "text-center py-16 text-slate-400 flex items-center justify-center gap-2", children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), " Loading events\u2026"] })) : filtered.length === 0 ? (_jsxs("div", { className: "text-center py-16 bg-white rounded-xl border border-dashed border-slate-300", children: [_jsx(Calendar, { className: "w-10 h-10 text-slate-300 mx-auto mb-3" }), _jsx("p", { className: "text-slate-500", children: "No events match your search." })] })) : (_jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: filtered.map((e) => {
                    const registered = myEventIds.has(e.id);
                    const full = (counts[e.id] ?? 0) >= e.capacity;
                    const dateObj = new Date(e.event_date + 'T00:00');
                    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition group", children: [_jsxs("div", { className: "relative", children: [_jsx(EventCover, { event: e, className: "h-36" }), _jsx("span", { className: `absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_META[e.category].color} bg-white/90 backdrop-blur`, children: CATEGORY_META[e.category].label }), registered && (_jsxs("span", { className: "absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white flex items-center gap-1", children: [_jsx(Ticket, { className: "w-3 h-3" }), " Registered"] }))] }), _jsxs("div", { className: "p-5 flex-1 flex flex-col", children: [_jsx("h3", { className: "font-semibold text-slate-900 line-clamp-1", children: e.title }), _jsx("p", { className: "text-sm text-slate-500 mt-1 line-clamp-2 flex-1", children: e.description || 'No description provided.' }), _jsxs("div", { className: "mt-3 space-y-1.5 text-xs text-slate-500", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-3.5 h-3.5" }), " ", dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), " ", e.start_time, " \u2013 ", e.end_time] }), e.location && _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-3.5 h-3.5" }), " ", e.location] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-3.5 h-3.5" }), " ", counts[e.id] ?? 0, " / ", e.capacity, " registered"] })] }), _jsxs("div", { className: "mt-4 flex items-center gap-2", children: [registered ? (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => viewTicket(e), className: "flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2 rounded-lg", children: [_jsx(QrCode, { className: "w-4 h-4" }), " View ticket"] }), _jsx("button", { onClick: () => handleCancel(e), className: "px-3 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm hover:bg-slate-50", children: "Cancel" })] })) : full ? (_jsx("button", { disabled: true, className: "flex-1 bg-slate-100 text-slate-400 text-sm font-medium py-2 rounded-lg cursor-not-allowed", children: "Event full" })) : (_jsx("button", { onClick: () => handleRegister(e), disabled: busyId === e.id, className: "flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition", children: busyId === e.id ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : _jsxs(_Fragment, { children: [_jsx(Ticket, { className: "w-4 h-4" }), " Register"] }) })), _jsx("button", { onClick: () => openEdit(e), title: "Edit", className: "p-2 rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-50", children: _jsx(Pencil, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => setConfirmDelete(e), title: "Delete", className: "p-2 rounded-lg border border-slate-300 text-red-500 hover:bg-red-50", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] })] }, e.id));
                }) })), _jsx(EventFormModal, { open: formOpen, onClose: () => setFormOpen(false), onSaved: load, editing: editing }), _jsx(QRTicketModal, { open: qrOpen, onClose: () => setQrOpen(false), event: qrEvent, token: qrToken, registrantName: profile?.full_name }), confirmDelete && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-sm p-6", children: [_jsx("h3", { className: "font-semibold text-slate-900", children: "Delete event?" }), _jsxs("p", { className: "text-sm text-slate-500 mt-2", children: ["\"", confirmDelete.title, "\" and all its registrations will be removed. This cannot be undone."] }), _jsxs("div", { className: "flex justify-end gap-3 mt-5", children: [_jsx("button", { onClick: () => setConfirmDelete(null), className: "px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50", children: "Cancel" }), _jsx("button", { onClick: handleDelete, className: "px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium", children: "Delete" })] })] }) }))] }));
}
