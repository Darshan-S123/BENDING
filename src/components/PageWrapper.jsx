import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../animations/variants';

const PageWrapper = ({ children }) => {
    return (
        <motion.div
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};

export default PageWrapper;
