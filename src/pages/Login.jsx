import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import FeatherBackground from '../components/FeatherBackground';
import { premiumEasing, featherTransition, fadeInUp, staggerContainer } from '../animations/variants';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(password);
        if (success) {
            navigate('/');
        } else {
            setError(true);
            setPassword('');
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-background">
            <FeatherBackground />
            
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="relative z-10 w-full max-w-[420px]"
            >
                <motion.div 
                    variants={featherTransition}
                    className={`glass-card p-10 rounded-[2.5rem] text-center border-border/40 ${error ? 'animate-shake' : ''}`}
                >
                    <motion.div variants={fadeInUp} className="flex justify-center mb-10">
                        <div className="w-20 h-20 bg-accent/10 rounded-[1.8rem] flex items-center justify-center text-accent shadow-2xl shadow-accent/20 border border-accent/20">
                            <ShieldCheck size={40} />
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <h1 className="text-3xl font-serif font-bold text-text-main tracking-tight mb-2">Access Portal</h1>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-widest mb-10 opacity-70">Authenticated Session Required</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div variants={fadeInUp} className="relative group">
                            <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                            <input
                                type="password"
                                placeholder="Enter Access PIN"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                maxLength={4}
                                autoFocus
                                className="w-full bg-background/50 border border-border rounded-2xl py-5 pl-14 pr-6 text-2xl tracking-[0.8em] font-bold text-center text-text-main focus:border-accent/40 outline-none transition-all placeholder:text-text-muted/30 placeholder:tracking-normal placeholder:text-sm"
                            />
                        </motion.div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center justify-center gap-2 text-danger text-[11px] font-bold uppercase tracking-widest py-1"
                                >
                                    <AlertCircle size={14} />
                                    <span>Unauthorized Access Denied</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button 
                            variants={fadeInUp}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            className="w-full bg-text-main text-background py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-shadow group overflow-hidden relative"
                        >
                            <span className="relative z-10 tracking-widest uppercase text-xs">Unlock System</span>
                            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
                        </motion.button>
                    </form>

                    <motion.div variants={fadeInUp} className="mt-12 pt-8 border-t border-border/50">
                        <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase opacity-40 leading-relaxed">
                            SS Finance • Mettupalayam • 2026<br/>
                            End-to-End Encryption Protocol Active
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Custom Animation Styles */}
            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-6px); }
                    40%, 80% { transform: translateX(6px); }
                }
                .animate-shake {
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                    border-color: rgba(239, 68, 68, 0.4) !important;
                }
            `}</style>
        </div>
    );
};

export default Login;
