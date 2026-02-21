import { ExtensionList } from '@/components/marketplace/ExtensionList';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MarketplacePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <header className="border-b border-gray-200 dark:border-zinc-800 py-4 px-6">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 dark:text-white" />
                    </Link>
                    <span className="font-semibold dark:text-white">Back to Dashboard</span>
                </div>
            </header>
            <main>
                <ExtensionList />
            </main>
        </div>
    );
}
