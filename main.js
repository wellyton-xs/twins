import * as T from './twins/twins.js';

(async () => {
	const root = document.getElementById("root")
	if (root != null){
		await T.init(root)
	} else {
		console.log("[ERROR]: root does not exist")
	}
})()
