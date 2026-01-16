import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FolderOpen, Bot, Bug, Sparkles, Maximize,
    GraduationCap, Zap, Trophy, Flame, LogOut, Plus,
    Calendar, FileCode, Clock
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/useAuthStore';

// Mock Data for Projects
const projects = [
    {
        id: '1',
        name: 'deexen-frontend',
        description: 'Main frontend repository for Deexen IDE',
        path: 'C:\\Users\\11ara\\github',
        files: 24,
        lastModified: '2 hours ago',
        language: 'TypeScript'
    },
    {
        id: '2',
        name: 'swapcampus',
        description: 'University marketplace platform',
        path: 'C:\\Users\\11ara\\github',
        files: 156,
        lastModified: '1 day ago',
        language: 'React'
    },
    {
        id: '3',
        name: 'haven',
        description: 'Personal wellness tracker application',
        path: 'C:\\Users\\11ara\\github',
        files: 43,
        lastModified: '5 days ago',
        language: 'Python'
    },
];

const learningModes = [
    { id: 'debug', name: 'Debug Mode', icon: Bug, desc: 'Explains & fixes errors', color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'enhance', name: 'Enhancement', icon: Sparkles, desc: 'Refactor & Optimize', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'expand', name: 'Expansion', icon: Maximize, desc: 'Scale & Add Modules', color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'teacher', name: 'Strict Teacher', icon: GraduationCap, desc: 'Hints only, no fixes', color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'free', name: 'Free Coding', icon: Zap, desc: 'Live Fixes', color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [selectedMode, setSelectedMode] = useState('free');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleOpenWorkspace = (projectId?: string) => {
        // In a real app, we'd use the projectId
        navigate('/workspace');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f9fafb] font-sans text-[#1f2937]">

            {/* Feature 2.1: Profile Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] rounded-lg flex items-center justify-center shadow-md mr-3">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg text-gray-900 tracking-tight">Deexen</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 bg-gray-50 py-1.5 px-3 rounded-full border border-gray-100">
                            <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full bg-gray-200" />
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-700 leading-none">{user.name}</span>
                                <span className="text-[10px] text-gray-500 leading-none mt-0.5">{user.email}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Sign out"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">

                {/* Feature 2.2: User Information Display (Stats) */}
                <div className="w-full grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center hover:border-purple-200 transition-colors">
                        <div className="flex items-center text-xs font-medium text-gray-500 mb-1">
                            <Trophy className="w-3.5 h-3.5 mr-1.5 text-yellow-500" /> Projects
                        </div>
                        <span className="font-bold text-2xl text-gray-900">{user.projectCount || 0}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center hover:border-purple-200 transition-colors">
                        <div className="flex items-center text-xs font-medium text-gray-500 mb-1">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Joined
                        </div>
                        <span className="font-bold text-2xl text-gray-900">{user.joinDate || 'Jan 2026'}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center hover:border-purple-200 transition-colors">
                        <div className="flex items-center text-xs font-medium text-gray-500 mb-1">
                            <Flame className="w-3.5 h-3.5 mr-1.5 text-orange-500" /> Streak
                        </div>
                        <span className="font-bold text-2xl text-gray-900">12 Days</span>
                    </div>
                </div>

                {/* AI Launchpad Input */}
                <div className="w-full mb-8 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Bot className="h-5 w-5 text-[#7c3aed]" />
                    </div>
                    <input
                        type="text"
                        placeholder="What problem do you want to solve today?"
                        className="w-full pl-10 pr-24 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent transition-all text-base"
                    />
                    <div className="absolute inset-y-0 right-1.5 flex items-center">
                        <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                            Generate
                        </button>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="w-full mb-10">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Mode</h2>
                        <span className="text-xs text-[#7c3aed] font-medium">{learningModes.find(m => m.id === selectedMode)?.desc}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                        {learningModes.map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setSelectedMode(mode.id)}
                                className={cn(
                                    "flex flex-col items-center p-3 rounded-xl border transition-all duration-200 h-[90px] justify-center",
                                    selectedMode === mode.id
                                        ? "bg-white border-[#7c3aed] ring-1 ring-[#7c3aed] shadow-md transform scale-105"
                                        : "bg-white border-transparent hover:border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                <div className={cn("p-2 rounded-full mb-2", mode.bg, mode.color)}>
                                    <mode.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-semibold text-center text-gray-700 leading-tight">{mode.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feature 2.3 & 2.4: Projects List & Create Button */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Your Projects</h2>
                        <button className="flex items-center text-sm font-medium text-[#7c3aed] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md transition-colors">
                            <Plus className="w-4 h-4 mr-1.5" />
                            Create Project
                        </button>
                    </div>

                    <div className="space-y-3">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#7c3aed] hover:shadow-md transition-all group relative cursor-pointer"
                                onClick={() => handleOpenWorkspace(project.id)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-gray-100 rounded-lg mr-3 group-hover:bg-purple-50 group-hover:text-[#7c3aed] transition-colors">
                                            <FolderOpen className="w-5 h-5 text-gray-500 group-hover:text-[#7c3aed]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-[#7c3aed] transition-colors">{project.name}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5 max-w-[300px] truncate">{project.description}</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                        Open IDE
                                    </button>
                                </div>

                                <div className="flex items-center text-[11px] text-gray-400 space-x-4 ml-[52px]">
                                    <div className="flex items-center">
                                        <FileCode className="w-3.5 h-3.5 mr-1" />
                                        {project.files} files
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-3.5 h-3.5 mr-1" />
                                        {project.lastModified}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                                        {project.language}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}
