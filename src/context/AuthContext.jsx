import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    async function loadProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
        if (error) {
            console.error('profile load error', error);
            return;
        }
        if (!data) {
            const { data: created, error: cerr } = await supabase
                .from('profiles')
                .insert({ id: userId, full_name: '', role: 'student' })
                .select('*')
                .maybeSingle();
            if (cerr) {
                console.error('profile create error', cerr);
                return;
            }
            setProfile(created);
            return;
        }
        setProfile(data);
    }
    useEffect(() => {
        let mounted = true;
        supabase.auth.getSession().then(({ data }) => {
            if (!mounted)
                return;
            setSession(data.session);
            setUser(data.session?.user ?? null);
            if (data.session?.user) {
                loadProfile(data.session.user.id).finally(() => mounted && setLoading(false));
            }
            else {
                setLoading(false);
            }
        });
        const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
            (async () => {
                setSession(sess);
                setUser(sess?.user ?? null);
                if (sess?.user) {
                    await loadProfile(sess.user.id);
                }
                else {
                    setProfile(null);
                }
                setLoading(false);
            })();
        });
        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);
    const signUp = async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error)
            return { error: error.message };
        if (data.user) {
            await supabase.from('profiles').upsert({
                id: data.user.id,
                full_name: fullName,
                role: 'student',
            });
        }
        return { error: null };
    };
    const signIn = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error)
            return { error: error.message };
        return { error: null };
    };
    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
    };
    const refreshProfile = async () => {
        if (user)
            await loadProfile(user.id);
    };
    return (_jsx(AuthContext.Provider, { value: { session, user, profile, loading, signUp, signIn, signOut, refreshProfile }, children: children }));
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
