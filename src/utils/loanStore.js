import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ─── LOCAL STORAGE HELPERS ─────────────────────────────────────────────────
const LS_LOANS = 'bending_loans';
const LS_LEDGER = 'bending_ledger';

const lsGet = (key) => {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
};
const lsSet = (key, data) => {
    try { localStorage.setItem(key, JSON.stringify(data)); }
    catch (e) { console.warn('localStorage write failed', e); }
};

// ─── SUPABASE CLIENT ────────────────────────────────────────────────────────
let supabase = null;
let supabaseAvailable = false;

const initSupabase = () => {
    if (!supabaseUrl || supabaseUrl.includes('YOUR_') || !supabaseAnonKey || supabaseAnonKey.includes('YOUR_')) {
        console.info('Supabase not configured, using localStorage.');
        return;
    }
    try {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        supabaseAvailable = true;
    } catch (e) {
        console.warn('Supabase init failed:', e);
    }
};

initSupabase();

// ─── LOANS ─────────────────────────────────────────────────────────────────

export const getLoans = async () => {
    if (supabaseAvailable) {
        try {
            const { data, error } = await supabase
                .from('loans').select('*').order('id', { ascending: false });
            if (!error && data) {
                lsSet(LS_LOANS, data); // keep local in sync
                return data;
            }
        } catch (e) { console.warn('Supabase getLoans failed, using localStorage:', e.message); }
    }
    return lsGet(LS_LOANS).sort((a, b) => b.id - a.id);
};

export const saveLoan = async (loan) => {
    // Always save to localStorage first (instant)
    const local = lsGet(LS_LOANS);
    const idx = local.findIndex(l => l.id === loan.id);
    if (idx !== -1) local[idx] = { ...local[idx], ...loan };
    else local.unshift(loan);
    lsSet(LS_LOANS, local);

    // Then sync to Supabase in background
    if (supabaseAvailable) {
        try {
            const { error } = await supabase.from('loans').upsert(loan);
            if (error) console.warn('Supabase saveLoan error:', error.message);
        } catch (e) { console.warn('Supabase saveLoan failed:', e.message); }
    }
};

export const saveLoans = async (loans) => {
    for (const loan of loans) await saveLoan(loan);
};

export const updateLoan = async (id, updatedData) => {
    // Update localStorage first
    const local = lsGet(LS_LOANS);
    const idx = local.findIndex(l => l.id === id);
    if (idx !== -1) {
        local[idx] = { ...local[idx], ...updatedData };
        lsSet(LS_LOANS, local);
    }

    // Sync to Supabase
    if (supabaseAvailable) {
        try {
            const { error } = await supabase.from('loans').update(updatedData).eq('id', id);
            if (error) { console.warn('Supabase updateLoan error:', error.message); return false; }
        } catch (e) { console.warn('Supabase updateLoan failed:', e.message); }
    }
    return true;
};

export const deleteLoan = async (id) => {
    // Delete from localStorage first
    const local = lsGet(LS_LOANS).filter(l => l.id !== id);
    lsSet(LS_LOANS, local);

    // Sync to Supabase
    if (supabaseAvailable) {
        try {
            const { error } = await supabase.from('loans').delete().eq('id', id);
            if (error) { console.warn('Supabase deleteLoan error:', error.message); return false; }
        } catch (e) { console.warn('Supabase deleteLoan failed:', e.message); }
    }
    return true;
};

// ─── LEDGER ────────────────────────────────────────────────────────────────

export const getLedger = async () => {
    if (supabaseAvailable) {
        try {
            const { data, error } = await supabase
                .from('ledger').select('*').order('date', { ascending: false });
            if (!error && data) {
                lsSet(LS_LEDGER, data);
                return data;
            }
        } catch (e) { console.warn('Supabase getLedger failed, using localStorage:', e.message); }
    }
    return lsGet(LS_LEDGER);
};

export const addToLedger = async (entry) => {
    const newEntry = { id: Date.now(), date: new Date().toISOString(), ...entry };

    // Save to localStorage first
    const local = [newEntry, ...lsGet(LS_LEDGER)];
    lsSet(LS_LEDGER, local);

    // Sync to Supabase
    if (supabaseAvailable) {
        try {
            const { error } = await supabase.from('ledger').insert([newEntry]);
            if (error) console.warn('Supabase addToLedger error:', error.message);
        } catch (e) { console.warn('Supabase addToLedger failed:', e.message); }
    }
};

// ─── UTILS ─────────────────────────────────────────────────────────────────

export const calculateInterest = (principal, rate, type, borrowDate, dueDate, basis = 'Monthly') => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const start = new Date(borrowDate);
    const end = new Date(dueDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = end - start;
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let periods;
    if (basis === 'Weekly') periods = diffDays / 7;
    else if (basis === 'Yearly') periods = diffDays / 365;
    else periods = diffDays / 30;

    return type === 'Simple'
        ? p * r * periods
        : p * Math.pow(1 + r, periods) - p;
};

export const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
