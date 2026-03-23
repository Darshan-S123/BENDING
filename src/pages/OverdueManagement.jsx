import React, { useState, useEffect } from 'react';
import { getLoans, saveLoan, updateLoan, formatCurrency, calculateInterest, addToLedger } from '../utils/loanStore';
import { AlertCircle, ArrowRightCircle, Plus, ShieldAlert, History, TrendingUp, ShieldX, Zap } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import Counter from '../components/Counter';

const OverdueManagement = () => {
    const [overdueLoans, setOverdueLoans] = useState([]);

    useEffect(() => {
        const fetchOverdue = async () => {
            const allLoans = await getLoans();
            const today = new Date();
            const overdues = allLoans.filter(l => new Date(l.dueDate) < today && l.status === 'Pending');
            setOverdueLoans(overdues);
        };
        fetchOverdue();
    }, []);

    const handleCarryForward = async (loan) => {
        const penalty = parseFloat(loan.principalAmount) * 0.05; // 5% penalty
        const newPrincipal = parseFloat(loan.principalAmount) + penalty;

        const newDueDate = new Date(loan.dueDate);
        newDueDate.setMonth(newDueDate.getMonth() + 1);
        const newDueDateStr = newDueDate.toISOString().split('T')[0];

        const newInterest = calculateInterest(
            newPrincipal,
            loan.interestRate,
            loan.interestType,
            loan.dueDate,
            newDueDateStr,
            loan.interestBasis
        );

        // Mark old loan as Overdue
        await updateLoan(loan.id, { status: 'Overdue' });

        // Create new carried-forward loan
        const forwardLoan = {
            ...loan,
            id: Date.now(),
            principalAmount: newPrincipal.toFixed(2),
            interest: newInterest.toFixed(2),
            totalAmount: (newPrincipal + newInterest).toFixed(2),
            borrowDate: loan.dueDate,
            dueDate: newDueDateStr,
            settlementMonth: newDueDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
            status: 'Pending'
        };
        await saveLoan(forwardLoan);

        // Add audit trail entry
        await addToLedger({
            customerName: loan.customerName,
            amount: penalty,
            type: 'Carry Forward',
            category: 'Penalty',
            status: 'Completed'
        });

        const allLoans = await getLoans();
        const today = new Date();
        setOverdueLoans(allLoans.filter(l => new Date(l.dueDate) < today && l.status === 'Pending'));
        alert(`Risk Mitigated: Loan carried forward to ${forwardLoan.settlementMonth} with ₹${penalty.toFixed(2)} penalty.`);
    };

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-text-main tracking-tightest text-danger">Risk Management</h1>
                    <p className="text-text-muted text-sm font-bold flex items-center gap-2 mt-2 uppercase tracking-widest">
                        <ShieldAlert size={14} className="text-danger" />
                        Delinquency Recovery Protocol
                    </p>
                </div>
                <div className="bg-danger/10 border border-danger/20 px-6 py-2.5 rounded-2xl">
                    <span className="text-[10px] font-black text-danger uppercase tracking-widest flex items-center gap-2">
                        <Zap size={14} /> Critical Exposure: <Counter value={overdueLoans.reduce((acc, l) => acc + parseFloat(l.totalAmount), 0)} prefix="₹" />
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                {overdueLoans.length > 0 ? overdueLoans.map((loan, index) => (
                    <AnimatedCard key={loan.id} delay={index * 0.05} noHover className="p-0 overflow-hidden border-l-4 border-l-danger bg-danger/[0.02]">
                        <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-danger/10 rounded-2xl text-danger animate-pulse">
                                    <AlertCircle size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-text-main tracking-tight mb-1">{loan.customerName}</h3>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] text-text-muted font-black uppercase tracking-widest flex items-center gap-2">
                                            <History size={12} /> Matured: {new Date(loan.dueDate).toLocaleDateString()}
                                        </span>
                                        <span className="px-2 py-0.5 bg-danger/20 text-danger rounded-lg text-[10px] font-black uppercase tracking-widest">Immediate Recovery</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-12">
                                <div className="text-left sm:text-right">
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Total Outstanding</div>
                                    <div className="text-3xl font-black text-danger tracking-tighter">
                                        <Counter value={loan.totalAmount} prefix="₹" />
                                    </div>
                                </div>
                                <AnimatedButton
                                    variant="danger"
                                    icon={TrendingUp}
                                    onClick={() => handleCarryForward(loan)}
                                    className="shadow-xl shadow-danger/20 px-8"
                                >
                                    CARRY FORWARD (+5%)
                                </AnimatedButton>
                            </div>
                        </div>
                    </AnimatedCard>
                )) : (
                    <div className="py-32 flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center text-success mb-8 border border-success/5">
                            <ShieldAlert size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-text-main mb-2 tracking-tight">Zero Delinquency</h3>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-widest max-w-xs text-center leading-relaxed">
                            No past-due accounts detected. Your lending portfolio is currently in optimal health.
                        </p>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default OverdueManagement;
