import * as vscode from 'vscode';
import { IWebComponent } from './web-component';

export interface IWebview {
    id: string;
    title: string;
    panel: vscode.WebviewPanel | undefined;
    component: IWebComponent | undefined;
    register(context: vscode.ExtensionContext): void;
    open(): void;
    close(): void;
    createPanel(): vscode.WebviewPanel | undefined
}