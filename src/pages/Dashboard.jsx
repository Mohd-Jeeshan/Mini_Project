import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Ticket, TrendingUp, Users, Plus, ArrowRight, Calendar } from 'lucide-react';
import { supabase, CATEGORY_META } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
export default function Dashboard() {
    const { profile } = useAuth();
    const [events, setEvents] = useState([]);
    const [myRegs, setMyRegs] = useState([]);
    const [totalRegs, setTotalRegs] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            const [{ data: ev }, { data: regs }, { count }] = await Promise.all([
                supabase.from('events').select('*').order('event_date', { ascending: true }).limit(5),
                supabase.from('registrations').select('*').eq('status', 'registered'),
                supabase.from('registrations').select('*', { count: 'exact', head: true }),
            ]);
            setEvents(ev ?? []);
            setMyRegs(regs ?? []);
            setTotalRegs(count ?? 0);
            setLoading(false);
        })();
    }, []);
    const upcoming = events.filter((e) => new Date(e.event_date) >= new Date(new Date().toDateString()));
    const myEventIds = new Set(myRegs.map((r) => r.event_id));
    const myUpcoming = events.filter((e) => myEventIds.has(e.id));
    const myCount = myRegs.length;
    const stats = [
        { label: 'Total Events', value: events.length, icon: _jsx(CalendarDays, { className: "w-5 h-5" }), color: 'from-emerald-500 to-teal-500' },
        { label: 'My Registrations', value: myCount, icon: _jsx(Ticket, { className: "w-5 h-5" }), color: 'from-blue-500 to-indigo-500' },
        { label: 'Total Registrations', value: totalRegs, icon: _jsx(Users, { className: "w-5 h-5" }), color: 'from-amber-500 to-orange-500' },
        { label: 'Upcoming Events', value: upcoming.length, icon: _jsx(TrendingUp, { className: "w-5 h-5" }), color: 'from-pink-500 to-rose-500' },
    ];
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-slate-900", children: ["Welcome back, ", profile?.full_name?.split(' ')[0] || 'Student', " \uD83D\uDC4B"] }), _jsx("p", { className: "text-slate-500 mt-1", children: "Here's what's happening on campus." })] }), _jsxs(Link, { to: "/events", className: "inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition", children: [_jsx(Plus, { className: "w-4 h-4" }), " Browse events"] })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: stats.map((s) => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-5", children: [_jsx("div", { className: `w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3`, children: s.icon }), _jsx("div", { className: "text-2xl font-bold text-slate-900", children: loading ? '—' : s.value }), _jsx("div", { className: "text-sm text-slate-500", children: s.label })] }, s.label))) }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 bg-white rounded-xl border border-slate-200", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-slate-100", children: [_jsx("h2", { className: "font-semibold text-slate-900", children: "Upcoming Events" }), _jsxs(Link, { to: "/events", className: "text-sm text-emerald-700 hover:underline flex items-center gap-1", children: ["View all ", _jsx(ArrowRight, { className: "w-3.5 h-3.5" })] })] }), _jsxs("div", { className: "divide-y divide-slate-100", children: [loading && _jsx("div", { className: "px-5 py-8 text-center text-slate-400", children: "Loading\u2026" }), !loading && upcoming.length === 0 && _jsx("div", { className: "px-5 py-8 text-center text-slate-400", children: "No upcoming events." }), upcoming.map((e) => (_jsxs("div", { className: "px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition", children: [_jsxs("div", { className: "w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex flex-col items-center justify-center flex-shrink-0", children: [_jsx("span", { className: "text-[10px] uppercase font-semibold", children: new Date(e.event_date + 'T00:00').toLocaleDateString(undefined, { month: 'short' }) }), _jsx("span", { className: "text-base font-bold leading-none", children: new Date(e.event_date + 'T00:00').getDate() })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-medium text-slate-900 truncate", children: e.title }), _jsxs("div", { className: "text-sm text-slate-500 flex items-center gap-2 mt-0.5", children: [_jsx("span", { className: `px-2 py-0.5 rounded text-[11px] border ${CATEGORY_META[e.category].color}`, children: CATEGORY_META[e.category].label }), e.location && _jsx("span", { className: "truncate", children: e.location })] })] }), _jsx(Link, { to: "/events", className: "text-sm text-emerald-700 font-medium hover:underline flex-shrink-0", children: "View" })] }, e.id)))] })] }), _jsxs("div", { className: "bg-white rounded-xl border border-slate-200", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-slate-100", children: [_jsx("h2", { className: "font-semibold text-slate-900", children: "My Next Events" }), _jsx(Link, { to: "/my-registrations", className: "text-sm text-emerald-700 hover:underline", children: "All" })] }), _jsxs("div", { className: "divide-y divide-slate-100", children: [myUpcoming.length === 0 && _jsx("div", { className: "px-5 py-8 text-center text-slate-400 text-sm", children: "No registrations yet." }), myUpcoming.map((e) => (_jsxs("div", { className: "px-5 py-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-500 mb-1", children: [_jsx(Calendar, { className: "w-3 h-3" }), " ", new Date(e.event_date + 'T00:00').toLocaleDateString()] }), _jsx("div", { className: "font-medium text-slate-900 text-sm truncate", children: e.title }), _jsxs("div", { className: "text-xs text-slate-500", children: [e.start_time, " \u2013 ", e.end_time] })] }, e.id)))] })] })] })] }));
}
