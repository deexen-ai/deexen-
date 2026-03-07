import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Code2, Users, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {

    const navigate = useNavigate();
    const mainRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (mainRef.current) {
                mainRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
                mainRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            ref={mainRef}
            className="min-h-screen bg-[#000000] text-[#ededed] font-sans selection:bg-[#FF6A00]/30 selection:text-white relative overflow-x-hidden"
            style={{
                '--mouse-x': '50%',
                '--mouse-y': '50%'
            } as React.CSSProperties}
        >

            {/* Immersive Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Charcoal to black gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#000000]"></div>

                {/* Interactive cursor spotlight */}
                <div
                    className="absolute inset-0 transition-opacity duration-1000 opacity-60"
                    style={{
                        background: `radial-gradient(1000px circle at var(--mouse-x) var(--mouse-y), rgba(255, 106, 0, 0.08), transparent 40%)`
                    }}
                ></div>

                {/* Technical developer grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_30%,#000_60%,transparent_100%)]"></div>

                {/* Central soft glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[600px] bg-[#FF6A00] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

                {/* Grain effect for texture */}
                <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            {/* Premium Navigation Header */}
            <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/[0.06] bg-[#000000]/60 backdrop-blur-2xl transition-all duration-500">
                <div className="max-w-[1200px] mx-auto h-[76px] flex items-center justify-between px-8">
                    <div 
                        className="flex items-center gap-2.5 cursor-pointer group" 
                        onClick={() => navigate('/')}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#FF6A00] blur-[16px] opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-xl"></div>
                            <img 
                                src="/deexenlogo.png" 
                                alt="Deexen AI" 
                                className="w-10 h-10 relative z-10 object-contain rounded-xl group-hover:scale-[1.05] transition-all duration-300" 
                            />
                        </div>
                        <span className="text-white font-semibold text-[17px] tracking-tight select-none">
                            Deexen
                        </span>
                    </div>

                    <div className="flex items-center space-x-8">
                        <button 
                            className="text-[14px] font-medium text-[#a1a1a1] hover:text-white transition-all duration-300 relative group"
                            onClick={() => navigate('/login')}
                        >
                            Log in
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6A00]/50 group-hover:w-full transition-all duration-300"></span>
                        </button>
                        <button 
                            className="text-[14px] font-semibold bg-white text-black px-6 py-2.5 rounded-full hover:bg-[#FF6A00] hover:text-white transition-all duration-500 shadow-[0_0_25px_rgba(255,255,255,0.1)] active:scale-95"
                            onClick={() => navigate('/signup')}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Smooth Scroll Content Container */}
            <main className="pt-[140px] pb-20 px-6 max-w-[1200px] mx-auto w-full relative z-10" style={{ scrollBehavior: 'smooth' }}>

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mx-auto mb-32 relative">
                    <div className="inline-flex items-center space-x-2.5 bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-full px-4 py-2 text-xs font-medium mb-10 hover:border-[#FF6A00]/30 hover:bg-[#FF6A00]/5 hover:shadow-[0_0_24px_rgba(255,106,0,0.15)] transition-all duration-500 cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out group">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] shadow-[0_0_10px_rgba(255,106,0,1)] animate-[pulse_2s_ease-in-out_infinite]"></span>
                        <span className="text-[#a1a1a1] tracking-wide">Deexen 2.0 is now in beta</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#555] group-hover:text-[#FF6A00] transition-colors" />
                    </div>

                    <h1 className="font-sans text-[48px] sm:text-[64px] md:text-[88px] font-bold leading-[1.05] tracking-[-0.04em] mb-8 animate-in fade-in slide-in-from-bottom-12 duration-[1.2s] delay-150 ease-out">
                        <span className="text-white drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)]">The Professional IDE</span> <br />
                        <span className="text-white/40 font-normal italic tracking-[-0.02em] block mt-2">for builders to show & tell.</span>
                    </h1>

                    <p className="text-[18px] md:text-[20px] text-[#888888] font-normal max-w-[620px] mx-auto mb-12 animate-in fade-in slide-in-from-bottom-12 duration-[1.2s] delay-300 leading-[1.6]">
                        A modern development environment that combines professional coding tools with social proof. Showcase your skills, track your progress, and build your legacy.
                    </p>

                    <div className="flex items-center justify-center space-x-5 animate-in fade-in slide-in-from-bottom-12 duration-[1.2s] delay-500">
                        <button className="relative group h-[52px] px-8 text-[15px] font-medium bg-[#FF6A00] text-white rounded-full transition-all duration-300 hover:-translate-y-0.5" onClick={() => navigate('/signup')}>
                            <div className="absolute inset-0 rounded-full bg-[#FF6A00] blur-[15px] opacity-40 group-hover:opacity-80 group-hover:blur-[25px] transition-all duration-300 animate-[pulse_3s_ease-in-out_infinite]"></div>
                            <span className="relative z-10 flex items-center gap-2">Get Started <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" /></span>
                        </button>
                        <button className="h-[52px] px-8 text-[15px] font-medium bg-transparent border border-white/[0.1] text-[#ececec] rounded-full hover:bg-white/[0.04] transition-all duration-300 hover:border-white/[0.2] hover:-translate-y-0.5" onClick={() => navigate('/login')}>
                            Sign In
                        </button>
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
                            <div className="space-y-4">
                                {[
                                    { name: 'React', icon: 'react' },
                                    { name: 'TypeScript', icon: 'ts' },
                                    { name: 'Node.js', icon: 'nodejs' },
                                    { name: 'Python', icon: 'py' },
                                    { name: 'Rust', icon: 'rust' }
                                ].map((skill) => (
                                    <div key={skill.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#111] border border-white/5 shadow-inner overflow-hidden">
                                                <img
                                                    src={`https://skillicons.dev/icons?i=${skill.icon}`}
                                                    alt={skill.name}
                                                    className="w-5 h-5 object-contain"
                                                />
                                            </div>
                                            <span className="font-medium text-[15px]">{skill.name}</span>
                                        </div>
                                        <div className="flex items-center text-emerald-500 text-xs font-semibold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            <span>VERIFIED</span>
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
