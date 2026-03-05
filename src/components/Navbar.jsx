import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, Calendar } from 'lucide-react';

const Navbar = () => {
    const currentMonth = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 w-full h-[var(--header-h)] bg-background/50 backdrop-blur-xl border-b border-border z-40 px-8 flex items-center justify-between"
        >
            <div className="flex items-center gap-12">
                <div className="flex flex-col">
                    <h2 className="text-text-main font-black text-xl tracking-tight">System Terminal</h2>
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                        Active Session
                    </p>
                </div>

                {/* Global Search */}
                <div className="hidden lg:flex items-center relative group">
                    <Search size={18} className="absolute left-4 text-text-muted group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search records, members, or analytics..."
                        className="bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-2.5 w-80 text-sm focus:border-accent/30 outline-none transition-all placeholder:text-text-muted/50 font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Month Selector Mini */}
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-accent/5 border border-accent/10 rounded-xl text-accent font-bold text-xs uppercase tracking-widest">
                    <Calendar size={14} />
                    {currentMonth}
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-2">
                    <button className="p-2.5 text-text-muted hover:text-text-main hover:bg-white/5 rounded-xl transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent border-2 border-background rounded-full" />
                    </button>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-border group cursor-pointer">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-text-main leading-none">Darshan S</span>
                        <span className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-tighter">System Admin</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-border group-hover:border-accent/50 transition-colors">
                        <div className="w-full h-full bg-gradient-to-br from-secondary to-background flex items-center justify-center text-accent font-black">
                            D
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
