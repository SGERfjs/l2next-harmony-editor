import * as vscode from 'vscode';
import { LaunchGame } from './commands/launch-game';
import { LaunchDevmode } from './commands/launch-devmode';
import { CommandFactory } from '../../../shared/commands/command-factory'

export class L2ClientLauncherWnd
{
    static register(context?: vscode.ExtensionContext)
    {
      	// Register commands.
        CommandFactory.register(new LaunchGame);
        CommandFactory.register(new LaunchDevmode);

        // Dispose all commands in the following context
        if (context) {
            CommandFactory.disposeAll(context);
        }
    }
}