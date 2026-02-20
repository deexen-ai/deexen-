import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useLayoutStore } from '@/stores/useLayoutStore';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/utils/cn';
import {
    GitCommit, Clock, Award, Terminal,
    BookOpen, Coffee, MapPin, Link as LinkIcon,
    Edit3, Calendar
} from 'lucide-react';

// Mock Data for Contribution Graph (52 weeks * 7 days)
const generateMockContributions = () => {
    return Array.from({ length: 52 }).map(() => {
        return Array.from({ length: 7 }).map(() => ({
            level: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
        }));
    });
};

// Mock Recent Activity
const recentActivity = [
    { id: 1, type: 'commit', message: 'feat: added user dropdown', time: '2 hours ago', project: 'deexen-frontend' },
    { id: 2, type: 'review', message: 'Reviewed PR #42', time: '5 hours ago', project: 'api-gateway' },
    { id: 3, type: 'deploy', message: 'Deployed to staging', time: 'yesterday', project: 'swapcampus' },
];

export default function ProfilePage() {
    const { user } = useAuthStore();
    const { isSidebarOpen } = useLayoutStore();
    const navigate = useNavigate();
    const weeks = generateMockContributions();

    if (!user) return null;

    return (
        <div className="flex h-screen w-full bg-[var(--bg-main)] font-sans text-[var(--text-primary)] overflow-hidden">
            <Sidebar />

            <main className={cn(
                "flex-1 h-full overflow-y-auto overflow-x-hidden relative transition-all duration-300",
                isSidebarOpen ? "ml-64" : "ml-20"
            )}>
                {/* Sticky Header */}
                <header className="sticky top-0 z-40 w-full h-16 glass-panel border-b border-[var(--border-muted)] flex items-center justify-between px-8">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <span onClick={() => navigate('/dashboard')} className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">deexen</span>
                        <span className="text-[var(--text-tertiary)]">/</span>
                        <span className="text-[var(--text-primary)] font-medium cursor-pointer">profile</span>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-6">
                    {/* Banner / Header Section */}
                    <div className="relative rounded-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-default)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Abstract Banner Background */}
                        <div className="h-32 bg-gradient-brand opacity-10 w-full" />

                        <div className="px-8 pb-8">
                            <div className="relative -mt-12 mb-6 flex flex-col sm:flex-row justify-between items-end gap-4">
                                <div className="flex items-end gap-6">
                                    <div className="w-24 h-24 rounded-2xl p-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xl">
                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover bg-[var(--bg-canvas)]" />
                                    </div>
                                    <div className="mb-2">
                                        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">{user.name}</h1>
                                        <p className="text-[var(--text-secondary)]">{user.role || 'Full Stack Developer'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="mb-2 px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-default)] rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    <Edit3 className="w-4 h-4 text-[var(--text-secondary)]" />
                                    <span>Edit Profile</span>
                                </button>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-6 text-sm text-[var(--text-secondary)] border-t border-[var(--border-default)] pt-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[var(--text-tertiary)]" />
                                    <span>{user.location || 'No location set'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4 text-[var(--text-tertiary)]" />
                                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                                        {user.website ? user.website.replace(/^https?:\/\//, '') : 'No website'}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[var(--text-tertiary)]" />
                                    <span>Joined Jan 2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Stats Column */}
                        <div className="space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-5 flex items-center gap-4 hover:border-orange-500/30 transition-colors group">
                                    <div className="p-3 bg-orange-500/10 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                        <GitCommit className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-[var(--text-primary)]">1,234</p>
                                        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">Commits</p>
                                    </div>
                                </div>
                                <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-5 flex items-center gap-4 hover:border-yellow-500/30 transition-colors group">
                                    <div className="p-3 bg-yellow-500/10 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                        <Clock className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-[var(--text-primary)]">450h</p>
                                        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">Coding Time</p>
                                    </div>
                                </div>
                                <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-5 flex items-center gap-4 hover:border-blue-500/30 transition-colors group">
                                    <div className="p-3 bg-blue-500/10 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                        <Award className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-[var(--text-primary)]">15</p>
                                        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">Projects</p>
                                    </div>
                                </div>
                            </div>

                            {/* Learning Progress */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-6">
                                <h2 className="text-sm font-medium text-[var(--text-primary)] mb-5 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-[var(--text-secondary)]" />
                                    <span>Languages</span>
                                </h2>
                                <div className="space-y-5">
                                    {[
                                        { lang: 'TypeScript', percent: 85, color: 'bg-blue-500' },
                                        { lang: 'React', percent: 92, color: 'bg-cyan-500' },
                                        { lang: 'Python', percent: 40, color: 'bg-yellow-500' }
                                    ].map((item) => (
                                        <div key={item.lang}>
                                            <div className="flex justify-between text-xs mb-1.5 font-medium">
                                                <span className="text-[var(--text-secondary)]">{item.lang}</span>
                                                <span className="text-[var(--text-primary)]">{item.percent}%</span>
                                            </div>
                                            <div className="h-1.5 bg-[var(--bg-canvas)] rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full transition-all duration-1000", item.color)}
                                                    style={{ width: `${item.percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contribution Graph */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-[var(--text-secondary)]" />
                                        <span>Contribution Activity</span>
                                    </h2>
                                    <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-canvas)] px-2 py-1 rounded border border-[var(--border-default)]">Last Year</span>
                                </div>

                                <div className="flex gap-1 overflow-hidden w-full justify-between opacity-80 hover:opacity-100 transition-opacity">
                                    {weeks.map((week, weekIndex) => (
                                        <div key={weekIndex} className="flex flex-col gap-1">
                                            {week.map((day, dayIndex) => (
                                                <div
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    className={cn(
                                                        "w-2.5 h-2.5 rounded-[1px] transition-colors",
                                                        day.level === 0 && "bg-[var(--bg-canvas)]",
                                                        day.level === 1 && "bg-orange-900/40",
                                                        day.level === 2 && "bg-orange-700/60",
                                                        day.level === 3 && "bg-orange-600",
                                                        day.level === 4 && "bg-orange-500"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-6">
                                <h2 className="text-sm font-medium text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                    <Coffee className="w-4 h-4 text-[var(--text-secondary)]" />
                                    <span>Recent Activity</span>
                                </h2>
                                <div className="space-y-6">
                                    {recentActivity.map((activity, index) => (
                                        <div key={activity.id} className="relative pl-6 pb-1 last:pb-0">
                                            {index !== recentActivity.length - 1 && (
                                                <div className="absolute left-[5px] top-2 bottom-0 w-px bg-[var(--border-default)]" />
                                            )}
                                            <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--bg-surface)] bg-orange-500 ring-1 ring-[var(--border-default)]" />

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                <p className="text-sm text-[var(--text-primary)]">
                                                    {activity.message}
                                                    <span className="text-[var(--text-tertiary)] mx-1">in</span>
                                                    <span className="font-medium text-[var(--text-secondary)] hover:text-orange-500 cursor-pointer transition-colors">{activity.project}</span>
                                                </p>
                                                <span className="text-xs text-[var(--text-tertiary)] font-mono">{activity.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
