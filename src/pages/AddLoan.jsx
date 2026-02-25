import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoans, saveLoans, calculateInterest } from '../utils/loanStore';
import { Save, X } from 'lucide-react';

const AddLoan = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        principalAmount: '',
        interestRate: '2',
        interestType: 'Simple',
        interestBasis: 'Monthly',
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        status: 'Pending'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const loans = getLoans();
        const interest = calculateInterest(
            formData.principalAmount,
            formData.interestRate,
            formData.interestType,
            formData.borrowDate,
            formData.dueDate,
            formData.interestBasis
        );

        const newLoan = {
            ...formData,
            id: Date.now(),
            interest: interest.toFixed(2),
            totalAmount: (parseFloat(formData.principalAmount) + interest).toFixed(2),
            settlementMonth: new Date(formData.dueDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        };

        saveLoans([...loans, newLoan]);
        navigate('/');
    };

    return (
        <div className="fade-in" style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>SS FINANCE - New Loan</h2>

            <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Customer Name</label>
                        <input type="text" name="customerName" required value={formData.customerName} onChange={handleChange} placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+91 XXXX XXXX" />
                    </div>
                    <div className="form-group">
                        <label>Principal Amount (₹)</label>
                        <input type="number" name="principalAmount" required value={formData.principalAmount} onChange={handleChange} placeholder="10000" />
                    </div>
                    <div className="form-group">
                        <label>Interest Rate (% Monthly)</label>
                        <input type="number" name="interestRate" required value={formData.interestRate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Interest Type</label>
                        <select name="interestType" value={formData.interestType} onChange={handleChange}>
                            <option value="Simple">Simple Interest</option>
                            <option value="Compound">Compound</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Interest Basis</label>
                        <select name="interestBasis" value={formData.interestBasis} onChange={handleChange}>
                            <option value="Weekly">Per Week</option>
                            <option value="Monthly">Per Month</option>
                            <option value="Yearly">Per Year</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Borrow Date</label>
                        <input type="date" name="borrowDate" required value={formData.borrowDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Due Date</label>
                        <input type="date" name="dueDate" required value={formData.dueDate} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="submit" className="btn-primary"><Save size={18} /> Disburse Loan</button>
                    <button type="button" className="btn-secondary" onClick={() => navigate('/')}><X size={18} /> Cancel</button>
                </div>
            </form>

            <style>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        label {
          font-size: 0.875rem;
          color: var(--muted-foreground);
          font-weight: 500;
        }
        input, select {
          background: var(--secondary);
          border: 1px solid var(--card-border);
          color: var(--foreground);
          padding: 0.75rem;
          border-radius: 0.5rem;
          outline: none;
        }
        input:focus {
          border-color: var(--accent);
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
        }
        .btn-secondary {
          background: var(--muted);
          color: var(--foreground);
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
        </div>
    );
};

export default AddLoan;
