import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { User, Lock, Settings as SettingsIcon, Palette, Shield, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type SettingsTab = 'profile' | 'privacy' | 'settings' | 'theme' | 'account';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const { user, updateUser } = useAuthStore();
    const { theme, setTheme } = useThemeStore();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    // Form States (example for Profile)
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            updateUser({ name, email });
            setIsLoading(false);
        }, 800);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'privacy', label: 'Privacy', icon: Lock },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
        { id: 'theme', label: 'Theme', icon: Palette },
        { id: 'account', label: 'Account', icon: Shield },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen w-full bg-[var(--bg-canvas)] flex flex-col font-sans transition-colors duration-200">
            {/* Header */}
            <Header />

            {/* Centered Page Content */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-hidden">
                <div className="w-full h-full max-w-6xl max-h-[800px] bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-2xl flex overflow-hidden">

                    {/* Sidebar */}
                    <div className="w-64 border-r border-[var(--border-default)] bg-[var(--bg-surface)] flex flex-col">
                        <div className="p-4 border-b border-[var(--border-default)]">
                            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Settings</h2>
                        </div>
                        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as SettingsTab)}
                                        className={cn(
                                            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                            isActive
                                                ? "bg-orange-500/10 text-orange-500 font-medium"
                                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                        <div className="p-4 border-t border-[var(--border-default)]">
                            <p className="text-xs text-[var(--text-secondary)] text-center">Deexen v0.0.1</p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-canvas)]/50">
                        {/* Content Header */}
                        <div className="h-14 border-b border-[var(--border-default)] flex items-center justify-between px-6 bg-[var(--bg-surface)]">
                            <h2 className="text-lg font-medium text-[var(--text-primary)] capitalize">
                                {activeTab}
                            </h2>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="flex-1 overflow-y-auto p-6">

                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="max-w-xl space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border border-[var(--border-default)]" />
                                        <div>
                                            <Button variant="outline" size="sm">Change Avatar</Button>
                                            <p className="text-xs text-[var(--text-secondary)] mt-2">JPG or PNG, max 1MB</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Display Name</label>
                                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email Address</label>
                                            <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled className="opacity-70" />
                                            <p className="text-xs text-[var(--text-secondary)] mt-1">Contact support to change email.</p>
                                        </div>

                                        <div className="pt-4">
                                            <Button onClick={handleSave} isLoading={isLoading}>Save Changes</Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Theme Tab */}
                            {activeTab === 'theme' && (
                                <div className="max-w-2xl">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setTheme('light')}
                                            className={cn(
                                                "p-4 rounded-xl border-2 text-left transition-all",
                                                theme === 'light' ? "border-orange-500 bg-[var(--bg-surface)]" : "border-[var(--border-default)]"
                                            )}
                                        >
                                            <div className="font-medium text-[var(--text-primary)] mb-2">Light Mode</div>
                                            <div className="space-y-2 opacity-50 pointer-events-none">
                                                <div className="h-2 w-3/4 bg-gray-200 rounded" />
                                                <div className="h-2 w-1/2 bg-gray-200 rounded" />
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setTheme('dark')}
                                            className={cn(
                                                "p-4 rounded-xl border-2 text-left transition-all",
                                                theme === 'dark' ? "border-orange-500 bg-[var(--bg-surface)]" : "border-[var(--border-default)]"
                                            )}
                                        >
                                            <div className="font-medium text-[var(--text-primary)] mb-2">Dark Mode</div>
                                            <div className="space-y-2 opacity-50 pointer-events-none">
                                                <div className="h-2 w-3/4 bg-gray-800 rounded" />
                                                <div className="h-2 w-1/2 bg-gray-800 rounded" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Placeholders for others */}
                            {(activeTab === 'privacy' || activeTab === 'settings' || activeTab === 'account') && (
                                <div className="flex flex-col items-center justify-center h-64 text-[var(--text-secondary)]">
                                    <SettingsIcon className="w-12 h-12 mb-4 opacity-20" />
                                    <p>This section is under development.</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
