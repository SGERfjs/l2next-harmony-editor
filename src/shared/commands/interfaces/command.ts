import * as vscode from 'vscode';

export interface ICommand
{
	/** TODO Command ID should always start with 'extension.%your_command_name%' */
	id: string;

	/** The command will execute this functor when called. */
	run: (args: any) => void;
}