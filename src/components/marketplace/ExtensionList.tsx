import { useEffect, useState } from 'react';
import { extensionService, type Extension } from '@/services/extensionService';
import { ExtensionCard } from './ExtensionCard';
import { Search, Loader2 } from 'lucide-react';

export function ExtensionList() {
    const [extensions, setExtensions] = useState<Extension[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchExtensions();
    }, []);

    async function fetchExtensions(searchVal?: string) {
        setLoading(true);
        try {
            const data = await extensionService.listExtensions(searchVal);
            setExtensions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchExtensions(query);
    };

    const handleInstall = (ext: Extension) => {
        const latest = ext.versions[ext.versions.length - 1];
        extensionService.installExtension(ext.id, latest.version);
        alert(`Request sent to install ${ext.display_name}`);
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Extension Marketplace</h1>
                    <p className="text-gray-500 dark:text-gray-400">Discover and install extensions for Deexen.</p>
                </div>
                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search extensions..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                    />
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {extensions.map(ext => (
                        <ExtensionCard key={ext.id} extension={ext} onInstall={handleInstall} />
                    ))}
                    {extensions.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No extensions found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
