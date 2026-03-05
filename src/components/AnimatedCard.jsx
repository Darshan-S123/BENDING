import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, scaleHover } from '../animations/variants';

const AnimatedCard = ({ children, className = '', delay = 0, noHover = false }) => {
    return (
        <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ ...fadeInUp.transition, delay }}
            {...(!noHover ? scaleHover : {})}
            className={`glass-card p-6 rounded-2xl ${className} relative overflow-hidden group`}
        >
            {/* Inner Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Decorative Accent Glow */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/5 blur-2xl group-hover:bg-accent/10 transition-all rounded-full" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default AnimatedCard;
