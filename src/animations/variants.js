export const premiumEasing = [0.23, 1, 0.32, 1];

export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: premiumEasing }
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5, ease: premiumEasing }
};

export const featherTransition = {
    initial: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.05, filter: "blur(10px)" },
    transition: { duration: 0.8, ease: premiumEasing }
};

export const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
    transition: { duration: 0.6, ease: premiumEasing }
};

export const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 60 },
    transition: { duration: 0.6, ease: premiumEasing }
};

export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.08
        }
    }
};

export const scaleHover = {
    whileHover: { scale: 1.02, transition: { duration: 0.3, ease: premiumEasing } },
    whileTap: { scale: 0.98 }
};

export const pageTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.6, ease: premiumEasing }
};

export const sidebarTransition = {
    type: "spring",
    stiffness: 260,
    damping: 30
};
