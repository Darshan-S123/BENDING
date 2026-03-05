import React, { useState, useEffect } from 'react';
import { getLoans, formatCurrency } from '../utils/loanStore';
import { TrendingUp, Users, Wallet, IndianRupee, ArrowUpRight, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import PageWrapper from '../components/PageWrapper';
import AnimatedCard from '../components/AnimatedCard';
import Counter from '../components/Counter';
import ChartCard from '../components/ChartCard';
import AnimatedTable from '../components/AnimatedTable';

const Dashboard = () => {
    const [loans, setLoans] = useState([]);
    const [stats, setStats] = useState({
        totalPrincipal: 0,
        totalInterest: 0,
        activeLoans: 0,
        overdueLoans: 0
    });

    useEffect(() => {
        const data = getLoans();
        setLoans(data);

        const calculated = data.reduce((acc, loan) => {
            acc.totalPrincipal += parseFloat(loan.principalAmount || 0);
            acc.totalInterest += parseFloat(loan.interest || 0);
            if (loan.status === 'Pending') acc.activeLoans++;
            if (loan.status === 'Overdue') acc.overdueLoans++;
            return acc;
        }, { totalPrincipal: 0, totalInterest: 0, activeLoans: 0, overdueLoans: 0 });

        setStats(calculated);
    }, []);

    const collectionData = [
        { month: 'Jan', revenue: 4200, interest: 2100 },
        { month: 'Feb', revenue: 3800, interest: 1900 },
        { month: 'Mar', revenue: 5600, interest: 2800 },
        { month: 'Apr', revenue: 4900, interest: 2450 },
        { month: 'May', revenue: 7200, interest: 3600 },
        { month: 'Jun', revenue: 8500, interest: 4250 },
    ];

    const profitData = [
        { month: 'Mar', profit: 2800 },
        { month: 'Apr', profit: 2450 },
        { month: 'May', profit: 3600 },
        { month: 'Jun', profit: 4250 },
    ];

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-text-main tracking-tight">Fintech Terminal</h1>
                    <p className="text-text-muted text-sm font-bold flex items-center gap-2 mt-1 uppercase tracking-widest">
                        <Activity size={14} className="text-accent" />
                        Live Liquidity Monitor
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest border border-accent/20 hover:bg-accent hover:text-primary transition-all">
                        Export Ledger
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Liquid Assets"
                    value={stats.totalPrincipal}
                    prefix="₹"
                    trend="+12.5%"
                    icon={Wallet}
                    delay={0.1}
                />
                <StatCard
                    title="Revenue Yield"
                    value={stats.totalInterest}
                    prefix="₹"
                    trend="+8.2%"
                    icon={TrendingUp}
                    delay={0.2}
                    positive={false}
                />
                <StatCard
                    title="Active Deals"
                    value={stats.activeLoans}
                    trend="+4"
                    icon={Users}
                    delay={0.3}
                />
                <StatCard
                    title="Risk Exposure"
                    value={stats.overdueLoans}
                    trend="-2"
                    icon={PieChartIcon}
                    delay={0.4}
                    isRisk
                    isRiskActive={stats.overdueLoans > 0}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <ChartCard title="Capital Velocity" subtitle="Monthly Revenue vs Interest" icon={BarChart3}>
                    <AreaChart data={collectionData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                        <Area type="monotone" dataKey="interest" stroke="#2563EB" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                </ChartCard>

                <ChartCard title="Yield Expansion" subtitle="Profit Accrual Trends" icon={TrendingUp}>
                    <BarChart data={profitData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                        <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
                            {profitData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === profitData.length - 1 ? '#10B981' : '#1e293b'} stroke={index === profitData.length - 1 ? 'none' : '#334155'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartCard>
            </div>

            {/* Recent Table */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-text-main tracking-tight">Recent Disbursements</h3>
                    <button className="text-accent text-xs font-black uppercase tracking-widest hover:underline px-4 py-2 bg-accent/5 rounded-lg transition-all">
                        View All Records
                    </button>
                </div>
                <AnimatedCard className="p-0 overflow-hidden" noHover>
                    <AnimatedTable
                        headers={['Customer', 'Principal', 'Interest', 'Maturity', 'Status']}
                        data={loans.slice(0, 5)}
                        renderRow={(loan) => ({
                            customer: (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] uppercase font-black">{loan.customerName[0]}</div>
                                    <span className="truncate max-w-[150px]">{loan.customerName}</span>
                                </div>
                            ),
                            principal: `₹${loan.principalAmount}`,
                            interest: (
                                <span className="text-accent">₹{loan.interest}</span>
                            ),
                            maturity: loan.dueDate,
                            status: (
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${loan.status === 'Paid' ? 'bg-success/20 text-success' :
                                    loan.status === 'Overdue' ? 'bg-danger/20 text-danger' :
                                        'bg-accent-secondary/20 text-accent-secondary'
                                    }`}>
                                    {loan.status}
                                </span>
                            )
                        })}
                    />
                </AnimatedCard>
            </div>
        </PageWrapper>
    );
};

const StatCard = ({ title, value, prefix = "", trend, icon: Icon, delay, positive = true, isRisk = false, isRiskActive = false }) => (
    <AnimatedCard delay={delay} className="group">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl ${isRisk ? 'bg-danger/10 text-danger' : 'bg-accent/10 text-accent'} group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${isRisk ? 'bg-danger/10 text-danger' :
                positive ? 'bg-success/10 text-success' : 'bg-accent-secondary/10 text-accent-secondary'
                }`}>
                <ArrowUpRight size={12} className={!positive && 'rotate-90'} />
                {trend}
            </div>
        </div>
        <div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{title}</p>
            <div className={`text-3xl font-black ${isRiskActive ? 'text-danger' : 'text-text-main'} tracking-tighter`}>
                <Counter value={value} prefix={prefix} />
            </div>
        </div>
    </AnimatedCard>
);

export default Dashboard;
