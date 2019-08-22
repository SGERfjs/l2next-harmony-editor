import * as vscode from 'vscode';
import { ICommand } from './interfaces/command';

export class CommandFactory
{
    private static commandList: Set<vscode.Disposable> = new Set();

	static register(command: ICommand, context?: vscode.ExtensionContext): vscode.Disposable {
		let disposable = vscode.commands.registerCommand(command.id, command.run, context);
		CommandFactory.commandList.add(disposable);
		return disposable;
	}

	static disposeAll(context: vscode.ExtensionContext): void {
		CommandFactory.commandList.forEach((disposable: vscode.Disposable) => {
			context.subscriptions.push(disposable);
		});
	}
}
