addLayer("c", {
    name: "Coins",
    symbol: "C",
	resource: "Coins",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		second: new Decimal(0),

		workers: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
		investments: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
		printers: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
		coin_mints: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
		alchemies: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },

		accelerators: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0), power: new Decimal(1.1) },
		multipliers: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0), power: new Decimal(2) },
    }},
    color: "gold",
    type: "none",
	displayRow: 0,
    row: 0,
    layerShown(){ return true },
	update() {
		player[this.layer].points = player.points

		let accelerators = player[this.layer].accelerators.power.pow(player[this.layer].accelerators.count.add(player[this.layer].accelerators.amount))
		let multipliers = player[this.layer].multipliers.power.pow(player[this.layer].multipliers.count.add(player[this.layer].multipliers.amount))

		let mulBoost = accelerators.mul(multipliers)

		let workers = player[this.layer].workers.count.add(player[this.layer].workers.amount).mul(10).mul(mulBoost).mul(upgradeEffect('cu', 11))
		let investments = player[this.layer].investments.count.add(player[this.layer].investments.amount).mul(100).mul(mulBoost).mul(upgradeEffect('cu', 12))
		let printers = player[this.layer].printers.count.add(player[this.layer].printers.amount).mul(1000).mul(mulBoost).mul(upgradeEffect('cu', 13))
		let coin_mints = player[this.layer].coin_mints.count.add(player[this.layer].coin_mints.amount).mul(1e4).mul(mulBoost).mul(upgradeEffect('cu', 14))
		let alchemies = player[this.layer].alchemies.count.add(player[this.layer].alchemies.amount).mul(1e5).mul(mulBoost).mul(upgradeEffect('cu', 15))
		
		player[this.layer].workers.second = workers
		player[this.layer].investments.second = investments
		player[this.layer].printers.second = printers
		player[this.layer].coin_mints.second = coin_mints
		player[this.layer].alchemies.second = alchemies

		let total = workers.add(investments).add(printers).add(coin_mints).add(alchemies)

		player[this.layer].second = total
	},
	effect() { return player[this.layer].second },
	tabFormat: [
		function() {
			return ["display-text", `You have <h2 style='color:gold;text-shadow:gold 0px 0px 10px'>${format(player.points)}</h2> Coins`]
		},
		function() {
			return ["display-text", `(${format(tmp[this.layer].effect)}/sec)`]
		},
		["blank", "25px"],
		["h-line", "100%", {"border-color":"gold"}],
		["blank", "25px"],
		function() {
			return ['column', [
				["row", [
					["raw-html", `<div style='width:250px;text-align:left'>Workers: ${format(player[this.layer].workers.count)} [+${format(player[this.layer].workers.amount)}]</div>`, {"color":"gold"}],
					["blank", ["10px", "10px"]],
					["buyable", "11"],
					["raw-html", `<div style='width:300px;text-align:right'>Coins/Sec: ${format(player[this.layer].workers.second)} [${format(player[this.layer].workers.second.div(player[this.layer].second.max(1)).mul(100).min(100).max(0))}%]</div>`, {"color":"gold"}],
				]],
				["row", [
					["raw-html", `<div style='width:250px;text-align:left'>Investments: ${format(player[this.layer].investments.count)} [+${format(player[this.layer].investments.amount)}]</div>`, {"color":"gold"}],
					["blank", ["10px", "10px"]],
					["buyable", "12"],
					["raw-html", `<div style='width:300px;text-align:right'>Coins/Sec: ${format(player[this.layer].investments.second)} [${format(player[this.layer].investments.second.div(player[this.layer].second.max(1)).mul(100).min(100).max(0))}%]</div>`, {"color":"gold"}],
				]],
				["row", [
					["raw-html", `<div style='width:250px;text-align:left'>Printers: ${format(player[this.layer].printers.count)} [+${format(player[this.layer].printers.amount)}]</div>`, {"color":"gold"}],
					["blank", ["10px", "10px"]],
					["buyable", "13"],
					["raw-html", `<div style='width:300px;text-align:right'>Coins/Sec: ${format(player[this.layer].printers.second)} [${format(player[this.layer].printers.second.div(player[this.layer].second.max(1)).mul(100).min(100).max(0))}%]</div>`, {"color":"gold"}],
				]],
				["row", [
					["raw-html", `<div style='width:250px;text-align:left'>Coin Mints: ${format(player[this.layer].coin_mints.count)} [+${format(player[this.layer].coin_mints.amount)}]</div>`, {"color":"gold"}],
					["blank", ["10px", "10px"]],
					["buyable", "14"],
					["raw-html", `<div style='width:300px;text-align:right'>Coins/Sec: ${format(player[this.layer].coin_mints.second)} [${format(player[this.layer].coin_mints.second.div(player[this.layer].second.max(1)).mul(100).min(100).max(0))}%]</div>`, {"color":"gold"}],
				]],
				["row", [
					["raw-html", `<div style='width:250px;text-align:left'>Alchemies: ${format(player[this.layer].alchemies.count)} [+${format(player[this.layer].alchemies.amount)}]</div>`, {"color":"gold"}],
					["blank", ["10px", "10px"]],
					["buyable", "15"],
					["raw-html", `<div style='width:300px;text-align:right'>Coins/Sec: ${format(player[this.layer].alchemies.second)} [${format(player[this.layer].alchemies.second.div(player[this.layer].second.max(1)).mul(100).min(100).max(0))}%]</div>`, {"color":"gold"}],
				]],
			]]
		},
		["blank", "100px"],
		function() {
			return ['column', [
				["row", [
					["raw-html", `<div style='width:250px;text-align:left'>Accelerators: ${format(player[this.layer].accelerators.count)} [+${format(player[this.layer].accelerators.amount)}]</div>`, {"color":"yellow"}],
					["blank", ["10px", "10px"]],
					["buyable", "21"],
					["raw-html", `<div style='width:300px;text-align:right'>Acceleration Power: ${format(player[this.layer].accelerators.power.sub(1).mul(100).min(100).max(0))}%<br>Acceleration: ${format(player[this.layer].accelerators.power.pow(player[this.layer].accelerators.count.add(player[this.layer].accelerators.amount)))}x</div>`, {"color":"cyan"}],
				]],
				["row", [
					["raw-html", `<div style='width:250px;text-align:left'>Multipliers: ${format(player[this.layer].multipliers.count)} [+${format(player[this.layer].multipliers.amount)}]</div>`, {"color":"yellow"}],
					["blank", ["10px", "10px"]],
					["buyable", "22"],
					["raw-html", `<div style='width:300px;text-align:right'>Multiplier Power: ${format(player[this.layer].multipliers.power.sub(1).mul(100).min(100).max(0))}%<br>Multiplier: ${format(player[this.layer].multipliers.power.pow(player[this.layer].multipliers.count.add(player[this.layer].multipliers.amount)))}x</div>`, {"color":"pink"}],
				]],
			]]
		},
	],
	buyables: {
		11: {
			cost() { return new Decimal(1.26).pow(player[this.layer].workers.count).mul(100) },
			display() { return `Cost: ${format(this.cost())} Coins` },
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost())
				player[this.layer].workers.count = player[this.layer].workers.count.add(1)
			},
			style() {
				let s = {};
				if (this.canAfford()) s["background-color"] = "#666"; else s["background-color"] = "transparent"
				s["width"] = "150px"
				s["height"] = "30px"
				s["color"] = "white"
				return s
			},
		},
		12: {
			cost() { return new Decimal(1.563).pow(player[this.layer].investments.count).mul(2000) },
			display() { return `Cost: ${format(this.cost())} Coins` },
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost())
				player[this.layer].investments.count = player[this.layer].investments.count.add(1)
			},
			style() {
				let s = {};
				if (this.canAfford()) s["background-color"] = "#666"; else s["background-color"] = "transparent"
				s["width"] = "150px"
				s["height"] = "30px"
				s["color"] = "white"
				return s
			},
		},
		13: {
			cost() { return new Decimal(3.814).pow(player[this.layer].printers.count).mul(40000) },
			display() { return `Cost: ${format(this.cost())} Coins` },
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost())
				player[this.layer].printers.count = player[this.layer].printers.count.add(1)
			},
			style() {
				let s = {};
				if (this.canAfford()) s["background-color"] = "#666"; else s["background-color"] = "transparent"
				s["width"] = "150px"
				s["height"] = "30px"
				s["color"] = "white"
				return s
			},
		},
		14: {
			cost() { return new Decimal(2.437).pow(player[this.layer].coin_mints.count).mul(8e5) },
			display() { return `Cost: ${format(this.cost())} Coins` },
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost())
				player[this.layer].coin_mints.count = player[this.layer].coin_mints.count.add(1)
			},
			style() {
				let s = {};
				if (this.canAfford()) s["background-color"] = "#666"; else s["background-color"] = "transparent"
				s["width"] = "150px"
				s["height"] = "30px"
				s["color"] = "white"
				return s
			},
		},
		15: {
			cost() { return new Decimal(3.05).pow(player[this.layer].alchemies.count).mul(1.6e7) },
			display() { return `Cost: ${format(this.cost())} Coins` },
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost())
				player[this.layer].alchemies.count = player[this.layer].alchemies.count.add(1)
			},
			style() {
				let s = {};
				if (this.canAfford()) s["background-color"] = "#666"; else s["background-color"] = "transparent"
				s["width"] = "150px"
				s["height"] = "30px"
				s["color"] = "white"
				return s
			},
		},
		21: {
			cost() { return new Decimal(4).pow(player[this.layer].accelerators.count).mul(500) },
			display() { return `Cost: ${format(this.cost())} Coins` },
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost())
				player[this.layer].accelerators.count = player[this.layer].accelerators.count.add(1)
			},
			style() {
				let s = {};
				if (this.canAfford()) s["background-color"] = "#666"; else s["background-color"] = "transparent"
				s["width"] = "150px"
				s["height"] = "30px"
				s["color"] = "white"
				return s
			},
		},
		22: {
			cost() { return new Decimal(10).pow(player[this.layer].multipliers.count).mul(1e5) },
			display() { return `Cost: ${format(this.cost())} Coins` },
			canAfford() { return player.points.gte(this.cost()) },
			buy() {
				player.points = player.points.sub(this.cost())
				player[this.layer].multipliers.count = player[this.layer].multipliers.count.add(1)
			},
			style() {
				let s = {};
				if (this.canAfford()) s["background-color"] = "#666"; else s["background-color"] = "transparent"
				s["width"] = "150px"
				s["height"] = "30px"
				s["color"] = "white"
				return s
			},
		},
	},
	branches: [
		["cu", function() { return player.cu.unlocked ? "#ffeb00" : "#303030" }, 25],
		["d", function() { return player.d.unlocked ? "#80f98f" : "#303030" }, 25],
	],
})

