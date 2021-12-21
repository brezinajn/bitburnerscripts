// sh killWorm.js -t 1 home
/** @param {NS} ns **/
export async function main(ns) {
	async function uploadCopy(destination, hostname) {

		if (!ns.fileExists("pwnWorm.js", destination)) return

		ns.print("Spreading to: " + destination)
		console.log("Spreading to: " + destination)
		const result = await ns.scp(["killWorm.js"], hostname, destination)
		console.log("Result: ", result)
		// if (result) {
		ns.print("Spreaded. Launching.")
		console.log("Spreaded. Launching.")
		ns.exec("killWorm.js", destination, 1, destination)
		// }
	}


	const hostname = ns.args[0]

	if (!hostname || hostname == "") throw Error("Hostname is empty")

	ns.print("Current: " + hostname)

	const targets = ns.scan(hostname).filter((target) => target != "home")
	ns.print("Targets: " + targets)

	const files = ["hack.js", "pwnWorm.js", "analyzer.js", "pwn.js", "spread.js", "killWormSpread.js", "worm.js"]

	ns.print("Killing: " + hostname)
	console.log("Killing: " + hostname)
	ns.scriptKill("hack.js", hostname)

	if (hostname != "home" && hostname != "") {
		files.forEach((file) => ns.rm(file))
	}

	console.log(targets)
	for (const target of targets) {
		await uploadCopy(target, hostname)
	}
}