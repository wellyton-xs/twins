import fs from "fs"
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import * as path from 'path'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

export function read_dir_content(dir){
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, content) => {
            if (err) return reject(err)
            resolve(content)
        });
    })
}

export function isDir(dir){
    fs.lstat(dir, (err, stats) => {
        if(err) return console.log(err);
        return stats.isDirectory();
    });
}

export function read_path(dir, recursive){
    let source_tree = {}
    if (recursive === true){
        let content = read_dir_content(dir)
        for(let i = 0; i < content.length; i++){
            if(isDir(content[i])){}
        }
    } else {
        return read_dir_content(dir)
    }
}

export function get_absolute_path(filePath) {
    const absolute_path = path.join(__dirname, filePath)
    return absolute_path
}

export async function read_config_file(filePath) {
    const absolute_path = get_absolute_path(filePath)

    const data = await readFile(absolute_path, 'utf8')
    return JSON.parse(data)
}

export async function read_file(filePath) {
    const absolute_path = get_absolute_path(filePath)
    const content = await readFile(absolute_path, 'utf8')
    return content
}
