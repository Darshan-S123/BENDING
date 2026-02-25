import React, { useState, useEffect } from 'react';
import { getLoans, formatCurrency, updateLoan, deleteLoan } from '../utils/loanStore';
import { Search, User, Phone, Wallet, Calendar, Tag, Edit2, Save, X, Trash2 } from 'lucide-react';

const CustomerOverview = () => {
    const [loans, setLoans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editModal, setEditModal] = useState(null);
    const [editForm, setEditForm] = useState({ customerName: '', phone: '' });

    useEffect(() => {
        setLoans(getLoans());
    }, []);

    const handleEdit = (loan) => {
        setEditModal(loan);
        setEditForm({ customerName: loan.customerName, phone: loan.phone });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this loan record? This action cannot be undone.")) {
            if (deleteLoan(id)) {
                setLoans(getLoans());
            }
        }
    };

    const handleSave = () => {
        if (updateLoan(editModal.id, editForm)) {
            setEditModal(null);
            setLoans(getLoans());
        }
    };

    const filteredLoans = loans.filter(loan =>
        loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.phone.includes(searchTerm)
    );

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>SS FINANCE - Customer Overview</h2>
                <div className="glass search-bar">
                    <Search size={18} color="var(--muted-foreground)" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="customer-grid">
                {filteredLoans.length > 0 ? (
                    filteredLoans.map(loan => (
                        <div key={loan.id} className="glass customer-card">
                            <div className="card-header">
                                <div className="user-icon">
                                    <User size={20} color="var(--accent)" />
                                </div>
                                <div className="user-info">
                                    <h4>{loan.customerName}</h4>
                                    <p><Phone size={12} /> {loan.phone}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto', alignItems: 'center' }}>
                                    <button onClick={() => handleEdit(loan)} className="btn-icon-edit" title="Edit Customer">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(loan.id)} className="btn-icon-delete" title="Delete Loan">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className={`status-badge ${loan.status.toLowerCase()}`}>
                                        {loan.status}
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="info-item">
                                    <span className="label">Principal</span>
                                    <span className="value">{formatCurrency(loan.principalAmount)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Interest ({loan.interestRate}% {loan.interestBasis || 'Monthly'})</span>
                                    <span className="value">{formatCurrency(loan.interest)}</span>
                                </div>
                                <div className="info-item total">
                                    <span className="label">Total Amount</span>
                                    <span className="value">{formatCurrency(loan.totalAmount)}</span>
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="footer-item">
                                    <Calendar size={14} />
                                    <span>Due: {loan.dueDate}</span>
                                </div>
                                <div className="footer-item">
                                    <Tag size={14} />
                                    <span>{loan.interestType}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="glass no-data">
                        <p>No customers found matching your search.</p>
                    </div>
                )}
            </div>

            {editModal && (
                <div className="modal-overlay">
                    <div className="glass modal-content">
                        <h3 style={{ marginBottom: '1.5rem' }}>Edit Customer</h3>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Customer Name</label>
                            <input
                                type="text"
                                value={editForm.customerName}
                                onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={handleSave} className="btn-primary" style={{ flex: 1 }}><Save size={18} /> Save</button>
                            <button onClick={() => setEditModal(null)} className="btn-secondary" style={{ flex: 1 }}><X size={18} /> Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .search-bar {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.6rem 1rem;
                    border-radius: 0.75rem;
                    width: 320px;
                }
                .search-bar input {
                    background: transparent;
                    border: none;
                    color: var(--foreground);
                    outline: none;
                    width: 100%;
                }
                .customer-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }
                .customer-card {
                    padding: 1.5rem;
                    border-radius: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    transition: transform 0.2s ease;
                }
                .customer-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--accent);
                }
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    position: relative;
                }
                .user-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(202, 138, 4, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .user-info h4 {
                    margin: 0;
                    font-size: 1.1rem;
                }
                .user-info p {
                    margin: 0;
                    font-size: 0.8rem;
                    color: var(--muted-foreground);
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .status-badge {
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size: 0.7rem;
                    padding: 0.25rem 0.6rem;
                    border-radius: 2rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .status-badge.pending { background: rgba(202, 138, 4, 0.2); color: var(--accent); }
                .status-badge.completed { background: rgba(16, 185, 129, 0.2); color: var(--success); }
                .status-badge.overdue { background: rgba(239, 68, 68, 0.2); color: var(--danger); }

                .card-body {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .info-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.9rem;
                }
                .info-item.total {
                    margin-top: 0.5rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid var(--card-border);
                    font-weight: 700;
                    color: var(--accent);
                }
                .label { color: var(--muted-foreground); }

                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: var(--muted-foreground);
                    border-top: 1px dashed var(--card-border);
                    padding-top: 1rem;
                }
                .footer-item {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .no-data {
                    grid-column: 1 / -1;
                    padding: 3rem;
                    text-align: center;
                    color: var(--muted-foreground);
                    border-radius: 1rem;
                }
                .btn-icon-edit {
                    background: rgba(202, 138, 4, 0.1);
                    color: var(--accent);
                    border: 1px solid rgba(202, 138, 4, 0.2);
                    width: 32px;
                    height: 32px;
                    border-radius: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-icon-edit:hover {
                    background: var(--accent);
                    color: white;
                }
                .btn-icon-delete {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    width: 32px;
                    height: 32px;
                    border-radius: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-icon-delete:hover {
                    background: #ef4444;
                    color: white;
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
                    max-width: 400px;
                    padding: 2rem;
                    border-radius: 1.5rem;
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
                .btn-primary {
                    background: var(--accent);
                    color: var(--accent-foreground);
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    border: none;
                }
                .btn-secondary {
                    background: var(--muted);
                    color: var(--foreground);
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default CustomerOverview;
