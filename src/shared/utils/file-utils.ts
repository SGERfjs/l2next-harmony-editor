import * as path from 'path';
import * as fs from 'fs';


export class FileUtils {
    static getFileExtension(filename: string) {
        return path.extname(filename);
    }

    static getFileContents(path: string): Thenable<Buffer> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                
                if (err) {
                    reject(err);
                }
                
                resolve(data);
            });
        });
    }

    static getFileContentsSync(path: string): Buffer {
        return fs.readFileSync(path);
    }
}