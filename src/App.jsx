import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Events from '@/pages/Events';
import MyRegistrations from '@/pages/MyRegistrations';
function FullScreenLoader() {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center text-slate-400", children: _jsx(Loader2, { className: "w-6 h-6 animate-spin" }) }));
}
function Protected({ children }) {
    const { user, loading } = useAuth();
    if (loading)
        return _jsx(FullScreenLoader, {});
    if (!user)
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(Layout, { children: children });
}
function PublicOnly({ children }) {
    const { user, loading } = useAuth();
    if (loading)
        return _jsx(FullScreenLoader, {});
    if (user)
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    return _jsx(_Fragment, { children: children });
}
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/login", element: _jsx(PublicOnly, { children: _jsx(Auth, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(Protected, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/events", element: _jsx(Protected, { children: _jsx(Events, {}) }) }), _jsx(Route, { path: "/my-registrations", element: _jsx(Protected, { children: _jsx(MyRegistrations, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
