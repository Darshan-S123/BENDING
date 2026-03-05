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
        <header className="h-[var(--header-h)] border-b border-white/5 bg-background/80 backdrop-blur-md px-10 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 w-80 focus-within:border-accent/30 transition-all">
                <Search size={18} className="text-text-muted" />
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
                        className="p-2 text-text-muted hover:text-text-main hover:bg-white/5 rounded-lg transition-all relative"
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
                                className="absolute top-12 right-0 w-72 p-4 card-office shadow-2xl z-50"
                            >
                                <h4 className="text-sm font-bold mb-2">Notifications</h4>
                                <p className="text-xs text-text-muted">
                                    {reminders} members are scheduled for settlement next month.
                                </p>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="mt-4 w-full py-2 bg-secondary hover:bg-white/10 rounded-lg text-xs font-bold transition-all"
                                >
                                    Dismiss
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-8 w-px bg-white/10 mx-2" />

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 cursor-pointer group px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-text-main">Darshan S</div>
                            <div className="text-[10px] font-bold text-accent uppercase tracking-wider">Administrator</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/20 flex items-center justify-center text-accent font-black group-hover:bg-accent/30 transition-all">
                            D
                        </div>
                    </div>

                    <div className="h-8 w-px bg-white/10 mx-1" />

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-xl transition-all border border-white/5 hover:border-danger/20 group/logout"
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
