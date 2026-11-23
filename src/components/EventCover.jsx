import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Code2, Presentation, Music, Trophy, Cpu, Sparkles } from 'lucide-react';
import { CATEGORY_META } from '@/lib/supabase';
const ICONS = {
    workshop: _jsx(Code2, { className: "w-12 h-12" }),
    seminar: _jsx(Presentation, { className: "w-12 h-12" }),
    cultural: _jsx(Music, { className: "w-12 h-12" }),
    sports: _jsx(Trophy, { className: "w-12 h-12" }),
    technical: _jsx(Cpu, { className: "w-12 h-12" }),
    other: _jsx(Sparkles, { className: "w-12 h-12" }),
};
export default function EventCover({ event, className = 'h-36' }) {
    const cat = event.category;
    const meta = CATEGORY_META[cat];
    if (event.image_url) {
        return (_jsxs("div", { className: `${className} relative overflow-hidden`, children: [_jsx("img", { src: event.image_url, alt: event.title, className: "w-full h-full object-cover", loading: "lazy" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" })] }));
    }
    return (_jsxs("div", { className: `${className} relative overflow-hidden bg-gradient-to-br ${meta.gradient}`, children: [_jsx("div", { className: "absolute inset-0", style: { backgroundImage: meta.pattern, backgroundSize: '24px 24px' } }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center text-white/40", children: ICONS[cat] })] }));
}
