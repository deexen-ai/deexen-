import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await login(email, password);
        setIsLoading(false);
        navigate('/profile');
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#7c3aed] opacity-20 blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600 opacity-20 blur-[100px]" />

            <div className="w-full max-w-md space-y-8 relative z-10 glass-panel p-8 rounded-2xl border border-[#30363d] bg-[#161b22]/80 backdrop-blur-xl shadow-2xl">
                <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#7c3aed] to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-900/20">
                        <Code2 className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
                    <p className="mt-2 text-[#8b949e]">Sign in to your Deexen account</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#c9d1d9] mb-1">
                                Email address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#c9d1d9] mb-1">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#7c3aed] to-blue-600 hover:from-[#6d28d9] hover:to-blue-700 border-0"
                        isLoading={isLoading}
                    >
                        Sign in
                    </Button>

                    <div className="text-center text-sm text-[#8b949e]">
                        <p>Don't have an account? <span className="text-[#58a6ff] cursor-pointer hover:underline">Sign up</span></p>
                    </div>
                </form>
            </div>
        </div>
    );
}
