import AIPanel from '@/components/ai-panel/AIPanel';
import { useEffect, useState } from 'react';

/**
 * This page is purely used to serve the Deexen AI Panel securely
 * inside the VS Code Web Server via an iframe.
 */
export default function AIPanelPage() {
    // When rendered inside VS Code, the shell (WorkspacePage) will send the Auth Token via window.postMessage
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'DEEXEN_LOAD_AI' && event.data.token) {
                setToken(event.data.token);
                // Also could set project ID if needed
            }
        };
        window.addEventListener('message', handleMessage);
        
        // Let the parent WorkspacePage know we're ready to receive the token
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'DEEXEN_VSCODE_AI_READY_IFRAME' }, '*');
        }

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Also support fallback dev token pulling for testing outside iframe
    useEffect(() => {
        if (!token) {
            const rawData = localStorage.getItem('auth-storage');
            if (rawData) {
                try {
                    const parsed = JSON.parse(rawData);
                    if (parsed.state?.token) setToken(parsed.state.token);
                } catch { }
            }
        }
    }, [token]);

    return (
        <div style={{ width: '100%', height: '100vh', background: '#0c0c0c' }}>
            <AIPanel />
        </div>
    );
}