addLayer("cu", {
    name: "Coin upgrades",
    symbol: "cu",
	resource: "Coins",
	baseResource: "Coins",
	requires: new Decimal(1e6),
	resetsNothing() { return true },
	tooltip() { return player[this.layer].unlocked ? "" : "Reach 1,000,000 Coins to unlock" },
    position: 1,
    startData() { return {
        unlocked: false,
		shown: false,
    }},
    color: "yellow",
    type: "none",
	displayRow: 0,
    row: 0,
    layerShown(){ return player[this.layer].shown || player[this.layer].unlocked },
	update() {
		if (!player[this.layer].unlocked) if (player.points.gte(1e6)) player[this.layer].unlocked = true
		if (!player[this.layer].shown) if (player.points.gte(1e5)) player[this.layer].shown = true
	},
	tabFormat: [
		function() {
			return ["display-text", `You have <h2 style='color:gold;text-shadow:gold 0px 0px 10px'>${format(player.points)}</h2> Coins`]
		},
		function() {
			return ["display-text", `(${format(tmp.c.effect)}/sec)`]
		},
		["blank", "25px"],
		["h-line", "100%", {"border-color":"gold"}],
		["blank", "25px"],
		["display-text", "<h3 style='color:gold'>Coin upgrades</h3>"],
		"upgrades",
	],
	upgrades: {
		11: {
			cost() { return new Decimal(1e6) },
			currencyLocation() { return player },
			currencyInternalName: "points",
			fullDisplay() { return "" },
			style() { return {
					"height":"60px","width":"60px","border-color":"gold","background-color":(hasUpgrade(this.layer, this.id) ? "yellow" : "#0f0f0f")
				} 
			},
			tooltip() { return `<span style='color:yellow'>Cost: ${format(this.cost())}</span><br><span style='color:pink'>Effect: Worker production x1,000</span>` },
			effect() { return hasUpgrade(this.layer, this.id) ? new Decimal(1000) : new Decimal(1) },
		},
		12: {
			cost() { return new Decimal(1e9) },
			currencyLocation() { return player },
			currencyInternalName: "points",
			fullDisplay() { return "" },
			style() { return {
					"height":"60px","width":"60px","border-color":"gold","background-color":(hasUpgrade(this.layer, this.id) ? "yellow" : "#0f0f0f")
				} 
			},
			tooltip() { return `<span style='color:yellow'>Cost: ${format(this.cost())}</span><br><span style='color:pink'>Effect: Investment production x1,000</span>` },
			effect() { return hasUpgrade(this.layer, this.id) ? new Decimal(1000) : new Decimal(1) },
		},
		13: {
			cost() { return new Decimal(1e10) },
			currencyLocation() { return player },
			currencyInternalName: "points",
			fullDisplay() { return "" },
			style() { return {
					"height":"60px","width":"60px","border-color":"gold","background-color":(hasUpgrade(this.layer, this.id) ? "yellow" : "#0f0f0f")
				} 
			},
			tooltip() { return `<span style='color:yellow'>Cost: ${format(this.cost())}</span><br><span style='color:pink'>Effect: Printer production x1,000</span>` },
			effect() { return hasUpgrade(this.layer, this.id) ? new Decimal(1000) : new Decimal(1) },
		},
		14: {
			cost() { return new Decimal(1e11) },
			currencyLocation() { return player },
			currencyInternalName: "points",
			fullDisplay() { return "" },
			style() { return {
					"height":"60px","width":"60px","border-color":"gold","background-color":(hasUpgrade(this.layer, this.id) ? "yellow" : "#0f0f0f")
				} 
			},
			tooltip() { return `<span style='color:yellow'>Cost: ${format(this.cost())}</span><br><span style='color:pink'>Effect: Coin Mint production x1,000</span>` },
			effect() { return hasUpgrade(this.layer, this.id) ? new Decimal(1000) : new Decimal(1) },
		},
		15: {
			cost() { return new Decimal(1e12) },
			currencyLocation() { return player },
			currencyInternalName: "points",
			fullDisplay() { return "" },
			style() { return {
					"height":"60px","width":"60px","border-color":"gold","background-color":(hasUpgrade(this.layer, this.id) ? "yellow" : "#0f0f0f")
				} 
			},
			tooltip() { return `<span style='color:yellow'>Cost: ${format(this.cost())}</span><br><span style='color:pink'>Effect: Alchemy production x1,000</span>` },
			effect() { return hasUpgrade(this.layer, this.id) ? new Decimal(1000) : new Decimal(1) },
		},
	},
})

