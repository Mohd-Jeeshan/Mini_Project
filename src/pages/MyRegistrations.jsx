import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, QrCode, Trash2, Loader2, CalendarX } from 'lucide-react';
import { supabase, CATEGORY_META } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import QRTicketModal from '@/components/QRTicketModal';
import EventCover from '@/components/EventCover';
export default function MyRegistrations() {
    const { profile } = useAuth();
    const [regs, setRegs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qrOpen, setQrOpen] = useState(false);
    const [qrToken, setQrToken] = useState(null);
    const [qrEvent, setQrEvent] = useState(null);
    async function load() {
        setLoading(true);
        const { data, error } = await supabase
            .from('registrations')
            .select('*, events(*)')
            .order('created_at', { ascending: false });
        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }
        setRegs(data ?? []);
        setLoading(false);
    }
    useEffect(() => { load(); }, []);
    function viewTicket(reg) {
        setQrEvent(reg.events);
        setQrToken(reg.qr_token);
        setQrOpen(true);
    }
    async function cancel(reg) {
        if (!confirm('Cancel your registration for this event?'))
            return;
        await supabase.from('registrations').delete().eq('id', reg.id);
        await load();
    }
    if (loading)
        return _jsxs("div", { className: "text-center py-16 text-slate-400 flex items-center justify-center gap-2", children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), " Loading\u2026"] });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "My Registrations" }), _jsx("p", { className: "text-slate-500 mt-1", children: "All events you've registered for. View your QR ticket or cancel anytime." })] }), regs.length === 0 ? (_jsxs("div", { className: "text-center py-16 bg-white rounded-xl border border-dashed border-slate-300", children: [_jsx(CalendarX, { className: "w-10 h-10 text-slate-300 mx-auto mb-3" }), _jsx("p", { className: "text-slate-500", children: "You haven't registered for any events yet." })] })) : (_jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: regs.map((r) => {
                    const e = r.events;
                    if (!e)
                        return null;
                    const dateObj = new Date(e.event_date + 'T00:00');
                    const past = dateObj < new Date(new Date().toDateString());
                    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col", children: [_jsxs("div", { className: "relative", children: [_jsx(EventCover, { event: e, className: "h-28" }), _jsx("span", { className: `absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_META[e.category].color} bg-white/90`, children: CATEGORY_META[e.category].label }), past && _jsx("span", { className: "absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs bg-slate-700 text-white", children: "Past" })] }), _jsxs("div", { className: "p-5 flex-1 flex flex-col", children: [_jsx("h3", { className: "font-semibold text-slate-900 line-clamp-1", children: e.title }), _jsxs("div", { className: "mt-2 space-y-1.5 text-xs text-slate-500", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-3.5 h-3.5" }), " ", dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), " ", e.start_time, " \u2013 ", e.end_time] }), e.location && _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-3.5 h-3.5" }), " ", e.location] })] }), _jsx("div", { className: "mt-3 flex items-center gap-2 text-xs", children: _jsx("span", { className: `px-2 py-0.5 rounded-full capitalize ${r.status === 'registered' ? 'bg-emerald-50 text-emerald-700' : r.status === 'attended' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`, children: r.status }) }), _jsxs("div", { className: "mt-4 flex items-center gap-2", children: [_jsxs("button", { onClick: () => viewTicket(r), className: "flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2 rounded-lg", children: [_jsx(QrCode, { className: "w-4 h-4" }), " View QR ticket"] }), !past && (_jsx("button", { onClick: () => cancel(r), className: "p-2 rounded-lg border border-slate-300 text-red-500 hover:bg-red-50", title: "Cancel registration", children: _jsx(Trash2, { className: "w-4 h-4" }) }))] })] })] }, r.id));
                }) })), _jsx(QRTicketModal, { open: qrOpen, onClose: () => setQrOpen(false), event: qrEvent, token: qrToken, registrantName: profile?.full_name })] }));
}
