import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { getLoans, deleteLoan } from '../utils/loanStore';

const Drafts = () => {
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrafts = async () => {
            const loans = await getLoans();
            setDrafts(loans.filter(l => l.status === 'Draft'));
            setLoading(false);
        };
        fetchDrafts();
    }, []);

    const handleDeleteDraft = async (id) => {
        await deleteLoan(id);
        setDrafts(prev => prev.filter(d => d.id !== id));
    };

    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-4xl font-black text-white tracking-tight">Drafts</h1>
                    <p className="text-text-muted mt-1 font-medium">Review and finalize pending loan disbursements.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center text-text-muted font-bold">Loading drafts...</div>
                    ) : drafts.length > 0 ? drafts.map((draft) => (
                        <motion.div
                            key={draft.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-secondary/20 rounded-2xl border border-white/5 space-y-4 hover:border-accent/30 transition-all group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                                    <FileText size={20} />
                                </div>
                                <button
                                    onClick={() => handleDeleteDraft(draft.id)}
                                    className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-text-main">{draft.customerName || 'Unnamed Draft'}</h3>
                                <p className="text-xs text-text-muted font-bold uppercase tracking-widest">
                                    Principal: ₹{draft.principalAmount || 0}
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/loans', { state: { draft } })}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent/10 border border-accent/20 text-accent rounded-xl text-xs font-bold hover:bg-accent/20 transition-all"
                            >
                                Resume Draft <ArrowRight size={14} />
                            </button>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center bg-secondary/10 rounded-3xl border border-dashed border-white/10">
                            <FileText size={40} className="mx-auto text-text-muted/30 mb-4" />
                            <p className="text-text-muted font-bold">No draft transactions detected.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default Drafts;
