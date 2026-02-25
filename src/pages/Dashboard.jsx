import React, { useState, useEffect } from 'react';
import { getLoans, formatCurrency } from '../utils/loanStore';
import { TrendingUp, Users, Wallet, IndianRupee } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [loans, setLoans] = useState([]);
    const [stats, setStats] = useState({
        totalPrincipal: 0,
        totalInterest: 0,
        totalExpected: 0,
        activeMembers: 0
    });

    useEffect(() => {
        const data = getLoans();
        setLoans(data);

        const calculated = data.reduce((acc, loan) => {
            acc.totalPrincipal += parseFloat(loan.principalAmount || 0);
            acc.totalInterest += parseFloat(loan.interest || 0);
            acc.totalExpected += parseFloat(loan.totalAmount || 0);
            if (loan.status === 'Pending') acc.activeMembers++;
            return acc;
        }, { totalPrincipal: 0, totalInterest: 0, totalExpected: 0, activeMembers: 0 });

        setStats(calculated);
    }, []);

    const chartData = [
        { name: 'Jan', expected: 4000, collected: 2400 },
        { name: 'Feb', expected: 3000, collected: 1398 },
        { name: 'Mar', expected: 2000, collected: 9800 },
        { name: 'Apr', expected: 2780, collected: 3908 },
        { name: 'May', expected: 1890, collected: 4800 },
        { name: 'Jun', expected: 2390, collected: 3800 },
    ];

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>SS FINANCE - Executive Dashboard</h2>
                <div style={{ color: 'var(--muted-foreground)' }}>{new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
            </div>

            <div className="stats-grid">
                <StatCard title="Total Principal" value={formatCurrency(stats.totalPrincipal)} icon={<Wallet color="var(--accent)" />} />
                <StatCard title="Total Interest" value={formatCurrency(stats.totalInterest)} icon={<TrendingUp color="#10b981" />} />
                <StatCard title="Expected Collection" value={formatCurrency(stats.totalExpected)} icon={<IndianRupee color="#8b5cf6" />} />
                <StatCard title="Active Members" value={stats.activeMembers} icon={<Users color="#3b82f6" />} />
            </div>

            <div className="glass" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '1rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Monthly Performance Analytics</h3>
                <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Bar dataKey="expected" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .stat-card {
          padding: 1.5rem;
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.025em;
        }
        .stat-title {
          color: var(--muted-foreground);
          font-size: 0.875rem;
          font-weight: 500;
        }
      `}</style>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="glass stat-card">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">{title}</span>
            {icon}
        </div>
        <span className="stat-value">{value}</span>
    </div>
);

export default Dashboard;
