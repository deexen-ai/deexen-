import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Search, Code2, Users, FolderKanban, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useThemeStore } from '@/stores/useThemeStore';

export default function LandingPage() {
    const { theme, toggleTheme } = useThemeStore();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans selection:bg-orange-200 dark:selection:bg-orange-900/30">

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[var(--bg-canvas)]/80 backdrop-blur-md border-b border-[var(--border-default)] flex items-center justify-between px-6 max-w-2xl mx-auto w-full transition-colors duration-300">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/deexenlogo.png" alt="Deexen" className="h-8" />
                    <span className="text-xl font-display font-bold tracking-tight text-[var(--text-primary)]">Deexen</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-lg transition-colors"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <Button variant="ghost" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={() => navigate('/login')}>Log in</Button>
                    <Button variant="primary" onClick={() => navigate('/signup')}>Sign up</Button>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-2xl mx-auto w-full">

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-24">
                    <div className="inline-flex items-center space-x-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-full px-3 py-1 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        <span className="text-[var(--text-secondary)]">New: User Profiles & Activity Graph</span>
                        <ArrowRight className="w-3 h-3 text-[var(--text-tertiary)] ml-1" />
                    </div>

                    <h1 className="font-display text-5xl md:text-7xl leading-[1] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 tracking-tight text-[var(--text-primary)]">
                        The Professional IDE <br />
                        <span className="text-[var(--text-tertiary)] italic">for builders to show & tell.</span>
                    </h1>

                    <p className="text-lg text-[var(--text-secondary)] max-w-lg mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        A modern development environment that combines professional coding tools with social proof. Showcase your skills, track your progress, and build your legacy.
                    </p>

                    <div className="flex items-center justify-center space-x-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <Button variant="primary" size="lg" className="h-12 px-8 text-base bg-orange-600 hover:bg-orange-500 text-white rounded-full" onClick={() => navigate('/signup')}>
                            Get Started
                        </Button>
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]" onClick={() => navigate('/login')}>
                            Sign In
                        </Button>
                    </div>
                </div>

                {/* Features Section */}
                <div className="space-y-32 py-24">

                    {/* Feature 1: Identity */}
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#111] aspect-video flex items-center justify-center group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-100 to-transparent dark:from-neutral-900 opactiy-50"></div>
                            {/* Mock Profile Card */}
                            <div className="w-3/4 h-3/4 bg-white dark:bg-[#0a0a0a] rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 transform group-hover:scale-[1.02] transition-transform duration-500 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 mb-4 animate-pulse"></div>
                                <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
                                <div className="h-3 w-48 bg-neutral-100 dark:bg-neutral-900 rounded"></div>
                                <div className="mt-4 flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 bg-orange-500/50 rounded-sm"></div>)}
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-500 mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="font-display text-4xl">Your developer identity.</h2>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Forget static resumes. Show your actual work, contributions, and learning progress. A profile that auto-updates as you code in our IDE.
                            </p>
                            <ul className="space-y-3 pt-4">
                                {['Auto-updated contribution graph', 'Verified skills & projects', 'Community recognition'].map((item, i) => (
                                    <li key={i} className="flex items-center space-x-3 text-sm font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-orange-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Feature 2: Cloud Editor */}
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-500 mb-6">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <h2 className="font-display text-4xl">Professional Cloud IDE.</h2>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                A powerful, VS Code-compatible environment that runs directly in your browser. No setup required—just click and code.
                            </p>
                            <ul className="space-y-3 pt-4">
                                {['Monaco Editor integration', 'Instant project setup', 'Smart file management'].map((item, i) => (
                                    <li key={i} className="flex items-center space-x-3 text-sm font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#111] aspect-video flex items-center justify-center group">
                            <div className="absolute inset-0 bg-gradient-to-tl from-neutral-100 to-transparent dark:from-neutral-900 opactiy-50"></div>
                            {/* Mock Editor UI */}
                            <div className="w-full h-full bg-[#1e1e1e] p-4 font-mono text-xs text-center flex flex-col opacity-90 group-hover:opacity-100 transition-opacity">
                                <div className="flex border-b border-[#333] pb-2 mb-2 space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-left space-y-1 text-blue-400">
                                    <p><span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> 'react';</p>
                                    <p><span className="text-purple-400">export default function</span> <span className="text-yellow-400">App</span>() {'{'}</p>
                                    <p className="pl-4"><span className="text-purple-400">return</span> (</p>
                                    <p className="pl-8 text-orange-400">&lt;div&gt;Hello World&lt;/div&gt;</p>
                                    <p className="pl-4">);</p>
                                    <p>{'}'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: Workspaces */}
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#111] aspect-video flex items-center justify-center group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-100 to-transparent dark:from-neutral-900 opactiy-50"></div>
                            {/* Mock Workspace Cards */}
                            <div className="grid grid-cols-2 gap-4 p-8 w-full">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white dark:bg-[#0a0a0a] rounded border border-neutral-200 dark:border-neutral-800 p-3 shadow-sm transform hover:-translate-y-1 transition-transform">
                                        <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded mb-2"></div>
                                        <div className="h-2 w-16 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-500 mb-6">
                                <FolderKanban className="w-6 h-6" />
                            </div>
                            <h2 className="font-display text-4xl">Instant workspaces.</h2>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Spin up isolated workspaces for different projects, experiments, or learning paths. Keep your work organized and accessible from anywhere.
                            </p>
                            <ul className="space-y-3 pt-4">
                                {['Isolated environments', 'Project templates', 'Seamless switching'].map((item, i) => (
                                    <li key={i} className="flex items-center space-x-3 text-sm font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Verified Skills Section (New) */}
                <div className="py-24 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div>
                            <h2 className="font-display text-4xl mb-6">Skills, verified by code.</h2>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
                                Anyone can claim they know React. We verify it. Our IDE analyzes your actual coding patterns and project complexity to award skill badges.
                            </p>
                        </div>
                        <div className="bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
                            <h4 className="font-medium mb-4 text-sm text-neutral-500 uppercase tracking-wider">Your Stack</h4>
                            <div className="space-y-3">
                                {[
                                    { name: 'React', icon: 'react', color: '#61DAFB' },
                                    { name: 'TypeScript', icon: 'typescript', color: '#3178C6' },
                                    { name: 'Node.js', icon: 'nodedotjs', color: '#339933' },
                                    { name: 'Python', icon: 'python', color: '#3776AB' },
                                    { name: 'Rust', icon: 'rust', color: '#ffffff' }
                                ].map((skill) => (
                                    <div key={skill.name} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-5 h-5 flex items-center justify-center bg-transparent">
                                                <img
                                                    src={`https://cdn.simpleicons.org/${skill.icon}/${skill.color.replace('#', '')}`}
                                                    alt={skill.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <span className="font-medium">{skill.name}</span>
                                        </div>
                                        <div className="flex items-center text-green-600 dark:text-green-500 text-sm">
                                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                            <span>Verified</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Community Section (New) */}
                <div className="py-24 border-t border-neutral-200 dark:border-neutral-800 text-center">
                    <h2 className="font-display text-4xl mb-6">Join the 1% of builders.</h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto mb-10">
                        Connect with developers who are actually shipping. Share snippets, get feedback, and find collaborators for your next big idea.
                    </p>
                    <div className="flex items-center justify-center -space-x-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0a0a0a] bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                                <img
                                    src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 40}.jpg`}
                                    alt={`User ${i}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                        <div className="pl-4 text-sm font-medium text-neutral-500">
                            +2,400 builders
                        </div>
                    </div>
                </div>

                {/* Philosophy Section */}
                <div className="py-24 border-t border-neutral-200 dark:border-neutral-800">
                    <h2 className="font-display text-4xl mb-8">Built for flow state.</h2>
                    <div className="prose prose-lg dark:prose-invert text-neutral-600 dark:text-neutral-400">
                        <p className="mb-6">
                            We noticed a trend: developer tools becoming "app stores." Too many integrations, too many distracting bells and whistles.
                        </p>
                        <p className="mb-6">
                            Deexen is different. We stripped away everything that doesn't contribute to writing code or shipping projects. It's a return to the essentials, but with the power of the modern web.
                        </p>
                        <p>
                            It's not just an IDE. It's a quiet place to think.
                        </p>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center py-24 border-t border-neutral-200 dark:border-neutral-800">
                    <h2 className="font-display text-4xl mb-6">Ready to build?</h2>
                    <div className="flex justify-center space-x-4">
                        <Button variant="primary" size="lg" onClick={() => navigate('/signup')}>Get Started</Button>
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="bg-neutral-50 dark:bg-[#050505] border-t border-neutral-200 dark:border-neutral-800 py-12 px-6">
                <div className="max-w-2xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <span className="font-display font-medium text-lg text-neutral-900 dark:text-neutral-200">Deexen</span>
                        <span>© 2026</span>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">GitHub</a>
                        <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Privacy</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}
