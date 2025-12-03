async function readFile(path){
	const content = await fetch(path)
	if (!content.ok) throw new Error(`[Error] Cannot load component: ${path}`)
	return await content.text()
}

export async function init(root){
	const file = await readFile("index.html")
	const lines = file.split("\n")
	console.log(file)
	// for (let i = 0; i < lines.length; i++){
	// 	console.log(lines[i])
	// }
	root.innerHTML = ""
}
