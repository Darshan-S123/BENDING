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
            className={`glass-card p-6 rounded-md ${className} relative overflow-hidden group`}
        >
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default AnimatedCard;
