import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({
    children,
    onClick,
    className = '',
    variant = 'primary', // primary, secondary, outline, ghost
    icon: Icon,
    disabled = false,
    fullWidth = false
}) => {
    const baseStyles = "btn-premium px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-accent text-primary glow-accent",
        secondary: "bg-secondary text-text-main border border-border",
        outline: "bg-transparent border border-accent/30 text-accent hover:border-accent",
        ghost: "bg-transparent text-text-muted hover:text-text-main hover:bg-white/5",
        danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
        >
            {Icon && <Icon size={18} />}
            {children}
        </motion.button>
    );
};

export default AnimatedButton;
