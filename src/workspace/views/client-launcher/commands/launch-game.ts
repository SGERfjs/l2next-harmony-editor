import { ICommand } from '../../../../shared/commands/interfaces/command'
import * as vscode from 'vscode';

export class LaunchGame implements ICommand
{
	id = 'extension.launchGame';

	run() {
		// Show info message.
		vscode.window.showInformationMessage('Lineage2 Game : launched.');	
	}
}