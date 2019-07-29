import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ICollectionDirectoryNode } from './interfaces/collection-directory-node';
import { CollectionTreeNode } from './collection-tree-node'
import { ICollectionDirectory } from './interfaces/collection-directory';
import { ETreeLevelDepth } from './enums/tree-level-depth';
import { IClientDirectory } from './interfaces/client-directory';

export class CollectionTreeProvider implements vscode.TreeDataProvider<CollectionTreeNode>
{
	private _onDidChangeTreeData: vscode.EventEmitter<CollectionTreeNode | undefined> = new vscode.EventEmitter<CollectionTreeNode | undefined>();
	readonly onDidChangeTreeData: vscode.Event<CollectionTreeNode | undefined> = this._onDidChangeTreeData.event;

    getFormattedExtensions(array: string[]): string
    {
        let formatted = '';

        if (array.length > 1) {
            array.forEach((ext, index) => {
                 formatted += index == (array.length - 1) ? ext :`${ext} | `;
            });
        } else {
            formatted = array.toString();
        }

        return formatted;
    }

    // Todo utils
	isEmptyWorkspace(): Boolean {
        if (this.workspaceRoot) {
            return this.workspaceRoot.length == 0;
        }

        return true;
    }
    
    /**
     * TODO Implement checksum validation and schema validation support later.
     */
    isValidL2Client(clientFolder: vscode.WorkspaceFolder): Boolean
    {
        let required = vscode.workspace.getConfiguration('lineage2dev.client.directories').get<IClientDirectory[]>('required');

        if (required && required.length > 0)
        {
            let isValid = false;

            required.forEach(dir => {
                const isValidDirectory = this.pathExists(path.join(clientFolder.uri.fsPath, dir.path));
                const isValidFiles = dir.enableFileValidation && dir.files && dir.files.every(file => {
                    this.pathExists(path.join(clientFolder.uri.fsPath, dir.path, file))
                });

                isValid = isValidFiles || isValidDirectory;
            });

            return isValid;
        }
        return false;
    }

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
	
	getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(element?: CollectionTreeNode | undefined): vscode.ProviderResult<CollectionTreeNode[]> {
		if (this.isEmptyWorkspace()) {
			vscode.window.showWarningMessage('Workspace is empty, Lineage2 clients are not found.');
			return Promise.resolve([]);
		}
	
        const nodes:CollectionTreeNode[] = [];

        if (!element) {
            // First level.
            this.addClientRoot(nodes);
        } else {

            if (element.node.depth && element.node.depth == 1) {
                // Second level.
                this.addClientFolders(nodes, element);
            } else {
                // Third level.
                this.addClientFiles(nodes, element);
            }

        }

		return nodes;
    }
    
    private addClientRoot(nodes: CollectionTreeNode[], element?: CollectionTreeNode | undefined)
    {
        if(!this.workspaceRoot)
        {
           return;
        }

        this.workspaceRoot.forEach(dir => {

            if (!this.isValidL2Client(dir)) {
                const message = `
                    Cannot add ${dir.name} directory to workspace.
                    It seems that this directory is not a valid Lineage2 game client.
                    Please check settings for more info on mandatory folders & files`;

                return vscode.window.showWarningMessage(message)
            }
           
            const props: ICollectionDirectoryNode = {
                label: dir.name,
                collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                uri: dir.uri,
                depth: ETreeLevelDepth.CLIENT_ROOT_FOLDER,
                icon: path.join(dir.uri.fsPath, 'lineage2.ico')
            }

            nodes.push(new CollectionTreeNode(props));
        });
    }

    private addClientFolders(nodes: CollectionTreeNode[], element?: CollectionTreeNode | undefined)
    {
        if (!element) {
            return;
        }

        let directories = vscode.workspace.getConfiguration('lineage2dev.client.directories').get<ICollectionDirectory[]>('collections');

        if (directories && directories.length > 0) {
            directories.forEach(dir => {
                const props: ICollectionDirectoryNode = {
                    label: dir.friendlyName,
                    description: this.getFormattedExtensions(dir.extensions),
                    tooltip: dir.description,
                    extensions: dir.extensions,
                    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                    uri: element.resourceUri.with({
                        path: path.join(element.resourceUri.fsPath, dir.path)
                    }),
                    depth: ETreeLevelDepth.CLIENT_COLLECTIONS
                }

                nodes.push(new CollectionTreeNode(props));
            });
        }
    }

    private addClientFiles(nodes: CollectionTreeNode[], element?: CollectionTreeNode | undefined)
    {
        if (!element) {
            return;
        }

        fs.readdirSync(element.resourceUri.fsPath).forEach(item => {
            if (fs.lstatSync(path.join(element.resourceUri.fsPath, item)).isDirectory()) {
                const props: ICollectionDirectoryNode = {
                    label: item,
                    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                    uri: element.resourceUri.with({
                        path: path.join(element.resourceUri.fsPath, item)
                    }),
                    depth: ETreeLevelDepth.CLIENT_FILES_AND_FOLDERS
                }

                nodes.push(new CollectionTreeNode(props));
            }

            if (fs.lstatSync(path.join(element.resourceUri.fsPath, item)).isFile()) {

                if (element.node.extensions && element.node.extensions.includes(path.extname(item)))
                {
                    const props: ICollectionDirectoryNode = {
                        label: item,
                        collapsibleState: vscode.TreeItemCollapsibleState.None,
                        uri: element.resourceUri.with({
                            path: path.join(element.resourceUri.fsPath, item)
                        }),
                        depth: ETreeLevelDepth.CLIENT_FILES_AND_FOLDERS
                    }
    
                    nodes.push(new CollectionTreeNode(props));
                }
            }
        });
    }

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}

	constructor(private workspaceRoot: vscode.WorkspaceFolder[] | undefined) {
	}
}