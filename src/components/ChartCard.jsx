import React from 'react';
import { ResponsiveContainer } from 'recharts';
import AnimatedCard from './AnimatedCard';

const ChartCard = ({ title, subtitle, children, icon: Icon, className = "" }) => {
    return (
        <AnimatedCard className={`flex flex-col h-[400px] ${className}`} noHover delay={0.2}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-serif font-semibold text-text-main tracking-tight">{title}</h3>
                    {subtitle && <p className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">{subtitle}</p>}
                </div>
                {Icon && (
                    <div className="p-2.5 bg-transparent text-accent border border-border rounded shadow-sm">
                        <Icon size={20} />
                    </div>
                )}
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </AnimatedCard>
    );
};

export default ChartCard;
