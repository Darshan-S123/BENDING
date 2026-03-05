import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Shield, Bell, Palette, Database } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const SettingSection = ({ icon: Icon, title, description, children }) => (
    <div className="p-6 bg-secondary/20 rounded-2xl border border-white/5 space-y-4">
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

const Settings = () => {
    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Settings</h1>
                        <p className="text-text-muted mt-1 font-medium">Manage your application preferences and security.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingSection
                        icon={User}
                        title="Profile"
                        description="Update your personal information."
                    >
                        <div className="space-y-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-accent uppercase tracking-widest">Display Name</label>
                                <input type="text" defaultValue="Darshan S" className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-text-main outline-none focus:border-accent/50 transition-all" />
                            </div>
                        </div>
                    </SettingSection>

                    <SettingSection
                        icon={Shield}
                        title="Security"
                        description="Manage your password and authentication."
                    >
                        <button className="px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-lg text-sm font-bold hover:bg-accent/20 transition-all">
                            Change Master Password
                        </button>
                    </SettingSection>

                    <SettingSection
                        icon={Palette}
                        title="Appearance"
                        description="Customize the look and feel of your dashbaord."
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent border-2 border-white/20 cursor-pointer" />
                            <div className="w-8 h-8 rounded-full bg-purple-500 border border-white/10 cursor-pointer" />
                            <div className="w-8 h-8 rounded-full bg-blue-500 border border-white/10 cursor-pointer" />
                        </div>
                    </SettingSection>

                    <SettingSection
                        icon={Database}
                        title="Data Management"
                        description="Export or backup your lending data."
                    >
                        <div className="flex gap-3">
                            <button className="flex-1 px-4 py-2 bg-secondary/50 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/5 transition-all text-text-main">
                                Export JSON
                            </button>
                            <button className="flex-1 px-4 py-2 bg-secondary/50 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/5 transition-all text-text-main">
                                Import Data
                            </button>
                        </div>
                    </SettingSection>
                </div>

                <div className="p-6 bg-danger/5 rounded-2xl border border-danger/10 mt-12">
                    <h3 className="text-lg font-bold text-danger">Danger Zone</h3>
                    <p className="text-sm text-text-muted mb-4">Irreversible actions that affect your entire dataset.</p>
                    <button className="px-4 py-2 bg-danger/10 border border-danger/20 text-danger rounded-lg text-sm font-bold hover:bg-danger/20 transition-all">
                        Reset All Data
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Settings;
