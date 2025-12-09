import {
    read_file,
    read_path,
    read_config_file,
    get_absolute_path
} from "./lib.js"

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
