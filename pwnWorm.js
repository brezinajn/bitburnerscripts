// sh pwnWorm.js -t 1 40 100000 home
/** @param {NS} ns **/
export async function main(ns) {
	const secTreshold = ns.args[0]
	const moneyTreshold = ns.args[1]
	const hostname = ns.args[2]

	if (!hostname || hostname == "") throw Error("Missing hostname")

	const targets = ns.scan(hostname)
	function customFTPCrack(hostname) { // 0.05GB
		if (!ns.fileExists("FTPCrack.exe", "home")) return false
		ns.print("cracking ftp: " + hostname)
		console.log("racking ftp: " + hostname)
		try {
			ns.ftpcrack(hostname)
			return true
		} catch (e) {
			ns.print("Failed to crackftp: " + e)
			console.log("Failed to crackftp: " + e)
			return false
		}
	}

	function customNuke(hostname) { // 0.05GB
		ns.print("Pwning: " + hostname)
		console.log("Pwning: " + hostname)

		// if (ns.hasRootAccess(hostname)) {
		// 	return true
		// }

		customBruteSSH(hostname)
		customFTPCrack(hostname)

		ns.print("nuking: " + hostname)
		console.log("nuking: " + hostname)
		try {
			ns.nuke(hostname)
			return true
		} catch (e) {
			ns.print("Failed to nuke: " + e)
			console.log("Failed to nuke: " + e)
			return false
		}

	}

	function customBruteSSH(hostname) { // 0.05 GB
		if (!ns.fileExists("BruteSSH.exe", "home")) return false

		ns.print("bruting ssh: " + hostname)
		console.log("bruting ssh: " + hostname)
		try {
			ns.brutessh(hostname)
			return true
		} catch (e) {
			ns.print("Failed to brutessh: " + e)
			console.log("Failed to brutessh: " + e)
			return false
		}
	}

	const pwnedTargets = targets.filter((target) => customNuke(target))
	console.log(pwnedTargets)
	if (pwnedTargets.length != 0) {
		for (const target of targets) {
			const shouldSpread = !ns.fileExists("pwnWorm.js", target)
			console.log("spreading", target, shouldSpread)
			if (shouldSpread) {
				const result = await ns.scp(["pwnWorm.js", "hack.js"], hostname, target)
				// if (result) {
				ns.print("Spreaded. Launching.")
				console.log("Spreaded. Launching.")
				ns.exec("pwnWorm.js", target, 1, secTreshold, moneyTreshold, target)
				// }
			}
		}
	}

	if (hostname != "home")
		ns.exec("hack.js", hostname, 1, secTreshold, moneyTreshold, hostname)
}