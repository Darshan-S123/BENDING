import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const Counter = ({ value, duration = 1.5, prefix = '', suffix = '' }) => {
    const springValue = useSpring(0, {
        duration: duration * 1000,
        bounce: 0,
    });

    const displayValue = useTransform(springValue, (latest) => {
        return prefix + Math.floor(latest).toLocaleString('en-IN') + suffix;
    });

    useEffect(() => {
        springValue.set(parseFloat(value) || 0);
    }, [value, springValue]);

    return (
        <motion.span className="font-black">
            {displayValue}
        </motion.span>
    );
};

export default Counter;
