
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home, FolderOpen, Activity, Settings,
    Box, Bell, LogOut
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils/cn';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();

    if (!user) return null;

    const navItems = [
        { icon: Home, label: 'Home', path: '/dashboard' },
        { icon: FolderOpen, label: 'Projects', path: '/projects' }, // Keeping dashboard as main for now
        { icon: Box, label: 'Deployments', path: '/deployments' },
        { icon: Activity, label: 'Activity', path: '/activity' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <aside className="w-64 h-screen bg-[var(--bg-sidebar)] border-r border-[var(--border-sidebar)] flex flex-col fixed left-0 top-0 z-50">
            {/* Header / Workspace Switcher */}
            <div className="h-14 flex items-center px-4 border-b border-[var(--border-default)]">
                <div className="flex items-center gap-2 p-1.5">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-[10px] font-bold">
                        D
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">Deexen Team</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-0.5">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group",
                            isActive(item.path)
                                ? "bg-orange-500/10 text-orange-600 dark:text-orange-500"
                                : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                        )}
                    >
                        <item.icon className={cn(
                            "w-4 h-4 transition-colors",
                            isActive(item.path) ? "text-orange-600 dark:text-orange-500" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]"
                        )} />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-3 border-t border-[var(--border-default)]">
                <div className="flex items-center justify-between px-2 mb-2">
                    <div className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Account</div>
                </div>

                <button
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--bg-surface-hover)] transition-colors group text-left"
                >
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--text-primary)]">{user.name}</p>
                        <p className="text-xs text-[var(--text-secondary)] truncate">{user.email}</p>
                    </div>
                </button>

                <div className="mt-2 flex items-center gap-1">
                    <button className="flex-1 p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-md transition-colors">
                        <Bell className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="flex-1 p-2 text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                    >
                        <LogOut className="w-4 h-4 mx-auto" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
