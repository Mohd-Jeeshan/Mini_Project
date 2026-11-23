import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User as UserIcon, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
export default function Auth() {
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setBusy(true);
        try {
            if (mode === 'login') {
                const { error } = await signIn(email, password);
                if (error)
                    setError(error);
                else
                    navigate('/dashboard');
            }
            else {
                const { error } = await signUp(email, password, fullName);
                if (error)
                    setError(error);
                else
                    navigate('/dashboard');
            }
        }
        finally {
            setBusy(false);
        }
    }
    return (_jsxs("div", { className: "min-h-screen flex flex-col lg:flex-row", children: [_jsxs("div", { className: "lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-10", style: { backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)', backgroundSize: '40px 40px' } }), _jsxs("div", { className: "relative flex items-center gap-3", children: [_jsx("div", { className: "w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30", children: _jsx(GraduationCap, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold leading-tight", children: "Campus Events" }), _jsx("p", { className: "text-slate-300 text-sm", children: "Institute Event Management" })] })] }), _jsxs("div", { className: "relative my-12 lg:my-0", children: [_jsxs("h2", { className: "text-3xl lg:text-4xl font-bold leading-tight mb-4", children: ["Discover, register & manage", _jsx("br", {}), "campus events in one place."] }), _jsx("p", { className: "text-slate-300 text-lg max-w-md", children: "Browse workshops, seminars and cultural nights. Register with a single click and get your QR-coded entry pass instantly." }), _jsx("div", { className: "mt-8 flex flex-wrap gap-3", children: ['Workshops', 'Seminars', 'Cultural', 'Sports', 'Technical'].map((t) => (_jsx("span", { className: "px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm border border-white/10", children: t }, t))) })] }), _jsxs("p", { className: "relative text-slate-400 text-sm", children: ["\u00A9 ", new Date().getFullYear(), " Campus Events. All rights reserved."] })] }), _jsx("div", { className: "lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-slate-50", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-slate-900", children: mode === 'login' ? 'Welcome back' : 'Create your account' }), _jsx("p", { className: "text-slate-500 mt-1", children: mode === 'login' ? 'Sign in to manage your event registrations.' : 'Join to register for institute events.' })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [mode === 'signup' && (_jsx(Field, { icon: _jsx(UserIcon, { className: "w-4 h-4" }), label: "Full name", children: _jsx("input", { required: true, value: fullName, onChange: (e) => setFullName(e.target.value), className: "w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400", placeholder: "Jane Doe" }) })), _jsx(Field, { icon: _jsx(Mail, { className: "w-4 h-4" }), label: "Email", children: _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400", placeholder: "you@institute.edu" }) }), _jsx(Field, { icon: _jsx(Lock, { className: "w-4 h-4" }), label: "Password", trailing: _jsx("button", { type: "button", onClick: () => setShowPassword((s) => !s), className: "text-slate-400 hover:text-slate-700 transition", tabIndex: -1, "aria-label": showPassword ? 'Hide password' : 'Show password', children: showPassword ? _jsx(EyeOff, { className: "w-4 h-4" }) : _jsx(Eye, { className: "w-4 h-4" }) }), children: _jsx("input", { type: showPassword ? 'text' : 'password', required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }) }), error && (_jsx("div", { className: "text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2", children: error })), _jsx("button", { type: "submit", disabled: busy, className: "w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium rounded-lg py-3 transition-colors shadow-sm", children: busy ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : _jsxs(_Fragment, { children: [mode === 'login' ? 'Sign in' : 'Create account', " ", _jsx(ArrowRight, { className: "w-4 h-4" })] }) })] }), _jsxs("p", { className: "text-center text-sm text-slate-500 mt-6", children: [mode === 'login' ? "Don't have an account?" : 'Already have an account?', ' ', _jsx("button", { onClick: () => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }, className: "text-emerald-700 font-medium hover:underline", children: mode === 'login' ? 'Sign up' : 'Sign in' })] })] }) })] }));
}
function Field({ icon, label, children, trailing }) {
    return (_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-sm font-medium text-slate-700", children: label }), _jsxs("div", { className: "mt-1 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition", children: [_jsx("span", { className: "text-slate-400", children: icon }), children, trailing] })] }));
}
