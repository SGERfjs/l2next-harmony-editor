import * as vscode from 'vscode';
import * as path from 'path';
import { ICollectionDirectoryNode } from './interfaces/collection-directory-node'

export class CollectionTreeNode extends vscode.TreeItem {
	constructor(public readonly node: ICollectionDirectoryNode) {
		super(node.label, node.collapsibleState);
	}

	get tooltip(): string {
		if (!this.node.tooltip)
		{
			return '';
		}
		
		return `${this.label}-${this.node.tooltip}`;
	}

	get resourceUri(): vscode.Uri {
		return this.node.uri;
	}

	get description(): string {

		if (!this.node.description)
		{
			return '';
		}

		return this.node.description;
	}

	get iconPath()
	{
		if (!this.node.icon) {
			return false;
		}

		return this.node.icon;
	}

	contextValue = 'l2clientTreeNode';
}