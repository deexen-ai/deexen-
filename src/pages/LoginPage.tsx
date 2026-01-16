import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, initialize, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    // Check auth on mount
    useEffect(() => {
        initialize();
        if (isAuthenticated) {
            navigate('/profile');
        }
    }, [initialize, isAuthenticated, navigate]);

    // Validation Logic
    const validateEmail = (val: string) => {
        if (!val) {
            setEmailError('');
            return false;
        }
        // Simple regex for domain check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
            setEmailError('Please enter a valid email');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = (val: string) => {
        if (!val) {
            setPasswordError('');
            return false;
        }
        if (val.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setEmail(val);
        validateEmail(val);
        setFormError(''); // clear global error
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        validatePassword(val);
        setFormError(''); // clear global error
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        setIsLoading(true);
        setFormError('');

        try {
            await login(email, password);
            navigate('/profile');
        } catch (error) {
            setFormError('Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c3aed] opacity-10 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600 opacity-10 blur-[120px]" />

            <div className="w-full max-w-[400px] space-y-8 relative z-10">

                {/* Brand Header */}
                <div className="flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] flex items-center justify-center mb-6 shadow-2xl shadow-purple-900/40 ring-1 ring-white/10">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                            <path d="M7 3C7 3 15 3 16 3C19 3 21 5 21 8V16C21 19 19 21 16 21H7V3Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">Welcome back to Deexen</h2>
                    <p className="mt-2 text-sm text-[#a1a1aa]">Enter your details to access your workspace</p>
                </div>

                {/* Main Card */}
                <div className="p-8 rounded-2xl border border-[#27272a] bg-[#18181b]/60 backdrop-blur-xl shadow-2xl">
                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Global Error */}
                        {formError && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {formError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-xs font-medium text-[#d4d4d8] mb-1.5 ml-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        className={`bg-[#0f0f12] border-[#27272a] focus:border-[#7c3aed] focus:ring-[#7c3aed]/20 h-11 text-sm ${emailError ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                    {email && !emailError && (
                                        <CheckCircle2 className="absolute right-3 top-3.5 h-4 w-4 text-green-500/50" />
                                    )}
                                </div>
                                {emailError && <p className="mt-1.5 text-xs text-red-400 ml-1">{emailError}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5 ml-1">
                                    <label htmlFor="password" className="block text-xs font-medium text-[#d4d4d8]">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs text-[#7c3aed] hover:text-[#8b5cf6] transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className={`bg-[#0f0f12] border-[#27272a] focus:border-[#7c3aed] focus:ring-[#7c3aed]/20 h-11 text-sm ${passwordError ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                {passwordError && <p className="mt-1.5 text-xs text-red-400 ml-1">{passwordError}</p>}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98]"
                            isLoading={isLoading}
                            disabled={!!emailError || !!passwordError || !email || !password}
                        >
                            Sign in
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-[#27272a]">
                        <div className="text-center text-xs text-[#71717a]">
                            <p className="mb-2">Don't have an account? <span className="text-[#e4e4e7] cursor-pointer hover:underline hover:text-white transition-colors">Sign up</span></p>
                            <p className="text-[10px] text-[#52525b]">Demo: Use any valid email & password (6+ chars)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
