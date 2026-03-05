// Simple obfuscation to prevent plain-text reading
const encode = (data) => btoa(unescape(encodeURIComponent(JSON.stringify(data))));
const decode = (data) => {
    try {
        return JSON.parse(decodeURIComponent(escape(atob(data))));
    } catch (e) {
        // Fallback for non-obfuscated data
        return JSON.parse(data);
    }
};

export const saveLoans = (loans) => {
    localStorage.setItem('bending_loans', encode(loans));
};

export const getLedger = () => {
    try {
        const ledger = localStorage.getItem('bending_ledger');
        if (!ledger) return [];
        return decode(ledger);
    } catch (e) {
        return [];
    }
};

export const saveLedger = (entries) => {
    localStorage.setItem('bending_ledger', encode(entries));
};

export const addToLedger = (entry) => {
    const ledger = getLedger();
    const newEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...entry
    };
    ledger.unshift(newEntry);
    saveLedger(ledger);
};

export const getLoans = () => {
    try {
        const loans = localStorage.getItem('bending_loans');
        if (!loans) return [];
        return decode(loans);
    } catch (e) {
        console.error("Error parsing loans from localStorage:", e);
        return [];
    }
};

export const calculateInterest = (principal, rate, type, borrowDate, dueDate, basis = 'Monthly') => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const start = new Date(borrowDate);
    const end = new Date(dueDate);

    // Ensure we have valid dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

    // Total days difference
    const diffTime = end - start;
    if (diffTime < 0) return 0; // Negative time means no interest

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let periods;
    if (basis === 'Weekly') {
        periods = diffDays / 7;
    } else if (basis === 'Yearly') {
        periods = diffDays / 365;
    } else {
        // Monthly - special logic for "per month"
        // 1 month = 30 days for calculation purposes
        periods = diffDays / 30;
    }

    if (type === 'Simple') {
        return p * r * periods;
    } else {
        // Compounding based on the selected basis
        return p * Math.pow(1 + r, periods) - p;
    }
};

export const updateLoan = (id, updatedData) => {
    const loans = getLoans();
    const index = loans.findIndex(l => l.id === id);
    if (index !== -1) {
        loans[index] = { ...loans[index], ...updatedData };
        saveLoans(loans);
        return true;
    }
    return false;
};

export const deleteLoan = (id) => {
    const loans = getLoans();
    const filtered = loans.filter(l => l.id !== id);
    if (loans.length !== filtered.length) {
        saveLoans(filtered);
        return true;
    }
    return false;
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};
