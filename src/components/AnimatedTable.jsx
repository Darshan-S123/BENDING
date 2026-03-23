import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { Inbox } from 'lucide-react';

const AnimatedTable = ({ headers, data, renderRow, className = "", emptyMessage = "No records found" }) => {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className={`overflow-x-auto w-full ${className}`}
        >
            <table className="w-full border-collapse">
                <thead className="bg-white/5 border-y border-border">
                    <tr>
                        {headers.map((header, i) => (
                            <th
                                key={i}
                                className="px-6 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.length > 0 ? data.map((item, index) => (
                        <motion.tr
                            key={item.id || index}
                            variants={fadeInUp}
                            className="group hover:bg-white/[0.02] transition-colors"
                        >
                            {Object.values(renderRow(item)).map((cell, idx) => (
                                <td key={idx} className="px-6 py-4 text-sm font-bold text-text-main">
                                    {cell}
                                </td>
                            ))}
                        </motion.tr>
                    )) : (
                        <tr>
                            <td colSpan={headers.length} className="px-6 py-20 text-center">
                                <div className="flex flex-col items-center gap-3 text-text-muted/40">
                                    <Inbox size={36} />
                                    <span className="text-xs font-black uppercase tracking-widest">{emptyMessage}</span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </motion.div>
    );
};

export default AnimatedTable;
