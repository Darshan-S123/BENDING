import { supabase } from './supabase';

// ─── LOANS ───────────────────────────────────────────────────────────────────

export const getLoans = async () => {
    const { data, error } = await supabase
        .from('loans')
        .select('*')
        .order('id', { ascending: false });
    if (error) { console.error('getLoans error:', error); return []; }
    return data || [];
};

export const saveLoan = async (loan) => {
    const { error } = await supabase.from('loans').upsert(loan);
    if (error) console.error('saveLoan error:', error);
};

export const saveLoans = async (loans) => {
    for (const loan of loans) {
        await saveLoan(loan);
    }
};

export const updateLoan = async (id, updatedData) => {
    const { error } = await supabase
        .from('loans')
        .update(updatedData)
        .eq('id', id);
    if (error) { console.error('updateLoan error:', error); return false; }
    return true;
};

export const deleteLoan = async (id) => {
    const { error } = await supabase
        .from('loans')
        .delete()
        .eq('id', id);
    if (error) { console.error('deleteLoan error:', error); return false; }
    return true;
};

// ─── LEDGER ──────────────────────────────────────────────────────────────────

export const getLedger = async () => {
    const { data, error } = await supabase
        .from('ledger')
        .select('*')
        .order('date', { ascending: false });
    if (error) { console.error('getLedger error:', error); return []; }
    return data || [];
};

export const addToLedger = async (entry) => {
    const newEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...entry
    };
    const { error } = await supabase.from('ledger').insert([newEntry]);
    if (error) console.error('addToLedger error:', error);
};

// ─── INTEREST CALCULATION ────────────────────────────────────────────────────

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
    if (basis === 'Weekly') {
        periods = diffDays / 7;
    } else if (basis === 'Yearly') {
        periods = diffDays / 365;
    } else {
        periods = diffDays / 30;
    }

    if (type === 'Simple') {
        return p * r * periods;
    } else {
        return p * Math.pow(1 + r, periods) - p;
    }
};

// ─── CURRENCY ────────────────────────────────────────────────────────────────

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};
