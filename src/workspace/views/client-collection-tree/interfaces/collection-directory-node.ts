import * as vscode from 'vscode';

export interface ICollectionDirectoryNode 
{
	readonly label: string;
	readonly tooltip?: string;
	readonly description?: string;
	readonly collapsibleState: vscode.TreeItemCollapsibleState;
	readonly uri: vscode.Uri;
	readonly icon?: string;
	readonly depth?: number;
	readonly extensions?: string[];
	readonly command?: vscode.Command;
}