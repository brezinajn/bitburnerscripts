/** @param {NS} ns **/
export async function main(ns) {

	const hostname = ns.args[2]
	const secTreshold = ns.args[0]
	const moneyTreshold = ns.args[1]

	try {
		while (true) {
			while (ns.getServerSecurityLevel(hostname) > secTreshold) {
				ns.print("weakening")
				console.log("weakening")
				await ns.weaken(hostname)
			}

			while (ns.getServerMoneyAvailable(hostname) < moneyTreshold) {
				ns.print("growing")
				console.log("growing")
				await ns.grow(hostname)
			}

			ns.print("hacking")
			console.log("hacking")
			const result = await ns.hack(hostname)

			ns.print("Gained: " + result)
			console.log("Gained: " + result)
		}
	} catch (e) {
		ns.print(e)
		console.log(e)
	}
}