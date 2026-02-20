import type { Extension } from '@/services/extensionService';
import { Download, Box } from 'lucide-react';

interface ExtensionCardProps {
    extension: Extension;
    onInstall: (ext: Extension) => void;
}

export function ExtensionCard({ extension, onInstall }: ExtensionCardProps) {
    const latestVersion = extension.versions.length > 0
        ? extension.versions[extension.versions.length - 1].version
        : '0.0.0';

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 flex flex-col hover:border-violet-500 transition-colors">
            <div className="flex items-start justify-between mb-4">
                <div className="bg-violet-100 dark:bg-violet-900/30 p-2 rounded-lg">
                    {extension.icon_url ? (
                        <img src={extension.icon_url} alt={extension.display_name} className="w-8 h-8 rounded" />
                    ) : (
                        <Box className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                    )}
                </div>
                <div className="flex gap-2">
                    <span className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                        v{latestVersion}
                    </span>
                </div>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
                {extension.display_name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
                {extension.description}
            </p>

            <div className="mt-auto flex items-center justify-between">
                <div className="text-xs text-gray-500">
                    by <span className="font-medium text-gray-700 dark:text-gray-300">{extension.name.split('.')[0]}</span>
                </div>
                <button
                    onClick={() => onInstall(extension)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-md text-xs font-medium hover:opacity-90 transition-opacity"
                >
                    <Download className="w-3.5 h-3.5" />
                    Install
                </button>
            </div>
        </div>
    );
}
