// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { interfaces } from 'mocha';

// TODO Extract into commands module.

interface ICommand
{
	/** Command ID should always start with 'extension.%your_command_name%' */
	id: string;

	/** The command will execute this functor when called. */
	execFunctor: () => void;
}

class LaunchGame implements ICommand
{
	id = 'extension.launchGame';

	execFunctor() {
		// Show info message.
		vscode.window.showInformationMessage('Lineage2 Game : launched.');	
	}
}

class LaunchDevmode implements ICommand
{
	id = 'extension.launchDevmode';

	execFunctor() {
		// Show info message.
		vscode.window.showInformationMessage('Lineage2 Devmode : launched.');	
	}
}


class CommandFactory
{
	private static commandList: Set<vscode.Disposable> = new Set();

	static register(command: ICommand): vscode.Disposable {
		let disposable = vscode.commands.registerCommand(command.id, command.execFunctor);
		CommandFactory.commandList.add(disposable);
		return disposable;
	}

	static disposeAll(context: vscode.ExtensionContext): void {
		CommandFactory.commandList.forEach((disposable: vscode.Disposable) => {
			context.subscriptions.push(disposable);
		});
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Welcome to Lineage2Dev integrated toolkit.');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	CommandFactory.register(new LaunchGame);
	CommandFactory.register(new LaunchDevmode);

	// Dispose all commands in the following context
	CommandFactory.disposeAll(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}

