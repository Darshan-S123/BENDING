import React, { useState, useEffect } from 'react';
import { getLoans, formatCurrency, updateLoan, calculateInterest, deleteLoan, addToLedger } from '../utils/loanStore';
import { generateSettlementPDF } from '../utils/pdfGenerator';
import { FileDown, Search, Trash2, CheckCircle, PieChart, Edit3, X, CalendarClock, Users, Wallet, TrendingUp, IndianRupee } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedTable from '../components/AnimatedTable';
import Counter from '../components/Counter';

const MonthlySettlement = () => {
    const [loans, setLoans] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    );
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [settleModal, setSettleModal] = useState(null);
    const [settleDate, setSettleDate] = useState(new Date().toISOString().split('T')[0]);
    const [settleMode, setSettleMode] = useState('Full'); // Full, Partial, Custom
    const [customAmount, setCustomAmount] = useState('');

    useEffect(() => {
        const allLoans = getLoans();
        setLoans(allLoans);
        const filtered = allLoans.filter(l => l.settlementMonth === selectedMonth && l.status === 'Pending');
        setFilteredLoans(filtered);
    }, [selectedMonth]);

    const handleDownload = () => {
        if (filteredLoans.length === 0) {
            alert("No pending loans for this month.");
            return;
        }
        generateSettlementPDF(selectedMonth, filteredLoans);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this loan record? This cannot be undone.")) {
            if (deleteLoan(id)) {
                const allLoans = getLoans();
                setLoans(allLoans);
                setFilteredLoans(allLoans.filter(l => l.settlementMonth === selectedMonth && l.status === 'Pending'));
            }
        }
    };

    const confirmSettlement = () => {
        const calculatedInt = calculateInterest(
            settleModal.principalAmount,
            settleModal.interestRate,
            settleModal.interestType,
            settleModal.borrowDate,
            settleDate,
            settleModal.interestBasis
        );

        let updatedData = {};

        if (settleMode === 'Full') {
            updatedData = {
                interest: calculatedInt.toFixed(2),
                totalAmount: (parseFloat(settleModal.principalAmount) + calculatedInt).toFixed(2),
                status: 'Completed',
                settledDate: settleDate
            };
        } else if (settleMode === 'Partial') {
            const paid = parseFloat(customAmount) || 0;
            const totalDue = parseFloat(settleModal.principalAmount) + calculatedInt;
            const newPrincipal = totalDue - paid;

            updatedData = {
                principalAmount: newPrincipal.toFixed(2),
                interest: (newPrincipal * (parseFloat(settleModal.interestRate) / 100)).toFixed(2),
                totalAmount: (newPrincipal * (1 + parseFloat(settleModal.interestRate) / 100)).toFixed(2),
                borrowDate: settleDate,
                status: 'Pending'
            };
        } else if (settleMode === 'Custom') {
            const finalAmount = parseFloat(customAmount) || 0;
            updatedData = {
                totalAmount: finalAmount.toFixed(2),
                status: 'Completed',
                settledDate: settleDate,
                customSettlement: true
            };
        }

        updateLoan(settleModal.id, updatedData);

        // Add to Ledger
        addToLedger({
            customerName: settleModal.customerName,
            amount: settleMode === 'Full' ? (parseFloat(settleModal.principalAmount) + calculatedInt) : (parseFloat(customAmount) || 0),
            type: settleMode === 'Partial' ? 'Partial Settlement' : 'Final Settlement',
            category: 'Settlement',
            status: 'Completed'
        });

        setSettleModal(null);
        setCustomAmount('');

        const allLoans = getLoans();
        setLoans(allLoans);
        setFilteredLoans(allLoans.filter(l => l.settlementMonth === selectedMonth && l.status === 'Pending'));
    };

    const totals = filteredLoans.reduce((acc, l) => {
        acc.principal += parseFloat(l.principalAmount);
        acc.interest += parseFloat(l.interest);
        acc.total += parseFloat(l.totalAmount);
        return acc;
    }, { principal: 0, interest: 0, total: 0 });

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-text-main tracking-tightest">Settlement Hub</h1>
                    <p className="text-text-muted text-sm font-bold flex items-center gap-2 mt-2 uppercase tracking-widest">
                        <CalendarClock size={14} className="text-accent" />
                        Collection Phase: {selectedMonth}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/5 rounded-xl px-4 flex items-center gap-3">
                        <Search size={18} className="text-text-muted" />
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-transparent border-none text-text-main font-bold text-sm py-2.5 outline-none cursor-pointer"
                        >
                            {Array.from({ length: 12 }).map((_, i) => {
                                const d = new Date();
                                d.setMonth(d.getMonth() + i - 3);
                                const m = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
                                return <option key={m} value={m} className="bg-primary">{m}</option>;
                            })}
                        </select>
                    </div>
                    <AnimatedButton icon={FileDown} onClick={handleDownload}>
                        Report Ledger
                    </AnimatedButton>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <MiniStat title="Total Members" value={filteredLoans.length} icon={Users} delay={0.1} />
                <MiniStat title="Principal Pool" value={totals.principal} prefix="₹" icon={Wallet} delay={0.2} />
                <MiniStat title="Interest Accrued" value={totals.interest} prefix="₹" icon={TrendingUp} delay={0.3} />
                <MiniStat title="Total Expected" value={totals.total} prefix="₹" icon={IndianRupee} delay={0.4} highlight />
            </div>

            {/* Main Table Container */}
            <AnimatedCard noHover className="p-0 overflow-hidden" delay={0.5}>
                <AnimatedTable
                    headers={['Customer', 'Exposure', 'Interest', 'Terminal Value', 'Due Date', 'Actions']}
                    data={filteredLoans}
                    renderRow={(loan) => ({
                        customer: (
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] uppercase font-black">{loan.customerName?.[0]}</div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-text-main leading-tight">{loan.customerName}</span>
                                    <span className="text-[10px] text-text-muted font-bold tracking-tighter">{loan.phone}</span>
                                </div>
                            </div>
                        ),
                        exposure: `₹${loan.principalAmount}`,
                        interest: (
                            <span className="text-accent">₹${loan.interest}</span>
                        ),
                        terminal: (
                            <span className="font-black text-text-main">₹${loan.totalAmount}</span>
                        ),
                        dueDate: (
                            <span className="text-text-muted font-medium">{new Date(loan.dueDate).toLocaleDateString()}</span>
                        ),
                        actions: (
                            <div className="flex justify-end items-center gap-3">
                                <AnimatedButton
                                    size="sm"
                                    className="px-4 py-1.5"
                                    onClick={() => {
                                        setSettleModal(loan);
                                        setSettleDate(new Date().toISOString().split('T')[0]);
                                        setSettleMode('Full');
                                    }}
                                >
                                    Settle
                                </AnimatedButton>
                                <button
                                    onClick={() => handleDelete(loan.id)}
                                    className="p-2 text-text-muted hover:text-danger transition-colors group-hover:opacity-100 opacity-0"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )
                    })}
                />
            </AnimatedCard>

            {/* Settle Modal */}
            {settleModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <AnimatedCard className="w-full max-w-[550px] relative p-8" noHover>
                        <button onClick={() => setSettleModal(null)} className="absolute top-6 right-6 p-2 text-text-muted hover:text-text-main rounded-xl hover:bg-white/5 transition-all">
                            <X size={20} />
                        </button>

                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-text-main tracking-tight">Finalize Settlement</h3>
                            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-1">Beneficiary: {settleModal.customerName}</p>
                        </div>

                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 mb-8">
                            {['Full', 'Partial', 'Custom'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setSettleMode(mode)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${settleMode === mode ? 'bg-accent text-primary shadow-lg shadow-accent/20' : 'text-text-muted hover:text-text-main'
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Effective Date</label>
                                    <input
                                        type="date"
                                        value={settleDate}
                                        onChange={(e) => setSettleDate(e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-accent/30 outline-none font-bold"
                                    />
                                </div>

                                {['Partial', 'Custom'].includes(settleMode) && (
                                    <div className="fade-in">
                                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Liquidated Amount (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-accent/30 outline-none font-bold"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="bg-accent/[0.03] rounded-2xl p-6 border border-accent/10">
                                <SummaryRow label="Injected Principal" value={formatCurrency(settleModal.principalAmount)} />
                                <SummaryRow label="Calculated Accrual" value={formatCurrency(calculateInterest(settleModal.principalAmount, settleModal.interestRate, settleModal.interestType, settleModal.borrowDate, settleDate, settleModal.interestBasis))} active />
                                <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-end">
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Aggregate Terminal</span>
                                    <span className="text-2xl font-black text-text-main tracking-tight">
                                        {formatCurrency(parseFloat(settleModal.principalAmount) + calculateInterest(settleModal.principalAmount, settleModal.interestRate, settleModal.interestType, settleModal.borrowDate, settleDate, settleModal.interestBasis))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <AnimatedButton fullWidth onClick={confirmSettlement}>
                                {settleMode === 'Partial' ? 'Liquidate Portion' : 'Authorize Full Exit'}
                            </AnimatedButton>
                        </div>
                    </AnimatedCard>
                </div>
            )}
        </PageWrapper>
    );
};

const MiniStat = ({ title, value, prefix = "", icon: Icon, delay, highlight = false }) => (
    <AnimatedCard delay={delay} className={`${highlight ? 'bg-accent text-primary' : 'bg-white/5'}`}>
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${highlight ? 'bg-black/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className={`text-[9px] font-black uppercase tracking-widest ${highlight ? 'text-primary/70' : 'text-text-muted'}`}>{title}</p>
                <div className={`text-xl font-black tracking-tight ${highlight ? 'text-primary' : 'text-text-main'}`}>
                    <Counter value={value} prefix={prefix} />
                </div>
            </div>
        </div>
    </AnimatedCard>
);

const SummaryRow = ({ label, value, active = false }) => (
    <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</span>
        <span className={`text-sm font-bold ${active ? 'text-accent' : 'text-text-main'}`}>{value}</span>
    </div>
);

export default MonthlySettlement;
