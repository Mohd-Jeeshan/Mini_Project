import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase, CATEGORY_META } from '@/lib/supabase';
const CATEGORIES = Object.keys(CATEGORY_META);
const today = () => new Date().toISOString().slice(0, 10);
export default function EventFormModal({ open, onClose, onSaved, editing }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('workshop');
    const [location, setLocation] = useState('');
    const [eventDate, setEventDate] = useState(today());
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [capacity, setCapacity] = useState(100);
    const [imageUrl, setImageUrl] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!open)
            return;
        if (editing) {
            setTitle(editing.title);
            setDescription(editing.description);
            setCategory(editing.category);
            setLocation(editing.location);
            setEventDate(editing.event_date);
            setStartTime(editing.start_time);
            setEndTime(editing.end_time);
            setCapacity(editing.capacity);
            setImageUrl(editing.image_url ?? '');
        }
        else {
            setTitle('');
            setDescription('');
            setCategory('workshop');
            setLocation('');
            setEventDate(today());
            setStartTime('09:00');
            setEndTime('17:00');
            setCapacity(100);
            setImageUrl('');
        }
        setError(null);
    }, [open, editing]);
    if (!open)
        return null;
    async function save(e) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const payload = {
            title, description, category, location,
            event_date: eventDate, start_time: startTime, end_time: endTime,
            capacity, image_url: imageUrl || null,
        };
        let res;
        if (editing) {
            res = await supabase.from('events').update(payload).eq('id', editing.id).select().maybeSingle();
        }
        else {
            res = await supabase.from('events').insert(payload).select().maybeSingle();
        }
        setBusy(false);
        if (res.error) {
            setError(res.error.message);
            return;
        }
        onSaved();
        onClose();
    }
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 backdrop-blur-sm p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-slate-100", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900", children: editing ? 'Edit event' : 'Create new event' }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-700 transition", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: save, className: "px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { className: "sm:col-span-2", children: [_jsx(Label, { children: "Title" }), _jsx(Input, { value: title, onChange: setTitle, required: true, placeholder: "AI & Machine Learning Workshop" })] }), _jsxs("div", { className: "sm:col-span-2", children: [_jsx(Label, { children: "Description" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 3, className: "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100", placeholder: "Tell students what this event is about\u2026" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Category" }), _jsx("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500", children: CATEGORIES.map((c) => _jsx("option", { value: c, children: CATEGORY_META[c].label }, c)) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Location" }), _jsx(Input, { value: location, onChange: setLocation, placeholder: "Auditorium Block B" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Date" }), _jsx("input", { type: "date", value: eventDate, onChange: (e) => setEventDate(e.target.value), required: true, className: "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { children: [_jsx(Label, { children: "Start" }), _jsx("input", { type: "time", value: startTime, onChange: (e) => setStartTime(e.target.value), className: "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx(Label, { children: "End" }), _jsx("input", { type: "time", value: endTime, onChange: (e) => setEndTime(e.target.value), className: "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Capacity" }), _jsx("input", { type: "number", min: 1, value: capacity, onChange: (e) => setCapacity(Number(e.target.value)), required: true, className: "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500" })] }), _jsxs("div", { className: "sm:col-span-2", children: [_jsx(Label, { children: "Cover image URL (optional)" }), _jsx(Input, { value: imageUrl, onChange: setImageUrl, placeholder: "https://\u2026" })] }), error && _jsx("div", { className: "sm:col-span-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2", children: error }), _jsxs("div", { className: "sm:col-span-2 flex justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50", children: "Cancel" }), _jsx("button", { type: "submit", disabled: busy, className: "px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium", children: busy ? 'Saving…' : editing ? 'Update event' : 'Create event' })] })] })] }) }));
}
function Label({ children }) {
    return _jsx("span", { className: "text-sm font-medium text-slate-700", children: children });
}
function Input({ value, onChange, required, placeholder }) {
    return (_jsx("input", { value: value, onChange: (e) => onChange(e.target.value), required: required, placeholder: placeholder, className: "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" }));
}
