import * as vscode from 'vscode';
import { CollectionTreeProvider } from './collection-tree-provider';
import { CommandFactory } from '../../../shared/commands/command-factory';
import { OpenFile } from './commands/open-file';

export class CollectionTreeWnd {
    static register(context?: vscode.ExtensionContext) {
        // Providers.
        const provider = new CollectionTreeProvider(vscode.workspace.workspaceFolders);
        vscode.window.registerTreeDataProvider('collection-tree', provider);
        
        // Commands.
        CommandFactory.register(new OpenFile, context);

        // Dispose all commands in the following context
        if (context) {
            CommandFactory.disposeAll(context);
        }
    }
}