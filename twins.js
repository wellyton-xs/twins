import fs from "fs"
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import * as path from 'path'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)
const arg = process.argv.slice(2)

/*FLAGS */
let flags = {
    verbose: false,
    debug: false
}

let source = ""
const Config = await read_config_file("twins.config.json")

if (!Config) throw new Error("Error: No config file provided.")
if (Config.no_src == false) source = "src/"

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
    console.console.log()(file)
    // for (let name = ; i = 0; i < lines.length; i++){
    // console.log(lines[i])
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

export function get_absolute_path(filePath) {
    const absolute_path = path.join(__dirname, filePath)
    return absolute_path
}

export async function read_path(dir, recursive){
    let source_tree = {}
    if (recursive === true){
        let content = read_dir_content(dir)
        for(let i = 0; i < content.length; i++){
            if(isDir(content[i])){}
        }
    } else {
        let result = []
        const absolute_path = get_absolute_path("./")
        const content = await read_dir_content(dir)
        content.forEach((x) => {
            result.push(`${absolute_path}${dir}/${x}`)
        })

        return result
    }
}

export async function read_config_file(filePath) {
    const absolute_path = get_absolute_path(filePath)

    const data = await readFile(absolute_path, 'utf8')
    return JSON.parse(data)
}

export async function read_file(filePath) {
    try {
        const data = await readFile(filePath, 'utf8')
        return data
    } catch (error) {
        let msg = error.message
        console.error(`[ERROR] ${msg}`)
    }
}

export function debug(value) {
    if (flags.debug === true){
        console.log(value)
    }
}

export function log(msg, value){
    let message = `[INFO]: ${msg}`

    if (value)
        message = `[INFO]: ${msg} ${value}`

    console.log(message)

}

export function error(msg, value){
    let message = `[ERROR]: ${msg}`

    if (value)
        message = `[ERROR]: ${msg} ${value}`

    console.log(message)
}

export function clean_lines(text) {
    const normalized = text.replaceAll("\r\n", "\n").replaceAll("\r", "\n");

    return normalized
        .split("\n")
        .map(line => line.trim())
        .filter(line => line);
}

export function check_arg(args, value){
    for (const arg of args) {
        if(arg === value) return true;
    }
}

export function write(filename, content){
    const path = `./build/${filename}`
    fs.writeFile(path, content, err => {
        if (err) {
            console.error(err);
        } else {
            log("File ${filename} created at {}")
        }
    });
}

export function starts_with_lower_ascii_letter(str) {
    if (!str || str.length === 0) return false

    const code = str.charCodeAt(0)

    return code >= 97 && code <= 122
}

export function starts_with_upper_ascii_letter(str) {
    if (!str || str.length === 0) return false

    const code = str.charCodeAt(0)

    return code >= 65 && code <= 90
}

export function tokenize(str){
    const result = clean_lines(str).join(' ').split(' ')
    const name = result[0].slice(1)
    let tokens = {}
    tokens[name] = {
        params: result.slice(1)
    }
    return tokens
}

export function convert_to_html(text){
    console.log("convert to html: " + text)
}

export function handle_comp_call(pages, page_name, components){
    for(let i = 0; i < pages[page_name].content.length; i++){
        const line = pages[page_name].content[i];

        if (!line) continue;
        if (line[0] === ":") {
            debug(`Comp Call ${line}`);

            const compname = line.slice(1).split(' ')[0];

            if(starts_with_lower_ascii_letter(compname)) {
                convert_to_html(line);
                continue
            }

            if (!starts_with_upper_ascii_letter(compname)) {
                error(`Nome inválido de componente: "${compname}"`);
                continue;
            }

            const comp = components[compname];

            if (!comp) {
                error(`Componente "${compname}" não encontrado. Pulando.`);
                continue;
            }

            const token = tokenize(line)

            if (token) {
                /* TODO(pass params to a component)
                 * 1 ler chamada de componente [x]
                 * 2 tokenizar chamada de componente [x]
                 * 3 separar nome do componente chamado e parâmetros que serão passados [x]
                 * 4 substituir conteúdo de cada parâmetro passado na chamada no local correspondente do componente []
                 * */

                console.log("component", comp)
                console.log("token", token)

                if (token.params) {
                    console.log(token[compname].params)
                }
            }

            if(!token) continue

            pages[page_name].content.splice(i, 1, ...comp.content);

            i += comp.content.length - 1;

            debug(`Inserted component "${compname}" at line ${i - (comp.content.length - 1)}`);
        }
    }
}

// TODO: Implement a AST for advanced manipulation on code
// TODO: Improve single responsability of the code

if (arg[0] == 'build'){

    if (check_arg(arg, '-v')) flags.verbose = true
    if (check_arg(arg, '-d')) flags.debug = true

    const page_dir       = Config.page
    const build_dir      = Config.build
    const public_dir     = Config.public
    const static_dir     = Config.static
    const components_dir = Config.components

    log("Veryfing project basic structure")
    if (!page_dir) throw new Error("Error: No HTMLDir dir provided.")
    if (!build_dir) throw new Error("Error: No Build Dir dir provided.")

    log("Loading Files")
    const page_list_from_dir      = await read_path(page_dir)
    const component_list_from_dir = await read_path(components_dir)

    let pages = {}
    let components = {}

    for (const component of component_list_from_dir){
        let result = await read_file(component)
        let component_basename = path.basename(component)
        let component_name = component_basename.slice(0, -5)

        components[component_name] = {
            name: component_name,
            path: component,
            content: clean_lines(result)
        }

        handle_comp_call(components, component_name, components)
        debug(components[component_name].content);
    }

    for (const page of page_list_from_dir){
        let result = await read_file(page)
        let page_basename = path.basename(page)
        let page_name = page_basename.slice(0, -5)

        pages[page_name] = {
            name: page_name,
            path: page,
            content: clean_lines(result)
        }

        log("Loaded:", pages[page_name].path)

        handle_comp_call(pages, page_name, components)

        debug(pages[page_name].content);
        write(page_basename, pages[page_name].content.join(''))
    }
}
