import { supabase, supabaseAvailable } from './supabase';

// ─── LOCAL STORAGE HELPERS ─────────────────────────────────────────────────
const LS_LOANS   = 'bending_loans';
const LS_LEDGER  = 'bending_ledger';
const LS_REPORTS = 'bending_reports';

const lsGet = (key) => {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
};
const lsSet = (key, data) => {
    try { localStorage.setItem(key, JSON.stringify(data)); }
    catch (e) { console.warn('localStorage write failed', e); }
};

// ─── LOANS ─────────────────────────────────────────────────────────────────

export const getLoans = async () => {
    if (supabaseAvailable) {
        try {
            const { data, error } = await supabase
                .from('loans').select('*').order('id', { ascending: false });
            if (!error && data) {
                lsSet(LS_LOANS, data);
                return data;
            }
        } catch (e) { console.warn('Supabase getLoans failed, using localStorage:', e.message); }
    }
    return lsGet(LS_LOANS).sort((a, b) => b.id - a.id);
};

export const saveLoan = async (loan) => {
    const local = lsGet(LS_LOANS);
    const idx = local.findIndex(l => l.id === loan.id);
    if (idx !== -1) local[idx] = { ...local[idx], ...loan };
    else local.unshift(loan);
    lsSet(LS_LOANS, local);

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
    const local = lsGet(LS_LOANS);
    const idx = local.findIndex(l => l.id === id);
    if (idx !== -1) {
        local[idx] = { ...local[idx], ...updatedData };
        lsSet(LS_LOANS, local);
    }

    if (supabaseAvailable) {
        try {
            const { error } = await supabase.from('loans').update(updatedData).eq('id', id);
            if (error) { console.warn('Supabase updateLoan error:', error.message); return false; }
        } catch (e) { console.warn('Supabase updateLoan failed:', e.message); }
    }
    return true;
};

export const deleteLoan = async (id) => {
    const local = lsGet(LS_LOANS).filter(l => l.id !== id);
    lsSet(LS_LOANS, local);

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
    const local = [newEntry, ...lsGet(LS_LEDGER)];
    lsSet(LS_LEDGER, local);

    if (supabaseAvailable) {
        try {
            const { error } = await supabase.from('ledger').insert([newEntry]);
            if (error) console.warn('Supabase addToLedger error:', error.message);
        } catch (e) { console.warn('Supabase addToLedger failed:', e.message); }
    }
};

// ─── REPORTS ───────────────────────────────────────────────────────────────

export const getReports = async () => {
    if (supabaseAvailable) {
        try {
            const { data, error } = await supabase
                .from('reports').select('*').order('date', { ascending: false });
            if (!error && data) {
                lsSet(LS_REPORTS, data);
                return data;
            }
        } catch (e) { console.warn('Supabase getReports failed, using localStorage:', e.message); }
    }
    return lsGet(LS_REPORTS);
};

export const addReport = async (report) => {
    const newReport = { id: Date.now(), date: new Date().toISOString(), ...report };
    const local = [newReport, ...lsGet(LS_REPORTS)];
    lsSet(LS_REPORTS, local);

    if (supabaseAvailable) {
        try {
            const { error } = await supabase.from('reports').insert([newReport]);
            if (error) console.warn('Supabase addReport error:', error.message);
        } catch (e) { console.warn('Supabase addReport failed:', e.message); }
    }
};

export const clearReports = async () => {
    lsSet(LS_REPORTS, []);
    if (supabaseAvailable) {
        try {
            const { error } = await supabase.from('reports').delete().gt('id', 0);
            if (error) console.warn('Supabase clearReports error:', error.message);
        } catch (e) { console.warn('Supabase clearReports failed:', e.message); }
    }
};

// ─── UTILS ─────────────────────────────────────────────────────────────────

export const calculateInterest = (principal, rate, type, borrowDate, dueDate, basis = 'Monthly') => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const start = new Date(borrowDate);
    const end = new Date(dueDate);

    if (isNaN(p) || isNaN(r) || isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
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
    }).format(amount || 0);

// ─── EXPORT HELPERS ────────────────────────────────────────────────────────

export const exportLedgerCSV = async () => {
    const entries = await getLedger();
    if (!entries.length) return;
    const headers = ['Date', 'Customer', 'Type', 'Category', 'Amount', 'Status'];
    const rows = entries.map(e => [
        new Date(e.date).toLocaleDateString(),
        e.customerName,
        e.type,
        e.category,
        e.amount,
        e.status || 'Completed'
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

export const exportAllDataJSON = async () => {
    const loans = await getLoans();
    const ledger = await getLedger();
    const reports = await getReports();
    const payload = { exportedAt: new Date().toISOString(), loans, ledger, reports };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ss_finance_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

export const importDataFromJSON = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const { loans = [], ledger = [], reports = [] } = JSON.parse(e.target.result);
                for (const loan of loans) await saveLoan(loan);
                for (const entry of ledger) {
                    const local = lsGet(LS_LEDGER);
                    if (!local.find(l => l.id === entry.id)) {
                        await addToLedger(entry);
                    }
                }
                for (const report of reports) await addReport(report);
                resolve({ loans: loans.length, ledger: ledger.length, reports: reports.length });
            } catch (err) { reject(err); }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

export const deleteAllLoans = async () => {
    lsSet(LS_LOANS, []);
    lsSet(LS_LEDGER, []);
    lsSet(LS_REPORTS, []);
    if (supabaseAvailable) {
        try {
            await supabase.from('loans').delete().gt('id', 0);
            await supabase.from('ledger').delete().gt('id', 0);
            await supabase.from('reports').delete().gt('id', 0);
        } catch (e) { console.warn('Supabase deleteAll failed:', e.message); }
    }
};
