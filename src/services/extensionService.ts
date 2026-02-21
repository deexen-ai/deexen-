import { apiClient } from './apiClient';

export interface Extension {
    id: number;
    name: string;
    display_name: string;
    description: string;
    icon_url?: string;
    publisher_id: number;
    versions: ExtensionVersion[];
}

export interface ExtensionVersion {
    version: string;
    file_path: string;
    downloads: number;
}

export const extensionService = {
    async listExtensions(query?: string): Promise<Extension[]> {
        const params = query ? `?q=${encodeURIComponent(query)}` : '';
        return apiClient.get<Extension[]>(`/marketplace/${params}`);
    },

    async getExtension(id: number): Promise<Extension> {
        return apiClient.get<Extension>(`/marketplace/${id}`);
    },

    async installExtension(extensionId: number, version: string): Promise<void> {
        await apiClient.post('/marketplace/install', { extension_id: extensionId, version });
    }
};
