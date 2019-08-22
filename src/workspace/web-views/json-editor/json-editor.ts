import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { IWebview } from '../../../shared/intefaces/web-view';
//import { JsonEditor } from './components/editor';
import { IWebComponent } from '../../../shared/intefaces/web-component';

class JsonEditorOptions {
	filename: string = '';
	context: vscode.ExtensionContext | undefined;
	data: Object = {};
}

export class JsonEditor implements IWebview {
	id: string = 'webviews.jsonEditor';
	title: string = 'Editor: ';

	panel: vscode.WebviewPanel | undefined;
	component: IWebComponent | undefined;
	context: vscode.ExtensionContext | undefined;

	register(context: vscode.ExtensionContext): void {
		this.context = context;

		vscode.commands.registerCommand(this.id, () => {
			// Create and show a new webview.
			this.open();
		});
	}

	open(): void {
		this.createPanel();
	}

	close(): void {
		delete this.panel;
	}

	createPanel(): vscode.WebviewPanel | undefined {
		if (this.context) {
			const webViewPath = path.join(this.context.extensionPath, 'src', 'workspace', 'web-views', 'json-editor');

			this.panel = vscode.window.createWebviewPanel(
				this.id,
				this.title,
				vscode.ViewColumn.One, // Editor column to show the new webview panel in.
				{
					enableScripts: true,
					localResourceRoots: [
						vscode.Uri.file(webViewPath)
					]
				}
			);

			// TODO Use factory pattern.
			let buffer: string;
			const indexPath = vscode.Uri.file(path.join(webViewPath, 'index.html'));
			const indexSrc = indexPath.with({ scheme: 'vscode-resource' });

			if (fs.existsSync(indexSrc.fsPath)) {
				buffer = fs.readFileSync(indexSrc.fsPath, "utf8");
				this.panel.webview.html = buffer;
			}

			return this.panel;
		}
	}
}