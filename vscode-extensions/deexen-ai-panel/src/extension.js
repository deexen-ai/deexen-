const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Deexen AI Extension is active');

    const provider = new DeexenAIViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(DeexenAIViewProvider.viewType, provider)
    );
}

class DeexenAIViewProvider {
    static viewType = 'deexenAIView';

    /**
     * @param {vscode.Uri} _extensionUri
     */
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }

    /**
     * @param {vscode.WebviewView} webviewView
     * @param {vscode.WebviewViewResolveContext} context
     * @param {vscode.CancellationToken} _token
     */
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview();

        // Listen for messages from the Webview (React)
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'READY':
                    console.log("Deexen AI Webview is ready.");
                    // In a web context, we can ping the parent window to send the auth token
                    webviewView.webview.postMessage({ type: 'REQUEST_TOKEN' });
                    break;
                case 'INSERT_CODE':
                    const editor = vscode.window.activeTextEditor;
                    if (editor) {
                        editor.edit(editBuilder => {
                            editBuilder.insert(editor.selection.active, data.code);
                        });
                    }
                    break;
            }
        });
    }

    _getHtmlForWebview() {
        // We embed the compiled AIPanel React component here.
        // For development, we can point it to the vite dev server, but in production
        // we serve the built static UI. We will use a dynamic iframe approach
        // that talks to the parent application window.
        
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Deexen AI</title>
                <style>
                    body, html { margin: 0; padding: 0; height: 100%; width: 100%; background-color: var(--vscode-sideBar-background); }
                    iframe { border: none; width: 100%; height: 100%; }
                </style>
            </head>
            <body>
                <!-- We load the AI Panel route from our React app via the parent Proxy -->
                <!-- The proxy will be http://localhost:5173/ai-panel in dev, but when running
                     inside the iframe, window.parent logic handles auth -->
                <script>
                    const vscode = acquireVsCodeApi();
                    
                    // Listen to the iframe inner context and pass it to VS Code
                    window.addEventListener('message', event => {
                        const message = event.data;
                        if (message.type === 'INSERT_CODE') {
                            vscode.postMessage({ type: 'INSERT_CODE', code: message.code });
                        }
                    });

                    // We let the parent React application (the shell) know that the VS Code iframe 
                    // has booted the AI Panel. The shell will then dynamically inject the React code or
                    // send the user's auth token over.
                    window.parent.postMessage({ type: 'DEEXEN_VSCODE_AI_READY' }, '*');
                </script>
                
                <h3 style="color: #f97316; font-family: sans-serif; text-align: center; margin-top: 50px;">
                    Deexen AI
                </h3>
                <p style="text-align: center; color: var(--vscode-foreground); opacity: 0.7; font-family: sans-serif; font-size: 12px; padding: 0 20px;">
                    Loading AI Assistant securely from Deexen Core...
                </p>
                
                <script>
                    // Listen for the shell sending the actual React application URL + Token
                    window.addEventListener('message', event => {
                        if (event.data.type === 'DEEXEN_LOAD_AI') {
                            document.body.innerHTML = '<iframe src="' + event.data.url + '"></iframe>';
                        }
                    });
                </script>
            </body>
            </html>`;
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
