let modInfo = {
	name: "The Synergism Tree",
	id: "TheSynergismTree",
	author: "patfr",
	pointsName: "Coins",
	modFiles: ["layers.js", "tree.js"],

	discordName: "My discord server",
	discordLink: "https://discord.gg/7ahtMyv5hX",
	initialStartPoints: new Decimal (100),
	offlineLimit: 0,
}

let VERSION = {
	num: "0.006",
	name: "Quarky",
}

let changelog = `
<h3 style='color:red'>Inspired by: <a href='https://pseudo-corp.github.io/SynergismOfficial/' target="_blank">Synergism</a></h3><br> 
<h3 style='color:red'>Synergism discord: <a href='https://www.discord.gg/ameCknq' target="_blank">Discord</a></h3><br>
<br><br>
<h1>Version info:</h1><br><br>
	<h3 style='color:red'>vA.B.C</h3><br>
		- A: Major update<br>
		- B: Small update<br>
		- C: Minor fixes
<br><br><br>
<h1>Changelog:</h1><br><br>
	<h3 style='color:red'>v0.006</h3><br>
		- Added 5 Diamond buildings.<br>
		- Added Crystals.<br>
		- Added Accelerator boosts.<br>
		- Added Quarks.<br>
		- Added Autobuyers.<br>
		- Added Notification system.<br>
		- Added Hotkeys to switch layer.<br>
		- Added 15 Achievements.<br>
		- Added Diamonds 5 upgrades.<br>
		- Fixed some bugs.<br>
		Endgame: 1.00e8 Dimonds.<br>
	<br>
	<h3 style='color:red'>v0.005.1</h3><br>
		- Fixed diamond button being white.<br>
		- Changed diamond resets to be rounded down.<br>
	<br>
	<h3 style='color:red'>v0.005</h3><br>
		- Added Diamond layer.<br>
		- Added Diamonds.<br>
		- Added placeholders for next update.<br>
		Endgame: 100 Dimonds.<br>
		Challenge for grinders: 1,000 Diamonds.<br>
	<br>
	<h3 style='color:red'>v0.004</h3><br>
		- Added 5 Coin upgrades.<br>
		- Added discord link for synergism.<br>
		Endgame: 1.00e15 Coins.<br>
	<br>
	<h3 style='color:red'>v0.003</h3><br>
		- Added Coin Mints.<br>
		- Added Alchemies.<br>
		- Added Multipliers.<br>
		- Added discord link.<br>
		Endgame: 1,000,000 Coins.<br>
	<br>
	<h3 style='color:red'>v0.002</h3><br>
		- Added Printers.<br>
		- Added Accelerators.<br>
		Endgame: 100,000 Coins<br>
	<br>
	<h3 style='color:red'>v0.001</h3><br>
		- Added 2 buyables.<br>
		- Added coins.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
	return true
}

function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	gain = gain.add(tmp.c.effect)
	gain = gain.mul(tmp.d.effect)
	return gain
}

function addedPlayerData() { return {
}}

var displayThings = [
	function() { return `<br><h3 style='color:lavender;text-shadow:lavender 0px 0px 2px'>You have ${format(player.c.quarks)} Quarks!</h3>` }
]

function isEndgame() {
	return player.d.points.gte(1e8)
}

var backgroundStyle = {

}

function maxTickLength() {
	return(3600)
}

function fixOldSave(oldVersion) {

}