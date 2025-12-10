import fs from "fs"
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import * as path from 'path'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)
const arg = process.argv.slice(2)

async function read_file_from_browser(path){
	const content = await fetch(path)
	if (!content.ok) throw new Error(`[Error] Cannot load component: ${path}`)
	return await content.text()
}

/* INIT undone
 * This function loads content from build to index.html
 */
export async function init(root){
	const file = await read_file_from_browser("page.html")
	const lines = file.split("\n")
	console.log(file)
	// for (let i = 0; i < lines.length; i++){
	// 	console.log(lines[i])
	// }
	root.innerHTML = ""
}

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

if (arg[0] == 'build')

const Config = await read_config_file("twins.config.json")
const source = get_absolute_path("../")
if (!Config) throw new Error("Error: No config file provided.")

const Page       = Config.page
const Build      = Config.build
const Public     = Config.public
const Static     = Config.static
const Components = Config.components

if (!Page) throw new Error("Error: No HTMLDir dir provided.")
if (!Build) throw new Error("Error: No Build Dir dir provided.")

const pages = await read_path(Page)
const components = await read_path(Components)
const file = await read_file(pages[0])
