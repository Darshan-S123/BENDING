import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoans, formatCurrency, exportLedgerCSV } from '../utils/loanStore';
import { TrendingUp, Users, Wallet, ArrowUpRight, BarChart3, PieChart as PieChartIcon, Activity, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import PageWrapper from '../components/PageWrapper';
import AnimatedCard from '../components/AnimatedCard';
import Counter from '../components/Counter';
import ChartCard from '../components/ChartCard';
import AnimatedTable from '../components/AnimatedTable';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);
    const [stats, setStats] = useState({
        totalPrincipal: 0,
        totalInterest: 0,
        activeLoans: 0,
        overdueLoans: 0
    });

    const [collectionData, setCollectionData] = useState([]);
    const [profitData, setProfitData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getLoans();
            setLoans(data);

            const calculated = data.reduce((acc, loan) => {
                if (loan.status === 'Draft') return acc;
                acc.totalPrincipal += parseFloat(loan.principalAmount || 0);
                acc.totalInterest += parseFloat(loan.interest || 0);
                if (loan.status === 'Pending') acc.activeLoans++;
                if (loan.status === 'Overdue') acc.overdueLoans++;
                return acc;
            }, { totalPrincipal: 0, totalInterest: 0, activeLoans: 0, overdueLoans: 0 });

            setStats(calculated);

            // Build chart data from real loans grouped by settlementMonth
            const monthlyMap = {};
            data.forEach(loan => {
                if (loan.status === 'Draft' || !loan.settlementMonth) return;
                const m = loan.settlementMonth;
                if (!monthlyMap[m]) monthlyMap[m] = { month: m, revenue: 0, interest: 0, profit: 0 };
                monthlyMap[m].revenue += parseFloat(loan.principalAmount || 0);
                monthlyMap[m].interest += parseFloat(loan.interest || 0);
                if (loan.status === 'Completed') {
                    monthlyMap[m].profit += parseFloat(loan.interest || 0);
                }
            });

            // Sort by date and take the last 6 months with data
            const sortedMonths = Object.values(monthlyMap).sort((a, b) => {
                return new Date(a.month) - new Date(b.month);
            });
            const last6 = sortedMonths.slice(-6).map(m => ({
                ...m,
                month: m.month.split(' ')[0].slice(0, 3), // "January 2025" -> "Jan"
            }));

            setCollectionData(last6);
            setProfitData(last6.filter(m => m.profit > 0).map(({ month, profit }) => ({ month, profit })));
        };
        fetchData();
    }, []);

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-text-main tracking-tight">Fintech Terminal</h1>
                    <p className="text-text-muted text-xs font-semibold flex items-center gap-2 mt-2 uppercase tracking-widest">
                        <Activity size={14} className="text-accent" />
                        Live Liquidity Monitor
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => exportLedgerCSV()}
                        className="flex items-center gap-2 px-5 py-2 bg-background text-text-main rounded text-xs font-semibold uppercase tracking-wider border border-border hover:bg-border transition-all"
                    >
                        <Download size={14} />
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
                                <stop offset="5%" stopColor="#b89052" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#b89052" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ebeceb" vertical={false} />
                        <XAxis dataKey="month" stroke="#737373" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#737373" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ebeceb', borderRadius: '4px', boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.05)' }}
                            itemStyle={{ color: '#111111', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#b89052" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                        <Area type="monotone" dataKey="interest" stroke="#111111" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                </ChartCard>

                <ChartCard title="Yield Expansion" subtitle="Profit Accrual Trends" icon={TrendingUp}>
                    <BarChart data={profitData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ebeceb" vertical={false} />
                        <XAxis dataKey="month" stroke="#737373" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#737373" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: '#fcfbf9' }}
                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ebeceb', borderRadius: '4px', boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.05)' }}
                        />
                        <Bar dataKey="profit" radius={[2, 2, 0, 0]}>
                            {profitData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === profitData.length - 1 ? '#b89052' : '#ebeceb'} stroke="none" />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartCard>
            </div>

            {/* Recent Table */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-serif font-semibold text-text-main tracking-tight">Recent Disbursements</h3>
                    <button
                        onClick={() => navigate('/loans')}
                        className="text-text-main text-xs font-semibold uppercase tracking-wider hover:bg-border px-4 py-2 bg-background border border-border rounded transition-all"
                    >
                        View All Records
                    </button>
                </div>
                <AnimatedCard className="p-0 overflow-hidden" noHover>
                    <AnimatedTable
                        headers={['Customer', 'Principal', 'Interest', 'Maturity', 'Status']}
                        data={loans.filter(l => l.status !== 'Draft').slice(0, 5)}
                        emptyMessage="No disbursements yet"
                        renderRow={(loan) => ({
                            customer: (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center text-[10px] uppercase font-bold text-text-main">{(loan.customerName || '?')[0]}</div>
                                    <span className="truncate max-w-[150px] font-medium text-text-main">{loan.customerName}</span>
                                </div>
                            ),
                            principal: `₹${loan.principalAmount}`,
                            interest: (
                                <span className="text-accent">₹{loan.interest}</span>
                            ),
                            maturity: loan.dueDate,
                            status: (
                                <span className={`px-2 py-1 rounded border text-[10px] font-semibold uppercase tracking-wider ${loan.status === 'Completed' ? 'bg-success/10 text-success border-success/20' :
                                    loan.status === 'Overdue' ? 'bg-danger/10 text-danger border-danger/20' :
                                        'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20'
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
            <div className={`p-3 rounded border ${isRisk ? 'bg-danger/5 text-danger border-danger/20' : 'bg-transparent text-accent border-border'} group-hover:scale-105 transition-transform`}>
                <Icon size={20} />
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded border ${isRisk ? 'bg-danger/10 text-danger border-danger/20' :
                positive ? 'bg-success/10 text-success border-success/20' : 'bg-background text-text-main border-border'}`}>
                <ArrowUpRight size={12} className={!positive && 'rotate-90'} />
                {trend}
            </div>
        </div>
        <div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">{title}</p>
            <div className={`text-2xl font-bold ${isRiskActive ? 'text-danger' : 'text-text-main'} tracking-tight`}>
                <Counter value={value} prefix={prefix} />
            </div>
        </div>
    </AnimatedCard>
);

export default Dashboard;
