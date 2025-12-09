async function readFile(path){
	const content = await fetch(path)
	if (!content.ok) throw new Error(`[Error] Cannot load component: ${path}`)
	return await content.text()
}

async function readSourceTree() {
    const source = "src/"
    const html = `${source}/html`
}

/* INIT
 * This function loads content from build to index.html
 */
export async function init(root){
	const file = await readFile("page.html")
	const lines = file.split("\n")
	console.log(file)
	// for (let i = 0; i < lines.length; i++){
	// 	console.log(lines[i])
	// }
	root.innerHTML = ""
}
