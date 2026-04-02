import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Shield, Database, KeyRound, Upload, Download, Trash2, Check, X, Eye, EyeOff } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { exportAllDataJSON, importDataFromJSON, deleteAllLoans } from '../utils/loanStore';
import { useAuth } from '../context/AuthContext';

const SettingSection = ({ icon: Icon, title, description, children }) => (
    <div className="p-6 bg-secondary/20 rounded-2xl border border-border space-y-4">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Icon size={20} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-text-main">{title}</h3>
                <p className="text-sm text-text-muted">{description}</p>
            </div>
        </div>
        <div className="pt-2">{children}</div>
    </div>
);

const Toast = ({ message, type = 'success', onClose }) => (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold transition-all
        ${type === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-danger/10 border-danger/20 text-danger'}`}>
        {type === 'success' ? <Check size={16} /> : <X size={16} />}
        {message}
    </div>
);

const Settings = () => {
    const { login, logout } = useAuth();
    const [toast, setToast] = useState(null);
    const [pinModal, setPinModal] = useState(false);
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [pinError, setPinError] = useState('');
    const [resetConfirmText, setResetConfirmText] = useState('');

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleChangePin = () => {
        const storedPin = localStorage.getItem('bending_master_pin') || '5005';
        if (currentPin !== storedPin) {
            setPinError('Current PIN is incorrect');
            return;
        }
        if (newPin.length < 4) {
            setPinError('New PIN must be at least 4 digits');
            return;
        }
        if (newPin !== confirmPin) {
            setPinError('PINs do not match');
            return;
        }
        // Store new PIN in sessionStorage key for AuthContext to use
        // The AuthContext reads hardcoded '5005' — we patch it via localStorage override
        localStorage.setItem('bending_master_pin', newPin);
        setPinModal(false);
        setCurrentPin(''); setNewPin(''); setConfirmPin(''); setPinError('');
        showToast('Master PIN updated successfully');
    };

    const handleExportJSON = async () => {
        try {
            await exportAllDataJSON();
            showToast('Data exported successfully');
        } catch (e) {
            showToast('Export failed: ' + e.message, 'error');
        }
    };

    const handleImportJSON = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const result = await importDataFromJSON(file);
                showToast(`Imported: ${result.loans} loans · ${result.ledger} ledger · ${result.reports} reports`);
            } catch (err) {
                showToast('Import failed — invalid file format', 'error');
            }
        };
        input.click();
    };

    const handleResetAll = async () => {
        if (resetConfirmText !== 'DELETE ALL') return;
        try {
            await deleteAllLoans();
            setResetConfirmText('');
            showToast('All data has been reset', 'error');
        } catch (e) {
            showToast('Reset failed: ' + e.message, 'error');
        }
    };

    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-text-main tracking-tight">Settings</h1>
                        <p className="text-text-muted mt-1 font-medium">Manage your application preferences and security.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile */}
                    <SettingSection icon={User} title="Profile" description="Update your display information.">
                        <div className="space-y-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-accent uppercase tracking-widest">Display Name</label>
                                <input type="text" defaultValue="SS Finance Admin" className="bg-background border border-border rounded-lg px-4 py-2 text-sm text-text-main outline-none focus:border-accent/50 transition-all" />
                            </div>
                        </div>
                    </SettingSection>

                    {/* Security */}
                    <SettingSection icon={Shield} title="Security" description="Manage your master PIN.">
                        <button
                            onClick={() => setPinModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-lg text-sm font-bold hover:bg-accent/20 transition-all"
                        >
                            <KeyRound size={16} />
                            Change Master PIN
                        </button>
                    </SettingSection>

                    {/* Export */}
                    <SettingSection icon={Download} title="Export Data" description="Download a full backup of your data.">
                        <button
                            onClick={handleExportJSON}
                            className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-lg text-sm font-bold hover:bg-accent/20 transition-all w-full justify-center"
                        >
                            <Download size={16} />
                            Export as JSON
                        </button>
                    </SettingSection>

                    {/* Import */}
                    <SettingSection icon={Upload} title="Import Data" description="Restore from a previous JSON backup.">
                        <button
                            onClick={handleImportJSON}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm font-bold hover:bg-border transition-all text-text-main w-full justify-center"
                        >
                            <Upload size={16} />
                            Import JSON Backup
                        </button>
                    </SettingSection>
                </div>

                {/* Danger Zone */}
                <div className="p-6 bg-danger/5 rounded-2xl border border-danger/10 mt-12">
                    <h3 className="text-lg font-bold text-danger mb-1">Danger Zone</h3>
                    <p className="text-sm text-text-muted mb-6">Irreversible actions that affect your entire dataset. Type <code className="bg-secondary px-1 rounded text-danger font-black">DELETE ALL</code> to confirm.</p>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Type DELETE ALL to confirm"
                            value={resetConfirmText}
                            onChange={(e) => setResetConfirmText(e.target.value)}
                            className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm text-text-main outline-none focus:border-danger/50 transition-all placeholder:text-text-muted/30"
                        />
                        <button
                            onClick={handleResetAll}
                            disabled={resetConfirmText !== 'DELETE ALL'}
                            className="flex items-center gap-2 px-4 py-2 bg-danger/10 border border-danger/20 text-danger rounded-lg text-sm font-bold hover:bg-danger/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Trash2 size={16} />
                            Reset All Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Change PIN Modal */}
            {pinModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 shadow-premium">
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="text-2xl font-black text-text-main">Change Master PIN</h3>
                            <button onClick={() => { setPinModal(false); setPinError(''); setCurrentPin(''); setNewPin(''); setConfirmPin(''); }}
                                className="p-2 text-text-muted hover:text-text-main rounded-xl hover:bg-surface transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <PinField label="Current PIN" value={currentPin} onChange={setCurrentPin} show={showCurrent} onToggle={() => setShowCurrent(v => !v)} />
                            <PinField label="New PIN" value={newPin} onChange={setNewPin} show={showNew} onToggle={() => setShowNew(v => !v)} />
                            <PinField label="Confirm New PIN" value={confirmPin} onChange={setConfirmPin} show={showNew} />
                            {pinError && <p className="text-danger text-xs font-bold">{pinError}</p>}
                        </div>

                        <button
                            onClick={handleChangePin}
                            className="w-full py-3 bg-accent text-primary font-black rounded-xl hover:bg-accent/90 transition-all"
                        >
                            Update PIN
                        </button>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} />}
        </PageWrapper>
    );
};

const PinField = ({ label, value, onChange, show, onToggle }) => (
    <div>
        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{label}</label>
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={e => onChange && onChange(e.target.value)}
                maxLength={6}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-accent/30 outline-none font-bold pr-10 text-text-main"
            />
            {onToggle && (
                <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            )}
        </div>
    </div>
);

export default Settings;
