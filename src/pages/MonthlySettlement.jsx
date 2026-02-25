import React, { useState, useEffect } from 'react';
import { getLoans, formatCurrency, updateLoan, calculateInterest, deleteLoan } from '../utils/loanStore';
import { generateSettlementPDF } from '../utils/pdfGenerator';
import { FileDown, Search, Trash2, CheckCircle, PieChart, Edit3 } from 'lucide-react';

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
                borrowDate: settleDate, // New cycle starts from settlement date
                status: 'Pending'
            };
            alert(`Partial payment of ${formatCurrency(paid)} received. Remaining balance: ${formatCurrency(newPrincipal)}`);
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
        setSettleModal(null);
        setCustomAmount('');

        // Refresh
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
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>SS FINANCE - Monthly Settlements</h2>
                    <p style={{ color: 'var(--muted-foreground)' }}>Manage collections for the current month</p>
                </div>
                <button onClick={handleDownload} className="btn-primary" style={{ background: '#10b981' }}>
                    <FileDown size={18} /> Generate Monthly PDF
                </button>
            </div>

            {settleModal && (
                <div className="modal-overlay">
                    <div className="glass modal-content" style={{ maxWidth: '500px' }}>
                        <h3>Settlement - {settleModal.customerName}</h3>

                        <div className="mode-selector" style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0' }}>
                            <button
                                onClick={() => setSettleMode('Full')}
                                className={`mode-btn ${settleMode === 'Full' ? 'active' : ''}`}
                            >
                                <CheckCircle size={14} /> Full
                            </button>
                            <button
                                onClick={() => setSettleMode('Partial')}
                                className={`mode-btn ${settleMode === 'Partial' ? 'active' : ''}`}
                            >
                                <PieChart size={14} /> Partial
                            </button>
                            <button
                                onClick={() => setSettleMode('Custom')}
                                className={`mode-btn ${settleMode === 'Custom' ? 'active' : ''}`}
                            >
                                <Edit3 size={14} /> Custom
                            </button>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Settlement Date</label>
                            <input
                                type="date"
                                value={settleDate}
                                onChange={(e) => setSettleDate(e.target.value)}
                            />
                        </div>

                        {settleMode === 'Partial' && (
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label>Amount Paying Now</label>
                                <input
                                    type="number"
                                    placeholder="Enter partial payment amount"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}

                        {settleMode === 'Custom' && (
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label>Custom Final Settlement Amount</label>
                                <input
                                    type="number"
                                    placeholder="Enter agreed total amount"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}

                        <div className="settlement-preview glass" style={{ padding: '1rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                            <div className="preview-row">
                                <span>Principal:</span>
                                <span>{formatCurrency(settleModal.principalAmount)}</span>
                            </div>
                            <div className="preview-row">
                                <span>Interest (Pro-rated):</span>
                                <span style={{ color: 'var(--accent)' }}>
                                    {formatCurrency(calculateInterest(
                                        settleModal.principalAmount,
                                        settleModal.interestRate,
                                        settleModal.interestType,
                                        settleModal.borrowDate,
                                        settleDate,
                                        settleModal.interestBasis
                                    ))}
                                </span>
                            </div>
                            <div className="preview-row total" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--card-border)', fontWeight: '700' }}>
                                <span>{settleMode === 'Partial' ? 'Total Due Now' : 'Total Settlement'}:</span>
                                <span>
                                    {formatCurrency(
                                        parseFloat(settleModal.principalAmount) +
                                        calculateInterest(
                                            settleModal.principalAmount,
                                            settleModal.interestRate,
                                            settleModal.interestType,
                                            settleModal.borrowDate,
                                            settleDate,
                                            settleModal.interestBasis
                                        )
                                    )}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={confirmSettlement} className="btn-primary" style={{ flex: 1, background: '#10b981' }}>
                                {settleMode === 'Partial' ? 'Pay Partial' : 'Confirm Settle'}
                            </button>
                            <button onClick={() => setSettleModal(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Search size={20} color="var(--muted-foreground)" />
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--foreground)', fontSize: '1.125rem', fontWeight: '600' }}
                    >
                        {/* Generating next few months as options */}
                        {Array.from({ length: 6 }).map((_, i) => {
                            const d = new Date();
                            d.setMonth(d.getMonth() + i);
                            const m = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
                            return <option key={m} value={m}>{m}</option>;
                        })}
                    </select>
                </div>
            </div>

            <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Phone</th>
                            <th>Principal</th>
                            <th>Interest</th>
                            <th>Total</th>
                            <th>Due Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLoans.length > 0 ? filteredLoans.map(loan => (
                            <tr key={loan.id}>
                                <td style={{ fontWeight: '600' }}>{loan.customerName}</td>
                                <td>{loan.phone}</td>
                                <td>{formatCurrency(loan.principalAmount)}</td>
                                <td>{formatCurrency(loan.interest)}</td>
                                <td>{formatCurrency(loan.totalAmount)}</td>
                                <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => {
                                                setSettleModal(loan);
                                                setSettleDate(new Date().toISOString().split('T')[0]);
                                                setSettleMode('Full');
                                            }}
                                            className="btn-settle"
                                        >
                                            Settle
                                        </button>
                                        <button onClick={() => handleDelete(loan.id)} className="btn-action-delete">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)' }}>
                                    No records found for {selectedMonth}
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {filteredLoans.length > 0 && (
                        <tfoot style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <tr>
                                <td colSpan="2" style={{ fontWeight: '700' }}>TOTALS</td>
                                <td style={{ fontWeight: '700' }}>{formatCurrency(totals.principal)}</td>
                                <td style={{ fontWeight: '700' }}>{formatCurrency(totals.interest)}</td>
                                <td style={{ fontWeight: '700', color: 'var(--accent)' }}>{formatCurrency(totals.total)}</td>
                                <td colSpan="2"></td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            <style>{`
        .mode-selector {
            background: rgba(255,255,255,0.03);
            padding: 0.25rem;
            border-radius: 0.75rem;
            border: 1px solid var(--card-border);
        }
        .mode-btn {
            flex: 1;
            padding: 0.5rem;
            border-radius: 0.5rem;
            border: none;
            background: transparent;
            color: var(--muted-foreground);
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            transition: all 0.2s;
        }
        .mode-btn.active {
            background: var(--accent);
            color: var(--accent-foreground);
        }
        .btn-action-delete {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
            padding: 0.25rem;
            border-radius: 0.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .btn-action-delete:hover {
            background: #ef4444;
            color: white;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        th, td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--card-border);
        }
        th {
          background: rgba(255,255,255,0.02);
          color: var(--muted-foreground);
          font-weight: 500;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .btn-settle {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-settle:hover {
          background: #10b981;
          color: white;
        }
        .btn-primary {
          background: var(--accent);
          color: var(--accent-foreground);
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          cursor: pointer;
        }
        .btn-secondary {
            background: var(--muted);
            color: var(--foreground);
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
        }
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .modal-content {
            width: 100%;
            max-width: 450px;
            padding: 2rem;
            border-radius: 1.5rem;
        }
        .preview-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            color: var(--muted-foreground);
        }
        .form-group input {
            width: 100%;
            background: var(--secondary);
            border: 1px solid var(--card-border);
            color: var(--foreground);
            padding: 0.75rem;
            border-radius: 0.5rem;
            outline: none;
        }
      `}</style>
        </div>
    );
};

export default MonthlySettlement;
