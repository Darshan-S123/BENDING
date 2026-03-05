import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-background text-text-main overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 blur-[120px] rounded-full" />
            </div>

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <main className="flex-1 flex flex-col relative">
                <Navbar />

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-8">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
