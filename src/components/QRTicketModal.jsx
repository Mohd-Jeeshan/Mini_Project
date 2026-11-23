import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, X, Calendar, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
export default function QRTicketModal({ open, onClose, event, token, registrantName }) {
    const canvasRef = useRef(null);
    const [dataUrl, setDataUrl] = useState('');
    useEffect(() => {
        if (!open || !token)
            return;
        const payload = JSON.stringify({ event_id: event?.id, token, app: 'campus-events' });
        QRCode.toCanvas(canvasRef.current, payload, { width: 220, margin: 1, color: { dark: '#0f172a' } }, () => {
            if (canvasRef.current)
                setDataUrl(canvasRef.current.toDataURL('image/png'));
        });
        QRCode.toDataURL(payload, { width: 600, margin: 2, color: { dark: '#0f172a' } }).then(setDataUrl);
    }, [open, token, event]);
    if (!open || !event)
        return null;
    function download() {
        if (!dataUrl)
            return;
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${event?.title.replace(/\s+/g, '-').toLowerCase()}-ticket.png`;
        a.click();
    }
    const dateStr = new Date(event.event_date + 'T00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden", children: [_jsxs("div", { className: "relative bg-gradient-to-br from-emerald-600 to-teal-600 px-6 py-5 text-white", children: [_jsx("button", { onClick: onClose, className: "absolute right-4 top-4 text-white/80 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex items-center gap-2 text-emerald-50 text-sm", children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), " Registration confirmed"] }), _jsx("h3", { className: "text-xl font-bold mt-1", children: event.title })] }), _jsxs("div", { className: "px-6 py-6", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "p-4 bg-white rounded-xl border-4 border-dashed border-emerald-200", children: _jsx("canvas", { ref: canvasRef, className: "block" }) }), _jsx("p", { className: "text-xs text-slate-400 mt-2 font-mono break-all text-center", children: token })] }), _jsxs("div", { className: "mt-5 space-y-2 text-sm", children: [registrantName && (_jsx(Row, { label: "Attendee", value: registrantName })), _jsx(Row, { icon: _jsx(Calendar, { className: "w-4 h-4 text-slate-400" }), label: "Date", value: dateStr }), _jsx(Row, { icon: _jsx(Clock, { className: "w-4 h-4 text-slate-400" }), label: "Time", value: `${event.start_time} – ${event.end_time}` }), event.location && _jsx(Row, { icon: _jsx(MapPin, { className: "w-4 h-4 text-slate-400" }), label: "Venue", value: event.location })] }), _jsxs("button", { onClick: download, className: "mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg py-3 transition", children: [_jsx(Download, { className: "w-4 h-4" }), " Download QR ticket"] }), _jsx("p", { className: "text-xs text-slate-500 text-center mt-3", children: "Present this QR code at the event entrance for check-in." })] })] }) }));
}
function Row({ icon, label, value }) {
    return (_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("span", { className: "flex items-center gap-1.5 text-slate-500", children: [icon, label] }), _jsx("span", { className: "text-slate-900 font-medium text-right", children: value })] }));
}
export async function registerForEvent(eventId) {
    const { data, error } = await supabase
        .from('registrations')
        .insert({ event_id: eventId })
        .select('qr_token')
        .maybeSingle();
    if (error)
        throw error;
    return data?.qr_token ?? null;
}