addLayer("d", {
    name: "Diamonds",
    symbol: "D",
	resource: "Diamonds",
	baseResource: "Coins",
	baseAmount() { return player.points },
	requires: new Decimal(1e15),
	getResetGain() { return player.points.div(1e13).floor() },
	getNextAt() { return player.points.sub(this.getResetGain().mul(1e13)).max(0) },
	canReset() { return player.points.gte(1e15) },
	prestigeButtonText() { return this.getResetGain().gte(100) ? `Reset for <b>${format(this.getResetGain())}</b> Diamonds` : `Reset for +<b>${format(this.getResetGain())}</b> Diamonds<br>Next at ${format(this.getNextAt())} Coins` },
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		autoWorker: false,
    }},
    color: "cyan",
    type: "custom",
	displayRow: 1,
    row: 1,
    layerShown(){ return player[this.layer].unlocked || player.points.gte(1e13) },
	tabFormat: [
		function() {
			return ["display-text", `You have <h2 style='color:cyan;text-shadow:cyan 0px 0px 10px'>${format(player[this.layer].points)}</h2> Diamonds`]
		},
		["blank", "25px"],
		["h-line", "100%", {"border-color":"cyan"}],
		["blank", "25px"],
		["prestige-button", {"color":"cyan"}],
		"blank",
		["display-text", "Require: 1.00e15 Coins"],
		["blank", "25px"],
		["h-line", "100%", {"border-color":"cyan"}],
		["microtabs", "Main"],
	],
	microtabs: {
		Main: {
			Buildings: {
				content: [
					["h-line", "100%", {"border-color":"cyan"}],
					["blank", "25px"],
				],
			},
			Milestones: {
				content: [
					["h-line", "100%", {"border-color":"cyan"}],
					["blank", "25px"],
					"milestones",
				],
			},
		},
	},
	milestones: {
		0: {
			requirementDescription: "1,000 Diamonds",
			effectDescription: "Autobuy Workers once per tick (Not implimented yet)",
			done() { return player[this.layer].points.gte(1e3) },
			style() { return {"background-color":(hasMilestone(this.layer,this.id)?"rgba(0,255,255,0.5)":"transparent"),"border-color":"cyan","border-radius":"10px 10px 10px 10px"} },
			toggles: [["d", "autoWorker"]],
		},
	},
})