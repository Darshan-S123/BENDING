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
            className={`glass-card p-6 rounded-lg ${className} relative overflow-hidden group`}
        >
            {/* Feather Shine Effect */}
            {!noHover && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    initial={{ x: '-100%', y: '-100%' }}
                    whileHover={{ x: '100%', y: '100%' }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                />
            )}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default AnimatedCard;
