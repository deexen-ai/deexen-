import { useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuthStore } from '@/stores/useAuthStore';
import EditProfileModal from '@/components/profile/EditProfileModal';
import {
    GitCommit, Clock, Award, Terminal,
    BookOpen, Coffee, Calendar, MapPin,
    Link as LinkIcon, Edit3, ArrowLeft
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Mock Data for Contribution Graph (52 weeks * 7 days)
const generateMockContributions = () => {
    // Generate 52 weeks of data
    return Array.from({ length: 52 }).map(() => {
        return Array.from({ length: 7 }).map(() => ({
            level: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0, // 70% chance of being empty
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const weeks = generateMockContributions();

    if (!user) return null;

    return (
        <div className="min-h-screen w-full bg-[var(--bg-canvas)] font-sans text-[var(--text-primary)] flex flex-col">
            <Header />
            <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />

            {/* Content Container */}
            <div className="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col">

                <div className="mb-6">
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
                    >
                        <div className="p-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] group-hover:border-orange-500/50 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Back to dashboard</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Left Column: Identity Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-orange-600 to-orange-400 mb-4">
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full bg-[var(--bg-canvas)] object-cover border-2 border-[var(--bg-canvas)]" />
                            </div>
                            <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">{user.name}</h1>
                            <p className="text-[var(--text-secondary)] text-sm mb-4 capitalize">
                                {user.role || 'Developer'}
                            </p>

                            <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)] mb-6">
                                <MapPin className="w-3 h-3" />
                                <span>San Francisco, CA</span>
                            </div>

                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full py-2 bg-[var(--bg-surface-hover)] hover:bg-[var(--bg-surface)] border border-[var(--border-default)] rounded text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Profile</span>
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                                    <LinkIcon className="w-4 h-4" />
                                    <span>Website</span>
                                </div>
                                <a href="#" className="text-orange-400 hover:underline truncate max-w-[150px]">deexen.dev</a>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined</span>
                                </div>
                                <span className="text-[var(--text-primary)]">Jan 2024</span>
                            </div>
                        </div>
                    </div>

                    {/* Center/Right: Stats & Activity */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Console / Hero Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-5 flex items-start space-x-4 hover:border-orange-500/50 transition-colors">
                                <div className="p-2 bg-orange-500/10 rounded-md">
                                    <GitCommit className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">1,234</p>
                                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Total Commits</p>
                                </div>
                            </div>
                            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-5 flex items-start space-x-4 hover:border-yellow-500/50 transition-colors">
                                <div className="p-2 bg-yellow-500/10 rounded-md">
                                    <Clock className="w-6 h-6 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">450h</p>
                                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Coding Time</p>
                                </div>
                            </div>
                            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-5 flex items-start space-x-4 hover:border-blue-500/50 transition-colors">
                                <div className="p-2 bg-blue-500/10 rounded-md">
                                    <Award className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">15</p>
                                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Projects Completed</p>
                                </div>
                            </div>
                        </div>

                        {/* Contribution Graph Simulation */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6 overflow-x-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-medium text-[var(--text-primary)] flex items-center space-x-2">
                                    <Terminal className="w-4 h-4 text-[var(--text-secondary)]" />
                                    <span>Contribution Activity</span>
                                </h2>
                                <span className="text-xs text-[var(--text-secondary)]">Last Year</span>
                            </div>

                            <div className="flex gap-1 min-w-max">
                                {weeks.map((week, weekIndex) => (
                                    <div key={weekIndex} className="flex flex-col gap-1">
                                        {week.map((day, dayIndex) => (
                                            <div
                                                key={`${weekIndex}-${dayIndex}`}
                                                className={cn(
                                                    "w-2.5 h-2.5 rounded-[1px] transition-colors hover:border hover:border-white/20",
                                                    day.level === 0 && "bg-[var(--bg-surface-hover)]",
                                                    day.level === 1 && "bg-orange-900/30",
                                                    day.level === 2 && "bg-orange-700/50",
                                                    day.level === 3 && "bg-orange-500",
                                                    day.level === 4 && "bg-orange-300"
                                                )}
                                                title={`Level ${day.level}`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex items-center justify-end space-x-2 text-[10px] text-[var(--text-secondary)]">
                                <span>Less</span>
                                <div className="flex space-x-1">
                                    <div className="w-2.5 h-2.5 bg-[var(--bg-surface-hover)] rounded-[1px]" />
                                    <div className="w-2.5 h-2.5 bg-orange-900/30 rounded-[1px]" />
                                    <div className="w-2.5 h-2.5 bg-orange-700/50 rounded-[1px]" />
                                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-[1px]" />
                                    <div className="w-2.5 h-2.5 bg-orange-300 rounded-[1px]" />
                                </div>
                                <span>More</span>
                            </div>
                        </div>

                        {/* Learning & Activity Split */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Learning Progress */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
                                <h2 className="text-sm font-medium text-[var(--text-primary)] mb-4 flex items-center space-x-2">
                                    <BookOpen className="w-4 h-4 text-[var(--text-secondary)]" />
                                    <span>Learning Progress</span>
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-[var(--text-secondary)]">TypeScript</span>
                                            <span className="text-[var(--text-secondary)]">85%</span>
                                        </div>
                                        <div className="h-1.5 bg-[var(--bg-surface-hover)] rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[85%]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-[var(--text-secondary)]">React</span>
                                            <span className="text-[var(--text-secondary)]">92%</span>
                                        </div>
                                        <div className="h-1.5 bg-[var(--bg-surface-hover)] rounded-full overflow-hidden">
                                            <div className="h-full bg-cyan-500 w-[92%]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-[var(--text-secondary)]">Python</span>
                                            <span className="text-[var(--text-secondary)]">40%</span>
                                        </div>
                                        <div className="h-1.5 bg-[var(--bg-surface-hover)] rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500 w-[40%]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
                                <h2 className="text-sm font-medium text-[var(--text-primary)] mb-4 flex items-center space-x-2">
                                    <Coffee className="w-4 h-4 text-[var(--text-secondary)]" />
                                    <span>Recent Activity</span>
                                </h2>
                                <div className="space-y-4">
                                    {recentActivity.map(activity => (
                                        <div key={activity.id} className="flex items-start space-x-3 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-1.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-[var(--text-primary)]">
                                                    {activity.message} <span className="text-[var(--text-secondary)]">in</span> <span className="text-orange-400">{activity.project}</span>
                                                </p>
                                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
