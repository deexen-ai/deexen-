import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Header() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#09090B]/70 backdrop-blur-md sticky top-0 z-50 transition-all duration-200">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/dashboard')}>
                <img src="/deexenlogo.png" alt="Deexen" className="h-7" />
                <span className="text-[15px] font-medium text-zinc-100 tracking-tight">Deexen</span>
            </div>

            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-2 py-1 text-sm">
                    <img src={user.avatar} alt="" className="w-5 h-5 rounded-sm bg-[var(--bg-surface)]" />
                    <span className="text-xs max-w-[100px] truncate hidden sm:block text-[var(--text-secondary)]">{user.name}</span>
                </div>
            </div>
        </header>
    );
}
