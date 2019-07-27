import * as vscode from 'vscode';
import { CollectionTreeProvider } from './collection-tree-provider';

export class CollectionTreeWnd
{
    static register(context?: vscode.ExtensionContext)
    {
        const provider = new CollectionTreeProvider(vscode.workspace.workspaceFolders);
        vscode.window.registerTreeDataProvider('collection-tree', provider);
    }
}