export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
};

export const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
    transition: { duration: 0.4, ease: "easeOut" }
};

export const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 60 },
    transition: { duration: 0.4, ease: "easeOut" }
};

export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

export const scaleHover = {
    whileHover: { scale: 1.02, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 }
};

export const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: "easeInOut" }
};

export const sidebarTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
};
