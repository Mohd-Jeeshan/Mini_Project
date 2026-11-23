import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});
export const CATEGORY_META = {
    workshop: { label: 'Workshop', color: 'bg-amber-100 text-amber-800 border-amber-200', gradient: 'from-amber-500 to-orange-600', pattern: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,.18) 0 2px, transparent 2px), radial-gradient(circle at 75% 75%, rgba(255,255,255,.12) 0 2px, transparent 2px)' },
    seminar: { label: 'Seminar', color: 'bg-blue-100 text-blue-800 border-blue-200', gradient: 'from-blue-600 to-indigo-700', pattern: 'repeating-linear-gradient(45deg, rgba(255,255,255,.06) 0 10px, transparent 10px 20px)' },
    cultural: { label: 'Cultural', color: 'bg-pink-100 text-pink-800 border-pink-200', gradient: 'from-pink-500 to-rose-600', pattern: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,.2) 0 3px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(255,255,255,.14) 0 3px, transparent 3px)' },
    sports: { label: 'Sports', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', gradient: 'from-emerald-500 to-teal-600', pattern: 'repeating-linear-gradient(-45deg, rgba(255,255,255,.07) 0 12px, transparent 12px 24px)' },
    technical: { label: 'Technical', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', gradient: 'from-cyan-600 to-blue-700', pattern: 'linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,.06) 1px, transparent 1px)' },
    other: { label: 'Other', color: 'bg-slate-100 text-slate-800 border-slate-200', gradient: 'from-slate-700 to-slate-900', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,.12) 0 2px, transparent 2px)' },
};
