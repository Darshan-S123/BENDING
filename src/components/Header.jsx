import React, { useState, useEffect } from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLoans } from '../utils/loanStore';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { logout } = useAuth();
    const [reminders, setReminders] = useState(0);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        try {
            const data = getLoans();
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const monthStr = nextMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
            const count = data.filter(l => l.settlementMonth === monthStr && l.status === 'Pending').length;
            setReminders(count);
        } catch (err) {
            console.error('Header Error:', err);
        }
    }, []);

    return (
        <header className="h-[var(--header-h)] border-b border-border bg-surface px-10 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4 bg-background px-4 py-2 rounded-md border border-border w-80 focus-within:bg-surface focus-within:border-accent transition-all">
                <Search size={16} className="text-text-muted" />
                <input
                    type="text"
                    placeholder="Quick search..."
                    className="bg-transparent border-none text-text-main outline-none w-full text-sm font-medium placeholder:text-text-muted/50"
                />
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <button
                        onClick={() => setShowPopup(!showPopup)}
                        className="p-2 text-text-muted hover:text-text-main hover:bg-background rounded transition-all relative"
                    >
                        <Bell size={20} />
                        {reminders > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-background" />
                        )}
                    </button>

                    <AnimatePresence>
                        {showPopup && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-12 right-0 w-72 p-4 glass-card z-50 rounded-2xl"
                            >
                                <h4 className="text-sm font-semibold mb-2 text-text-main">Notifications</h4>
                                <p className="text-xs text-text-muted">
                                    {reminders} members are scheduled for settlement next month.
                                </p>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="mt-4 w-full py-2 bg-background hover:bg-border border border-border rounded text-xs font-semibold text-text-main transition-all"
                                >
                                    Dismiss
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-8 w-px bg-border mx-4" />

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 cursor-pointer group px-3 py-1.5 rounded hover:bg-background transition-all border border-transparent hover:border-border">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-semibold text-text-main">Darshan S</div>
                            <div className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Administrator</div>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-text-main font-bold group-hover:bg-border transition-all">
                            D
                        </div>
                    </div>

                    <div className="h-8 w-px bg-border mx-2" />

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 text-text-muted hover:text-danger hover:bg-danger/5 rounded transition-all border border-transparent hover:border-danger/20 group/logout"
                    >
                        <LogOut size={16} className="group-hover/logout:rotate-12 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
