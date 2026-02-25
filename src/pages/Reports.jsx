import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/loanStore';

const Reports = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('bending_reports') || '[]');
        setHistory([...data].reverse());
    }, []);

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear all report history? This action cannot be undone.")) {
            localStorage.removeItem('bending_reports');
            setHistory([]);
        }
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>SS FINANCE - Report History</h2>
                {history.length > 0 && (
                    <button onClick={handleClear} className="btn-clear">
                        Clear All History
                    </button>
                )}
            </div>

            <div className="reports-grid">
                {history.length > 0 ? history.map(report => (
                    <div key={report.id} className="glass report-card">
                        <div className="report-icon">
                            <FileText size={24} color="var(--accent)" />
                        </div>
                        <div className="report-info">
                            <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{report.month}</h3>
                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                Generated on {new Date(report.date).toLocaleDateString()}
                            </p>
                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>MEMBERS</div>
                                    <div style={{ fontWeight: '700' }}>{report.members}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>TOTAL VALUE</div>
                                    <div style={{ fontWeight: '700', color: 'var(--accent)' }}>{formatCurrency(report.total)}</div>
                                </div>
                            </div>
                            <button disabled className="btn-download">
                                <Download size={16} /> Download PDF
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="glass" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', borderRadius: '1rem' }}>
                        <Calendar size={48} color="var(--muted)" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--muted-foreground)' }}>No reports generated yet. Head over to Monthly Settlement to generate your first report.</p>
                    </div>
                )}
            </div>

            <style>{`
        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .report-card {
          padding: 1.5rem;
          border-radius: 1rem;
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }
        .report-icon {
          background: rgba(202, 138, 4, 0.1);
          padding: 1rem;
          border-radius: 0.75rem;
        }
        .report-info {
          flex: 1;
        }
        .btn-download {
          width: 100%;
          background: var(--secondary);
          color: var(--muted-foreground);
          padding: 0.5rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: not-allowed;
        }
        .btn-clear {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-clear:hover {
          background: #ef4444;
          color: white;
        }
      `}</style>
        </div>
    );
};

export default Reports;
