import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, User, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { cn } from '@/utils/cn';

export default function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // keydown escape to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <header className="h-12 border-b border-[var(--border-default)] flex items-center justify-between px-4 bg-[var(--bg-canvas)] flex-shrink-0 relative z-50">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <img src="/deexenlogo.png" alt="Deexen" className="h-6" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Deexen</span>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={toggleTheme}
                    className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                    title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded transition-colors" title="Settings">
                    <Settings className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-neutral-800" />

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={cn(
                            "flex items-center space-x-2 px-2 py-1 rounded text-sm transition-colors",
                            isDropdownOpen
                                ? "bg-neutral-800 text-white"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                        )}
                    >
                        <img src={user.avatar} alt="" className="w-5 h-5 rounded-sm bg-neutral-700" />
                        <span className="text-xs max-w-[100px] truncate hidden sm:block">{user.name}</span>
                        <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-[#0f0f0f] border border-neutral-800 rounded-md shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                            <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                                <p className="text-xs font-medium text-white truncate">{user.name}</p>
                                <p className="text-[10px] text-neutral-500 truncate">{user.email}</p>
                            </div>

                            <button
                                onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                                className="w-full text-left px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center space-x-2"
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>Profile</span>
                            </button>

                            <button
                                onClick={() => { setIsDropdownOpen(false); }}
                                className="w-full text-left px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center space-x-2"
                            >
                                <Settings className="w-3.5 h-3.5" />
                                <span>Settings</span>
                            </button>

                            <div className="h-px bg-neutral-800 my-1" />

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-neutral-800 hover:text-red-300 flex items-center space-x-2"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Sign out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
