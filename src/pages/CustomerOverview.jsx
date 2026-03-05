import React, { useState, useEffect } from 'react';
import { getLoans, formatCurrency, updateLoan, deleteLoan } from '../utils/loanStore';
import { Search, User, Phone, Wallet, Calendar, Tag, Edit2, Save, X, Trash2, ShieldCheck, Mail, Activity, ArrowUpRight } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import Counter from '../components/Counter';

const CustomerOverview = () => {
    const [loans, setLoans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editModal, setEditModal] = useState(null);
    const [editForm, setEditForm] = useState({ customerName: '', phone: '' });

    useEffect(() => {
        setLoans(getLoans());
    }, []);

    const handleEdit = (loan) => {
        setEditModal(loan);
        setEditForm({ customerName: loan.customerName, phone: loan.phone });
    };

    const handleDelete = (id) => {
        if (window.confirm("Terminate this portfolio record?")) {
            if (deleteLoan(id)) {
                setLoans(getLoans());
            }
        }
    };

    const handleSave = () => {
        if (updateLoan(editModal.id, editForm)) {
            setEditModal(null);
            setLoans(getLoans());
        }
    };

    const filteredLoans = loans.filter(loan =>
        loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.phone.includes(searchTerm)
    );

    return (
        <PageWrapper>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-text-main tracking-tightest">Customer Portfolio</h1>
                    <p className="text-text-muted text-sm font-bold flex items-center gap-2 mt-2 uppercase tracking-widest">
                        <Activity size={14} className="text-accent" />
                        Global Entity Directory
                    </p>
                </div>
                <div className="relative group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH ENTITY..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full lg:w-96 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-black uppercase tracking-widest focus:border-accent/30 outline-none transition-all placeholder:text-text-muted/30"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredLoans.length > 0 ? (
                    filteredLoans.map((loan, index) => (
                        <AnimatedCard key={loan.id} delay={index * 0.05} noHover className="p-0 overflow-hidden group">
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-text-main tracking-tight group-hover:text-accent transition-colors">{loan.customerName}</h4>
                                            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-1">
                                                ID: {loan.id.toString().slice(-6)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${loan.status === 'Paid' ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'
                                        }`}>
                                        {loan.status}
                                    </span>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <ContactRow icon={Phone} label="Comm Link" value={loan.phone} />
                                    <ContactRow icon={Calendar} label="Last Activity" value={loan.dueDate} />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-accent/[0.02] transition-colors">
                                        <span className="block text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Exposure</span>
                                        <div className="text-lg font-black text-text-main">
                                            <Counter value={loan.principalAmount} prefix="₹" />
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-accent/[0.02] transition-colors">
                                        <span className="block text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Yield</span>
                                        <div className="text-lg font-black text-accent">
                                            <Counter value={loan.interest} prefix="₹" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6 border-t border-white/5">
                                    <AnimatedButton variant="secondary" fullWidth className="py-2.5 text-[10px]" onClick={() => handleEdit(loan)}>
                                        MANAGE ENTITY
                                    </AnimatedButton>
                                    <button
                                        onClick={() => handleDelete(loan.id)}
                                        className="p-2.5 bg-white/5 border border-white/5 text-text-muted hover:text-danger hover:border-danger/30 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </AnimatedCard>
                    ))
                ) : (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center opacity-50">
                        <ShieldCheck size={64} className="text-text-muted/20 mb-6" />
                        <h3 className="text-xl font-black text-text-main mb-2 tracking-tight">Records Missing</h3>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-widest">Zero matches found in decrypted database.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal Refactored */}
            {editModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <AnimatedCard className="w-full max-w-md p-8" noHover>
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="text-2xl font-black text-text-main tracking-tight">Record Refactor</h3>
                            <button onClick={() => setEditModal(null)} className="p-2 text-text-muted hover:text-text-main rounded-xl hover:bg-white/5 transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-6 mb-10">
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Primary Entity Name</label>
                                <input
                                    type="text"
                                    value={editForm.customerName}
                                    onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-accent/30 outline-none font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Communication Uplink</label>
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-accent/30 outline-none font-bold"
                                />
                            </div>
                        </div>
                        <AnimatedButton fullWidth icon={Save} onClick={handleSave}>
                            Commit Changes
                        </AnimatedButton>
                    </AnimatedCard>
                </div>
            )}
        </PageWrapper>
    );
};

const ContactRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest border-b border-white/[0.02] pb-2">
        <div className="flex items-center gap-2 text-text-muted">
            <Icon size={12} className="text-accent" />
            <span>{label}</span>
        </div>
        <span className="text-text-main">{value}</span>
    </div>
);

export default CustomerOverview;
