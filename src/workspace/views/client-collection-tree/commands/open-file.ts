import { ICommand } from '../../../../shared/commands/interfaces/command'
import * as vscode from 'vscode';
import { FileUtils } from '../../../../shared/utils/file-utils'

export class OpenFile implements ICommand {
	id = 'extension.collectionTree.open';

	run(args: any) {

		if (!args.element || !args.item) {
			return;
		}

		const context = (this as unknown) as vscode.ExtensionContext;

		if (!context.extensionPath) {
			return;
		}

		// Get file extension..
		const ext = FileUtils.getFileExtension(args.item);

		switch (ext) {
			case '.dat':
				vscode.commands.executeCommand('webviews.jsonEditor');
				break;
			default:
				vscode.window.showInformationMessage(`You tried to open a\n ${ext} which is not supported yet.`);
		}
	}
}