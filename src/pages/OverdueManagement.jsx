import React, { useState, useEffect } from 'react';
import { getLoans, saveLoans, formatCurrency } from '../utils/loanStore';
import { AlertCircle, ArrowRightCircle, Plus } from 'lucide-react';

const OverdueManagement = () => {
    const [overdueLoans, setOverdueLoans] = useState([]);

    useEffect(() => {
        const allLoans = getLoans();
        const today = new Date();
        const overdues = allLoans.filter(l => new Date(l.dueDate) < today && l.status === 'Pending');
        setOverdueLoans(overdues);
    }, []);

    const handleCarryForward = (loan) => {
        const allLoans = getLoans();
        const penalty = parseFloat(loan.principalAmount) * 0.05; // 5% penalty
        const newPrincipal = parseFloat(loan.principalAmount) + penalty;

        // Create new loan for next month
        const newDueDate = new Date(loan.dueDate);
        newDueDate.setMonth(newDueDate.getMonth() + 1);

        const updatedLoans = allLoans.map(l => {
            if (l.id === loan.id) return { ...l, status: 'Overdue' };
            return l;
        });

        const forwardLoan = {
            ...loan,
            id: Date.now(),
            principalAmount: newPrincipal.toFixed(2),
            interest: (newPrincipal * (parseFloat(loan.interestRate) / 100)).toFixed(2),
            totalAmount: (newPrincipal * (1 + parseFloat(loan.interestRate) / 100)).toFixed(2),
            borrowDate: loan.dueDate,
            dueDate: newDueDate.toISOString().split('T')[0],
            settlementMonth: newDueDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
            status: 'Pending'
        };

        saveLoans([...updatedLoans, forwardLoan]);
        setOverdueLoans(updatedLoans.filter(l => new Date(l.dueDate) < new Date() && l.status === 'Pending'));
        alert(`Loan carried forward to ${forwardLoan.settlementMonth} with ₹${penalty.toFixed(2)} penalty.`);
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>SS FINANCE - Overdue Management</h2>
                    <p style={{ color: 'var(--muted-foreground)' }}>Handle unpaid loans and apply penalties</p>
                </div>
            </div>

            <div className="overdue-list">
                {overdueLoans.length > 0 ? overdueLoans.map(loan => (
                    <div key={loan.id} className="glass overdue-card">
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="overdue-icon"><AlertCircle color="var(--danger)" /></div>
                            <div>
                                <h3 style={{ margin: 0 }}>{loan.customerName}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Due: {new Date(loan.dueDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--danger)' }}>{formatCurrency(loan.totalAmount)}</div>
                            <button onClick={() => handleCarryForward(loan)} className="btn-forward">
                                <ArrowRightCircle size={16} /> Carry Forward (5% Penalty)
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: '1rem' }}>
                        <p style={{ color: '#10b981', fontWeight: '600' }}>Great job! No overdue accounts found.</p>
                    </div>
                )}
            </div>

            <style>{`
        .overdue-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .overdue-card {
          padding: 1.5rem;
          border-radius: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-left: 4px solid var(--danger);
        }
        .overdue-icon {
          background: rgba(239, 68, 68, 0.1);
          padding: 0.75rem;
          border-radius: 0.5rem;
        }
        .btn-forward {
          margin-top: 0.5rem;
          background: var(--secondary);
          color: var(--foreground);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-forward:hover {
          background: var(--muted);
        }
      `}</style>
        </div>
    );
};

export default OverdueManagement;
