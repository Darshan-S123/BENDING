import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveLoan, deleteLoan, calculateInterest, formatCurrency, addToLedger } from '../utils/loanStore';
import { Save, X, User, Phone, Wallet, Calendar, Percent, Info, ShieldCheck, ArrowRight } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import Counter from '../components/Counter';
import { staggerContainer, fadeInUp } from '../animations/variants';
import { motion } from 'framer-motion';

const AddLoan = () => {
    const navigate = useNavigate();
    const location = useLocation();
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

    useEffect(() => {
        if (location.state?.draft) {
            const draft = location.state.draft;
            setFormData({
                ...draft,
                status: 'Pending' // Reset to pending when resuming
            });
        }
    }, [location.state]);

    const liveInterest = useMemo(() => {
        if (!formData.principalAmount || !formData.dueDate || !formData.borrowDate) return 0;
        return calculateInterest(
            formData.principalAmount, formData.interestRate, formData.interestType,
            formData.borrowDate, formData.dueDate, formData.interestBasis
        );
    }, [formData.principalAmount, formData.interestRate, formData.interestType,
        formData.borrowDate, formData.dueDate, formData.interestBasis]);

    const liveTotal = parseFloat(formData.principalAmount || 0) + liveInterest;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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

        // If resuming a draft, delete the old draft first
        if (location.state?.draft?.id) {
            await deleteLoan(location.state.draft.id);
        }

        await saveLoan(newLoan);
        await addToLedger({
            customerName: formData.customerName,
            amount: formData.principalAmount,
            type: 'Disbursement',
            category: 'Loan',
            status: 'Completed'
        });

        navigate('/');
    };

    const handleSaveDraft = async () => {
        const draftLoan = {
            ...formData,
            id: Date.now(),
            status: 'Draft',
            interest: '0.00',
            totalAmount: formData.principalAmount || '0.00'
        };
        await saveLoan(draftLoan);
        navigate('/drafts');
    };

    return (
        <PageWrapper>
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-12"
            >
                <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-text-main tracking-tightest">Disburse Capital</h1>
                        <p className="text-text-muted text-sm font-bold flex items-center gap-2 mt-2 uppercase tracking-widest">
                            <ShieldCheck size={14} className="text-accent" />
                            Standardized Lending Agreement v4.2
                        </p>
                    </div>
                    <AnimatedButton variant="ghost" icon={X} onClick={() => navigate('/')}>
                        Abort Transaction
                    </AnimatedButton>
                </motion.div>

                <motion.form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Customer & Loan Structure */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.div variants={fadeInUp}>
                            <AnimatedCard noHover className="p-8">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-text-main tracking-tight">Entity Identification</h3>
                                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Customer Personal & Contact Parameters</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputField
                                        label="Customer Legal Name"
                                        icon={User}
                                        name="customerName"
                                        placeholder="Alpha Client Name"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <InputField
                                        label="Contact Uplink"
                                        icon={Phone}
                                        name="phone"
                                        placeholder="+91 XXXX XXXX"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </AnimatedCard>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <AnimatedCard noHover className="p-8">
                                <div className="flex items-center gap-4 mb-10 text-accent-secondary">
                                    <div className="w-12 h-12 bg-accent-secondary/10 rounded-2xl flex items-center justify-center">
                                        <Wallet size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-text-main tracking-tight">Financial Structure</h3>
                                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Principal, Interest & Recurrence Logic</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <InputField
                                        label="Principal (₹)"
                                        type="number"
                                        name="principalAmount"
                                        placeholder="0.00"
                                        value={formData.principalAmount}
                                        onChange={handleChange}
                                        required
                                    />
                                    <InputField
                                        label="Int. Rate (% Yearly)"
                                        type="number"
                                        name="interestRate"
                                        suffix={Percent}
                                        value={formData.interestRate}
                                        onChange={handleChange}
                                        required
                                    />
                                    <SelectField
                                        label="Interest Mode"
                                        name="interestType"
                                        value={formData.interestType}
                                        onChange={handleChange}
                                        options={['Simple', 'Compound']}
                                    />
                                    <SelectField
                                        label="Settlement Cycle"
                                        name="interestBasis"
                                        value={formData.interestBasis}
                                        onChange={handleChange}
                                        options={['Weekly', 'Monthly', 'Yearly']}
                                    />
                                    <InputField
                                        label="Commencement"
                                        type="date"
                                        name="borrowDate"
                                        value={formData.borrowDate}
                                        onChange={handleChange}
                                        required
                                    />
                                    <InputField
                                        label="Maturity"
                                        type="date"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </AnimatedCard>
                        </motion.div>
                    </div>

                    {/* Right: Summary & Actions */}
                    <motion.div variants={fadeInUp} className="lg:col-span-4 space-y-8">
                        <AnimatedCard noHover className="p-8 border-accent/20 bg-accent/[0.02] sticky top-24">
                            <h3 className="text-lg font-black text-text-main mb-8 flex items-center gap-3">
                                <Info size={20} className="text-accent" />
                                Agreement Preview
                            </h3>

                            <div className="space-y-6 mb-12">
                                <SummaryRow label="Principal Injection" value={formData.principalAmount ? `₹${formData.principalAmount}` : '₹0'} />
                                <SummaryRow label="Interest Accrual" value={liveInterest > 0 ? `₹${liveInterest.toFixed(2)}` : '—'} />
                                <SummaryRow label="Interest Config" value={`${formData.interestRate}% ${formData.interestBasis} (${formData.interestType})`} active />

                                <div className="pt-6 border-t border-border">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Expected Terminal Value</span>
                                        <div className="text-3xl font-black text-accent tracking-tighter">
                                            <Counter value={liveTotal} prefix="₹" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <AnimatedButton type="submit" fullWidth icon={Save}>
                                    Finalize & Disburse
                                </AnimatedButton>
                                <AnimatedButton variant="secondary" fullWidth onClick={handleSaveDraft}>
                                    Save as Draft
                                </AnimatedButton>
                            </div>

                            <div className="mt-8 p-4 bg-surface rounded-xl border border-border">
                                <p className="text-[10px] text-text-muted font-bold leading-relaxed uppercase tracking-wider">
                                    Legal Notice: Confirmation triggers immediate ledger entry and generates a non-repudiable audit trail.
                                </p>
                            </div>
                        </AnimatedCard>
                    </motion.div>
                </motion.form>
            </motion.div>
        </PageWrapper>
    );
};

const InputField = ({ label, icon: Icon, suffix: Suffix, className = "", ...props }) => (
    <div className={className}>
        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{label}</label>
        <div className="relative group">
            {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />}
            <input
                {...props}
                className={`w-full bg-surface border border-border rounded-xl py-3 text-sm focus:border-accent/30 outline-none transition-all placeholder:text-text-muted/30 font-bold
                    ${Icon ? 'pl-11' : 'px-4'}
                    ${Suffix ? 'pr-11' : 'pr-4'}
                `}
            />
            {Suffix && <Suffix size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" />}
        </div>
    </div>
);

const SelectField = ({ label, options, ...props }) => (
    <div>
        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{label}</label>
        <select
            {...props}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:border-accent/30 outline-none transition-all font-bold cursor-pointer hover:bg-secondary"
        >
            {options.map(opt => <option key={opt} value={opt} className="bg-primary">{opt}</option>)}
        </select>
    </div>
);

const SummaryRow = ({ label, value, active = false }) => (
    <div className="flex justify-between items-center group">
        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-2">
            <span className={`text-sm font-black tracking-tight ${active ? 'text-accent' : 'text-text-main'}`}>{value}</span>
            <ArrowRight size={10} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    </div>
);

export default AddLoan;
