import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Search, Download, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { getLedger, formatCurrency, exportLedgerCSV } from '../utils/loanStore';

const Ledger = () => {
    const [entries, setEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLedger = async () => {
            const data = await getLedger();
            setEntries(data);
        };
        fetchLedger();
    }, []);

    const filteredEntries = entries.filter(e =>
        e.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageWrapper>
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-text-main tracking-tight">Ledger</h1>
                        <p className="text-text-muted mt-1 font-medium">Transaction history and financial audit log.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-surface px-4 py-2 rounded-xl border border-border focus-within:border-accent/30 transition-all">
                            <Search size={18} className="text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="bg-transparent border-none text-text-main outline-none text-sm placeholder:text-text-muted/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => exportLedgerCSV()}
                            title="Download as CSV"
                            className="p-2.5 bg-secondary hover:bg-secondary rounded-xl text-text-main border border-border transition-all"
                        >
                            <Download size={20} />
                        </button>
                    </div>
                </header>

                <div className="card-office overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border text-[10px] uppercase tracking-[0.2em] font-black text-accent">
                                    <th className="px-6 py-5">Date</th>
                                    <th className="px-6 py-5">Customer</th>
                                    <th className="px-6 py-5">Type</th>
                                    <th className="px-6 py-5">Category</th>
                                    <th className="px-6 py-5 text-right">Amount</th>
                                    <th className="px-6 py-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
                                    <motion.tr
                                        key={entry.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-surface transition-colors group"
                                    >
                                        <td className="px-6 py-4 text-sm text-text-muted">
                                            {new Date(entry.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-text-main text-sm">{entry.customerName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {entry.category === 'Settlement' ? (
                                                    <ArrowDownLeft size={14} className="text-success" />
                                                ) : (
                                                    <ArrowUpRight size={14} className="text-accent" />
                                                )}
                                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{entry.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                entry.category === 'Settlement' ? 'bg-success/10 text-success' :
                                                entry.category === 'Penalty' ? 'bg-danger/10 text-danger' :
                                                'bg-accent/10 text-accent'
                                            }`}>{entry.category || 'Loan'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`text-sm font-black ${entry.category === 'Settlement' ? 'text-success' : 'text-text-main'}`}>
                                                {formatCurrency(entry.amount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-surface rounded-full text-[10px] font-black uppercase text-text-muted border border-border">
                                                {entry.status || 'Completed'}
                                            </span>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center text-text-muted font-bold">
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Ledger;
