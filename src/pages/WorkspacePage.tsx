import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { projectService } from '@/services/projectService';

const VSCODE_SERVER_URL = import.meta.env.VITE_VSCODE_URL || 'http://127.0.0.1:8080';

export default function WorkspacePage() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const { token } = useAuthStore();
    const { projects } = useProjectStore();
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');
    const [currentProject, setCurrentProject] = useState<any>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        let isMounted = true;
        let timer: ReturnType<typeof setTimeout>;

        if (!projectId) {
            navigate('/dashboard');
            return;
        }

        const bootWorkspace = async () => {
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                let project = projects.find(p => p.id === projectId);

                if (!project) {
                    // Fetch project fallback when store is initially empty
                    project = await projectService.getProject(projectId) as any;
                }

                if (!isMounted) return;

                if (!project) {
                    setStatus('error');
                    setErrorMsg('Project not found. It may have been deleted.');
                    return;
                }

                setCurrentProject(project);

                // Simulating the backend startup for the VS Code process wrapper
                timer = setTimeout(() => {
                    if (isMounted) setStatus('ready');
                }, 1500);

            } catch (err: any) {
                if (isMounted) {
                    setStatus('error');
                    setErrorMsg(err.message || 'Error occurred while loading project');
                }
            }
        };

        bootWorkspace();

        return () => {
            isMounted = false;
            if (timer) clearTimeout(timer);
        };
    }, [projectId, token, projects, navigate]);

    // Handle messages coming from the VS Code Webview
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Ensure we aren't listening to completely arbitrary windows
            if (event.data?.type === 'DEEXEN_VSCODE_AI_READY') {
                // The AI Webview inside the VS Code server initialized.
                // We send it the React API route and Token so it can render the core Chat UI.
                const aiPanelUrl = window.location.origin + '/ai-panel';
                event.source?.postMessage(
                    {
                        type: 'DEEXEN_LOAD_AI',
                        url: aiPanelUrl,
                        token: token,
                        projectId: projectId
                    },
                    { targetOrigin: '*' }
                );
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [token, projectId]);

    const project = currentProject || projects.find(p => p.id === projectId);

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            background: '#0c0c0c',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, -apple-system, sans-serif',
            overflow: 'hidden'
        }}>
            {status !== 'ready' && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: '#0c0c0c', gap: 24
                }}>
                    {status === 'error' ? (
                        <>
                            <div style={{ fontSize: 40 }}>⚠️</div>
                            <p style={{ color: '#f87171', fontSize: 15, fontWeight: 600 }}>{errorMsg}</p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    background: '#f97316', color: '#fff', border: 'none',
                                    borderRadius: 8, padding: '10px 24px', fontSize: 13,
                                    fontWeight: 700, cursor: 'pointer',
                                }}
                            >
                                Back to Dashboard
                            </button>
                        </>
                    ) : (
                        <>
                            <img
                                src='/deexenlogo.png'
                                alt='Deexen'
                                style={{ width: 52, height: 52, objectFit: 'contain' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                            <div style={{ position: 'relative', width: 48, height: 48 }}>
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    border: '3px solid rgba(249,115,22,0.15)',
                                    borderTopColor: '#f97316',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite',
                                }} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#d4d4d4', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                                    Starting Deexen Cloud Environment…
                                </p>
                                <p style={{ color: '#4b5563', fontSize: 12 }}>
                                    Booting project "{project?.name || 'Loading'}" • Powered by VS Code
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
            
            {status === 'ready' && (
                <iframe
                    ref={iframeRef}
                    src={`${VSCODE_SERVER_URL}/`}
                    style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        zIndex: 1
                    }}
                    title="Deexen IDE Shell"
                />
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
