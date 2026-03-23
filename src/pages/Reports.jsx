import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Trash2, ShieldCheck } from 'lucide-react';
import { formatCurrency, getReports, clearReports, getLoans } from '../utils/loanStore';
import { generateSettlementPDF } from '../utils/pdfGenerator';
import PageWrapper from '../components/PageWrapper';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';

const Reports = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            const data = await getReports();
            setHistory(data);
        };
        fetchReports();
    }, []);

    const handleClear = async () => {
        if (window.confirm("Are you sure you want to clear all report history? This action cannot be undone.")) {
            await clearReports();
            setHistory([]);
        }
    };

    const handleDownloadReport = async (report) => {
        // Fetch only COMPLETED loans for that settlement month to re-generate PDF
        const allLoans = await getLoans();
        const monthLoans = allLoans.filter(l => l.settlementMonth === report.month && l.status === 'Completed');
        if (monthLoans.length === 0) {
            alert(`No completed settlement data found for ${report.month}. The report may have been generated before data was migrated.`);
            return;
        }
        generateSettlementPDF(report.month, monthLoans);
    };

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-text-main tracking-tightest">Archive Vault</h1>
                    <p className="text-text-muted text-sm font-bold flex items-center gap-2 mt-2 uppercase tracking-widest">
                        <ShieldCheck size={14} className="text-accent" />
                        Audit-Ready Financial Records
                    </p>
                </div>
                {history.length > 0 && (
                    <AnimatedButton variant="danger" icon={Trash2} onClick={handleClear}>
                        Purge Archive
                    </AnimatedButton>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {history.length > 0 ? history.map((report, index) => (
                    <AnimatedCard key={report.id} delay={index * 0.05} noHover className="p-0 overflow-hidden group">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-accent/10 rounded-2xl text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                                    <FileText size={28} />
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Generated On</div>
                                    <div className="text-xs font-black text-text-main">
                                        {new Date(report.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-text-main tracking-tight mb-2 uppercase">{report.month}</h3>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                                Validated Audit Trail
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-accent/20 transition-colors">
                                    <div className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Entities</div>
                                    <div className="text-lg font-black text-text-main">{report.members}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-accent/20 transition-colors">
                                    <div className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Aggregate</div>
                                    <div className="text-lg font-black text-accent">{formatCurrency(report.total)}</div>
                                </div>
                            </div>

                            <AnimatedButton
                                variant="secondary"
                                fullWidth
                                icon={Download}
                                onClick={() => handleDownloadReport(report)}
                            >
                                Download PDF
                            </AnimatedButton>
                        </div>
                        <div className="h-1 w-full bg-accent/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    </AnimatedCard>
                )) : (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-text-muted/20 mb-8 border border-white/5">
                            <Calendar size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-text-main mb-2 tracking-tight">Vault Empty</h3>
                        <p className="text-text-muted text-sm font-bold uppercase tracking-widest max-w-xs text-center leading-relaxed">
                            No ledger snapshots detected. Initialize a settlement period to generate records.
                        </p>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default Reports;
