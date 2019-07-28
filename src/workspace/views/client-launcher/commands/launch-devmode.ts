import { ICommand } from '../../../../shared/commands/interfaces/command';
import * as vscode from 'vscode';

export class LaunchDevmode implements ICommand
{
	id = 'extension.launchDevmode';

	run() {
		// Show info message.
		vscode.window.showInformationMessage('Lineage2 Devmode : launched.');	
	}
}