import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, CalendarDays, Ticket, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
export default function Layout({ children }) {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();
    const loc = useLocation();
    const [open, setOpen] = useState(false);
    const links = [
        { to: '/dashboard', label: 'Dashboard', icon: _jsx(LayoutDashboard, { className: "w-4 h-4" }) },
        { to: '/events', label: 'Events', icon: _jsx(CalendarDays, { className: "w-4 h-4" }) },
        { to: '/my-registrations', label: 'My Registrations', icon: _jsx(Ticket, { className: "w-4 h-4" }) },
    ];
    async function handleSignOut() {
        await signOut();
        navigate('/login');
    }
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col", children: [_jsxs("header", { className: "sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16", children: [_jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm", children: _jsx(GraduationCap, { className: "w-5 h-5" }) }), _jsxs("div", { className: "leading-tight", children: [_jsx("div", { className: "font-bold text-slate-900 text-sm", children: "Campus Events" }), _jsx("div", { className: "text-[11px] text-slate-500", children: "Institute Management" })] })] }), _jsx("nav", { className: "hidden md:flex items-center gap-1", children: links.map((l) => (_jsxs(Link, { to: l.to, className: `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${loc.pathname === l.to ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`, children: [l.icon, l.label] }, l.to))) }), _jsxs("div", { className: "hidden md:flex items-center gap-3", children: [_jsxs("div", { className: "text-right leading-tight", children: [_jsx("div", { className: "text-sm font-medium text-slate-900", children: profile?.full_name || 'Student' }), _jsx("div", { className: "text-[11px] text-slate-500 capitalize", children: profile?.role || 'student' })] }), _jsx("div", { className: "w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm", children: (profile?.full_name || 'S').charAt(0).toUpperCase() }), _jsx("button", { onClick: handleSignOut, className: "text-slate-500 hover:text-red-600 p-2 rounded-lg hover:bg-slate-100", title: "Sign out", children: _jsx(LogOut, { className: "w-4 h-4" }) })] }), _jsx("button", { className: "md:hidden p-2", onClick: () => setOpen(!open), children: open ? _jsx(X, { className: "w-5 h-5" }) : _jsx(Menu, { className: "w-5 h-5" }) })] }), open && (_jsxs("div", { className: "md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1", children: [links.map((l) => (_jsxs(Link, { to: l.to, onClick: () => setOpen(false), className: `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${loc.pathname === l.to ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`, children: [l.icon, l.label] }, l.to))), _jsxs("button", { onClick: handleSignOut, className: "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50", children: [_jsx(LogOut, { className: "w-4 h-4" }), " Sign out"] })] }))] }), _jsx("main", { className: "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8", children: children }), _jsx("footer", { className: "border-t border-slate-200 bg-white", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-400", children: "Campus Events \u2014 Institute Event Management System" }) })] }));
}
