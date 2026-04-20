import React from 'react';
import { motion } from 'framer-motion';

const FeatherBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Soft Ambient Orbs */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="feather-orb w-[600px] h-[600px] -top-20 -left-20"
            />
            <motion.div
                animate={{
                    x: [0, -80, 0],
                    y: [0, 120, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="feather-orb w-[500px] h-[500px] bottom-0 -right-20"
                style={{ background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)', opacity: 0.2 }}
            />
            
            {/* Grain Texture (Optional but adds premium feel) */}
            <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        </div>
    );
};

export default FeatherBackground;
