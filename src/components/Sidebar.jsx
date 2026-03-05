import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Wallet,
    History,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    CreditCard
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { sidebarTransition } from '../animations/variants';

const NavItem = ({ icon: Icon, label, path, collapsed, active }) => (
    <Link to={path}>
        <motion.div
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all relative group
        ${active ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-white/5 hover:text-text-main'}
      `}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
        >
            <Icon size={22} className={active ? 'text-accent' : 'group-hover:text-text-main'} />
            <AnimatePresence>
                {!collapsed && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-bold text-sm"
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>

            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
                    transition={sidebarTransition}
                />
            )}

            {collapsed && (
                <div className="absolute left-16 bg-secondary text-text-main px-3 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap border border-border">
                    {label}
                </div>
            )}
        </motion.div>
    </Link>
);

const Sidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Wallet, label: 'Loans', path: '/loans' },
        { icon: FileText, label: 'Drafts', path: '/drafts' },
        { icon: CreditCard, label: 'Monthly Settlement', path: '/settlement' },
        { icon: History, label: 'Ledger', path: '/ledger' },
        { icon: FileText, label: 'Reports', path: '/reports' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-expanded)' }}
            className="h-screen sticky top-0 bg-secondary/30 backdrop-blur-xl border-r border-border flex flex-col z-50 overflow-hidden"
            transition={sidebarTransition}
        >
            {/* Logo Section */}
            <div className="p-6 flex items-center gap-3">
                <div className="min-w-[32px] h-8 bg-gradient-to-tr from-accent to-accent-secondary rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
                    <TrendingUp size={20} className="text-white" />
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex flex-col"
                        >
                            <span className="font-black text-lg tracking-tighter text-text-main leading-none">SS FINANCE</span>
                            <span className="text-[10px] font-bold text-accent tracking-[.2em] uppercase">Enterprise</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 space-y-2 py-6">
                {navItems.map((item) => (
                    <NavItem
                        key={item.path}
                        {...item}
                        collapsed={collapsed}
                        active={location.pathname === item.path}
                    />
                ))}
            </div>

            {/* Collapse Toggle */}
            <div className="p-4 border-t border-border">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center p-3 text-text-muted hover:text-text-main hover:bg-white/5 rounded-xl transition-all"
                >
                    {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest"><ChevronLeft size={16} /> Minimize</div>}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
