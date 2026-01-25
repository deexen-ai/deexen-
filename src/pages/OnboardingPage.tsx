import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { Button } from '@/components/ui/Button';
import { Check, User, Briefcase, Code, Coffee, Globe, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for conditional classes
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const ROLES = [
    { id: 'student', label: 'Student', icon: User, description: 'Learning & building projects' },
    { id: 'professional', label: 'Professional', icon: Briefcase, description: 'Work & productivity' },
    { id: 'freelancer', label: 'Freelancer', icon: Globe, description: 'Client work management' },
    { id: 'hobbyist', label: 'Hobbyist', icon: Coffee, description: 'Coding for fun' },
    { id: 'other', label: 'Other', icon: Code, description: 'Something else' }
];

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState('');

    // Get theme from store
    const { theme, setTheme } = useThemeStore();
    const { updateUser } = useAuthStore();

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFinish = async () => {
        if (!selectedRole) return;

        setIsSubmitting(true);

        // Simulate a small network delay for better UX feel
        setTimeout(() => {
            updateUser({
                role: selectedRole,
                onboardingCompleted: true
            });
            navigate('/dashboard');
            setIsSubmitting(false);
        }, 800);
    };

    const nextStep = () => {
        if (step === 1 && selectedRole) setStep(2);
    };

    const prevStep = () => {
        if (step === 2) setStep(1);
    };

    return (
        <div className="min-h-screen w-full bg-[var(--bg-canvas)] flex items-center justify-center font-sans p-4 transition-colors duration-200">
            <div className="w-full max-w-2xl">

                {/* Progress Header */}
                <div className="mb-8 flex items-center justify-center space-x-2">
                    <div className={cn("h-2 w-12 rounded-full transition-colors", step >= 1 ? "bg-orange-500" : "bg-[var(--border-default)]")} />
                    <div className={cn("h-2 w-12 rounded-full transition-colors", step >= 2 ? "bg-orange-500" : "bg-[var(--border-default)]")} />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-2">
                        {step === 1 ? "Tell us about yourself" : "Choose your look"}
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        {step === 1 ? "We'll personalize your experience based on your role." : "Select the theme that fits your vibe."}
                    </p>
                </div>

                {/* Step 1: Role Selection */}
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-[fadeIn_0.3s_ease-out]">
                        {ROLES.map((role) => {
                            const Icon = role.icon;
                            const isSelected = selectedRole === role.id;
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                    className={cn(
                                        "relative p-4 rounded-xl border-2 text-left transition-all duration-200 group hover:border-orange-500/50 hover:bg-[var(--bg-surface-hover)]",
                                        isSelected
                                            ? "border-orange-500 bg-orange-500/5 ring-1 ring-orange-500/20"
                                            : "border-[var(--border-default)] bg-[var(--bg-surface)]"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            isSelected ? "bg-orange-500 text-white" : "bg-[var(--bg-canvas)] text-[var(--text-secondary)] group-hover:text-orange-500"
                                        )}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={cn("font-medium mb-1", isSelected ? "text-orange-500" : "text-[var(--text-primary)]")}>
                                                {role.label}
                                            </h3>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                {role.description}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-4 right-4 text-orange-500">
                                                <Check className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Step 2: Theme Selection */}
                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.3s_ease-out]">
                        {/* Light Mode */}
                        <button
                            onClick={() => setTheme('light')}
                            className={cn(
                                "relative p-6 rounded-xl border-2 text-left transition-all duration-200 group hover:border-orange-500/50",
                                theme === 'light'
                                    ? "border-orange-500 bg-white ring-2 ring-orange-500/20"
                                    : "border-gray-200 bg-gray-50 hover:bg-white"
                            )}
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-full aspect-video bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex flex-col gap-2 overflow-hidden">
                                    <div className="flex gap-2">
                                        <div className="w-1/4 h-full bg-gray-50 rounded" />
                                        <div className="flex-1 flex flex-col gap-2">
                                            <div className="h-2 w-1/3 bg-gray-200 rounded" />
                                            <div className="h-2 w-1/2 bg-gray-100 rounded" />
                                            <div className="flex-1 bg-gray-50 rounded mt-1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sun className={cn("w-5 h-5", theme === 'light' ? "text-orange-500" : "text-gray-500")} />
                                    <span className={cn("font-medium", theme === 'light' ? "text-orange-500" : "text-gray-900")}>Light Mode</span>
                                </div>
                            </div>
                        </button>

                        {/* Dark Mode */}
                        <button
                            onClick={() => setTheme('dark')}
                            className={cn(
                                "relative p-6 rounded-xl border-2 text-left transition-all duration-200 group hover:border-orange-500/50",
                                theme === 'dark'
                                    ? "border-orange-500 bg-[#0a0a0a] ring-2 ring-orange-500/20"
                                    : "border-gray-800 bg-[#141414] hover:bg-[#0a0a0a]"
                            )}
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-full aspect-video bg-[#0a0a0a] border border-gray-800 rounded-lg shadow-sm p-3 flex flex-col gap-2 overflow-hidden">
                                    <div className="flex gap-2">
                                        <div className="w-1/4 h-full bg-[#141414] rounded" />
                                        <div className="flex-1 flex flex-col gap-2">
                                            <div className="h-2 w-1/3 bg-[#262626] rounded" />
                                            <div className="h-2 w-1/2 bg-[#1f1f1f] rounded" />
                                            <div className="flex-1 bg-[#141414] rounded mt-1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Moon className={cn("w-5 h-5", theme === 'dark' ? "text-orange-500" : "text-gray-400")} />
                                    <span className={cn("font-medium", theme === 'dark' ? "text-orange-500" : "text-gray-100")}>Dark Mode</span>
                                </div>
                            </div>
                        </button>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="mt-10 flex justify-between items-center">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={prevStep} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    ) : (
                        <div /> /* Spacer */
                    )}

                    {step === 1 ? (
                        <Button
                            onClick={nextStep}
                            disabled={!selectedRole}
                            className="bg-orange-500 hover:bg-orange-600 text-white min-w-[120px]"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleFinish}
                            isLoading={isSubmitting}
                            className="bg-orange-500 hover:bg-orange-600 text-white min-w-[120px]"
                        >
                            Finish Setup
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
