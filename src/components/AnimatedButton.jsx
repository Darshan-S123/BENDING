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
    const baseStyles = "btn-premium px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-text-main text-background hover:opacity-90 shadow-sm",
        secondary: "bg-background text-text-main border border-border hover:bg-border",
        outline: "bg-transparent border border-border text-text-main hover:bg-background",
        ghost: "bg-transparent text-text-muted hover:text-text-main hover:bg-background",
        danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, translateY: -1 }}
            whileTap={{ scale: 0.98 }}
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
