import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, GitFork, Bot, ChevronRight, Copy, Bug, Sparkles, Maximize, GraduationCap, Zap, Trophy, Timer, Flame } from 'lucide-react';
import { cn } from '@/utils/cn';

// Mock Data
const recentWorkspaces = [
    { name: 'deexen-frontend', path: 'C:\\Users\\11ara\\github' },
    { name: 'swapcampus', path: 'C:\\Users\\11ara\\github' },
    { name: 'haven', path: 'C:\\Users\\11ara\\github' },
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
    const [selectedMode, setSelectedMode] = useState('free');

    const handleOpenWorkspace = () => {
        navigate('/workspace');
    };

    return (
        <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center p-6 font-sans text-[#1f2937]">

            <div className="w-full max-w-[520px] flex flex-col items-center">

                {/* Branding Section */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] rounded-2xl flex items-center justify-center mb-4 shadow-xl ring-4 ring-purple-50/50">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-[#111827] tracking-tight mb-1">Deexen IDE</h1>
                    <p className="text-[#6b7280] text-sm">AI-Powered Environment for Learning & Development</p>
                </div>

                {/* Progress Stats Row */}
                <div className="w-full grid grid-cols-3 gap-3 mb-8">
                    <div className="bg-white p-3 rounded-lg border border-[#e5e7eb] shadow-sm flex flex-col items-center">
                        <div className="flex items-center text-xs text-[#6b7280] mb-1">
                            <Flame className="w-3 h-3 mr-1 text-orange-500" /> daily streak
                        </div>
                        <span className="font-bold text-lg text-[#111827]">12 Days</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#e5e7eb] shadow-sm flex flex-col items-center">
                        <div className="flex items-center text-xs text-[#6b7280] mb-1">
                            <Timer className="w-3 h-3 mr-1 text-blue-500" /> hours coded
                        </div>
                        <span className="font-bold text-lg text-[#111827]">48.5</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#e5e7eb] shadow-sm flex flex-col items-center">
                        <div className="flex items-center text-xs text-[#6b7280] mb-1">
                            <Trophy className="w-3 h-3 mr-1 text-yellow-500" /> skills
                        </div>
                        <span className="font-bold text-lg text-[#111827]">React</span>
                    </div>
                </div>

                {/* AI Launchpad Input */}
                <div className="w-full mb-6 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Bot className="h-5 w-5 text-[#7c3aed]" />
                    </div>
                    <input
                        type="text"
                        placeholder="What do you want to learn or build today?"
                        className="w-full pl-10 pr-24 py-3.5 bg-white border border-[#e5e7eb] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent transition-all text-sm"
                    />
                    <div className="absolute inset-y-0 right-1.5 flex items-center">
                        <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors">
                            Start
                        </button>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="w-full mb-8">
                    <h2 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3 px-1">Select Learning Mode</h2>
                    <div className="grid grid-cols-5 gap-2">
                        {learningModes.map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setSelectedMode(mode.id)}
                                className={cn(
                                    "flex flex-col items-center p-2 rounded-lg border transition-all duration-200 h-[80px] justify-center",
                                    selectedMode === mode.id
                                        ? "bg-white border-[#7c3aed] ring-1 ring-[#7c3aed] shadow-md transform scale-105"
                                        : "bg-white border-transparent hover:border-[#e5e7eb] hover:bg-gray-50 opacity-70 hover:opacity-100"
                                )}
                                title={mode.desc}
                            >
                                <div className={cn("p-1.5 rounded-full mb-1", mode.bg, mode.color)}>
                                    <mode.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-medium text-center text-[#374151] leading-tight">{mode.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="mt-2 text-center h-4">
                        <span className="text-xs text-[#7c3aed] font-medium">
                            {learningModes.find(m => m.id === selectedMode)?.desc}
                        </span>
                    </div>
                </div>

                {/* Actions & Recent */}
                <div className="w-full bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                    <div className="grid grid-cols-2 border-b border-[#e5e7eb]">
                        <button
                            onClick={handleOpenWorkspace}
                            className="p-3 flex items-center justify-center hover:bg-[#f9fafb] border-r border-[#e5e7eb] transition-colors"
                        >
                            <FolderOpen className="w-4 h-4 mr-2 text-[#4b5563]" />
                            <span className="text-sm font-medium text-[#374151]">Open Folder</span>
                        </button>
                        <button className="p-3 flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                            <GitFork className="w-4 h-4 mr-2 text-[#4b5563]" />
                            <span className="text-sm font-medium text-[#374151]">Clone Repo</span>
                        </button>
                    </div>

                    <div className="p-4 bg-[#f9fafb]/50">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-xs font-semibold text-[#9ca3af] uppercase">Recent Projects</span>
                        </div>
                        <div className="space-y-1">
                            {recentWorkspaces.map((workspace) => (
                                <div
                                    key={workspace.name}
                                    onClick={handleOpenWorkspace}
                                    className="px-3 py-2 hover:bg-[#e5e7eb]/50 rounded-md cursor-pointer flex items-center justify-between group transition-colors"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-[#374151] group-hover:text-[#7c3aed]">{workspace.name}</span>
                                        <span className="text-[10px] text-[#9ca3af]">{workspace.path}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[#d1d5db] group-hover:text-[#7c3aed]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
