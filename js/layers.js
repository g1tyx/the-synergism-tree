addLayer("c", {
    name: "Coins",
    symbol: "C",
	resource: "Coins",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		quarks: new Decimal(0),
		second: new Decimal(0),

		workers: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
		investments: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
		printers: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
		coin_mints: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
		alchemies: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },

		accelerators: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0), power: new Decimal(1.1) },
		multipliers: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0), power: new Decimal(2) },
		accelerator_boost: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0), power: new Decimal(0.01) },
    }},
    color: "gold",
    type: "none",
	displayRow: 0,
    row: 0,
    layerShown(){ return true },
	update() {
		if (hasMilestone("d", 0) && player.d.autoWorker) buyBuyable(this.layer, "11")
		if (hasMilestone("d", 1) && player.d.autoInvestments) buyBuyable(this.layer, "12")
		if (hasMilestone("d", 2) && player.d.autoPrinters) buyBuyable(this.layer, "13")
		if (hasMilestone("d", 3) && player.d.autoCoin_mints) buyBuyable(this.layer, "14")
		if (hasMilestone("d", 4) && player.d.autoAlchemies) buyBuyable(this.layer, "15")
		if (hasMilestone("d", 5) && player.d.autoAccelerators) buyBuyable(this.layer, "21")
		if (hasMilestone("d", 6) && player.d.autoMultipliers) buyBuyable(this.layer, "22")

		player[this.layer].points = player.points

		let acAmount = new Decimal(0)
		let muAmount = new Decimal(0)
		acAmount = acAmount.add(player[this.layer].accelerator_boost.count.add(player[this.layer].accelerator_boost.amount).mul(5))
		if (hasUpgrade("du", 11)) { acAmount = acAmount.add(5); muAmount = muAmount.add(1) }
		if (hasUpgrade("du", 12)) { acAmount = acAmount.add(4); muAmount = muAmount.add(1) }
		if (hasUpgrade("du", 13)) { acAmount = acAmount.add(3); muAmount = muAmount.add(1) }
		if (hasUpgrade("du", 14)) { acAmount = acAmount.add(2); muAmount = muAmount.add(1) }
		if (hasUpgrade("du", 15)) { acAmount = acAmount.add(1); muAmount = muAmount.add(1) }

		player[this.layer].accelerators.amount = acAmount
		player[this.layer].accelerators.power = player[this.layer].accelerator_boost.count.add(player[this.layer].accelerator_boost.amount).mul(player[this.layer].accelerator_boost.power).add(1.1).max(1.1)
		player[this.layer].multipliers.amount = muAmount

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
		"blank",
		function() {
			return ["row", [
				player.c.unlocked?["raw-html", `<div style='width:50px;height:50px;border:gold solid 2px;font-size:44px;background-color:${tmp.c.notify?"rgba(255,255,0,.5)":"transparent"};border-radius:8px'>C</div>`]:["raw-html",""],
				"blank",
				player.cu.unlocked?["raw-html", `<div style='width:50px;height:50px;border:yellow solid 2px;font-size:44px;background-color:${tmp.cu.notify?"rgba(255,255,0,.5)":"transparent"};border-radius:8px'>Cu</div>`]:["raw-html",""],
				"blank",
				player.d.unlocked?["raw-html", `<div style='width:50px;height:50px;border:cyan solid 2px;font-size:44px;background-color:${tmp.d.notify?"rgba(0,255,255,.5)":"transparent"};border-radius:8px'>D</div>`]:["raw-html",""],
				"blank",
				player.du.unlocked?["raw-html", `<div style='width:50px;height:50px;border:cyan solid 2px;font-size:44px;background-color:${tmp.du.notify?"rgba(0,255,255,.5)":"transparent"};border-radius:8px'>Du</div>`]:["raw-html",""],
			]]
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
				["row", [
					["raw-html", `<div style='width:250px;text-align:left'>Accelerator Boost: ${format(player[this.layer].accelerator_boost.count)} [+${format(player[this.layer].accelerator_boost.amount)}]</div>`, {"color":"cyan"}],
					["blank", ["10px", "10px"]],
					["buyable", "23"],
					["raw-html", `<div style='width:300px;text-align:right'>Reset Diamond & Coin layers for +${format(player[this.layer].accelerator_boost.power.mul(100).min(100).max(0))}% Accelerator power & 5 free Accelerator</div>`, {"color":"crimson"}],
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
		23: {
			cost() { return new Decimal(1e11).pow(player[this.layer].accelerator_boost.count).mul(1000) },
			display() { return `Cost: ${format(this.cost())} Diamonds` },
			canAfford() { return player.d.points.gte(this.cost()) },
			buy() {
				player.d.points = new Decimal(0)
				player[this.layer].accelerator_boost.count = player[this.layer].accelerator_boost.count.add(1)
				tmp.c.doReset('ac')
				tmp.cu.doReset('ac')
				tmp.d.doReset('ac')
				tmp.du.doReset('ac')
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
	hotkeys: [
		{ key: "c", description: "C: Go to Coin layer", onPress() { if (player.c.unlocked) player.tab = "c" } },
	],
	doReset(layer) {
		if (layers[layer].row <= this.row) return
		let keep = []
		keep.push("quarks")
		let ac = {...player.c.accelerator_boost}
		player.points = new Decimal(0)
		layerDataReset(this.layer, keep)
		player.c.accelerator_boost = ac
		player.points = player.points.max(100)
	},
})

addLayer("cu", {
    name: "Coin upgrades",
    symbol: "cu",
	resource: "Coins",
	baseResource: "Coins",
	requires: new Decimal(1e6),
	baseAmount() { return player.points },
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
		"blank",
		function() {
			return ["row", [
				player.c.unlocked?["raw-html", `<div style='width:50px;height:50px;border:gold solid 2px;font-size:44px;background-color:${tmp.c.notify?"rgba(255,255,0,.5)":"transparent"};border-radius:8px'>C</div>`]:["raw-html",""],
				"blank",
				player.cu.unlocked?["raw-html", `<div style='width:50px;height:50px;border:yellow solid 2px;font-size:44px;background-color:${tmp.cu.notify?"rgba(255,255,0,.5)":"transparent"};border-radius:8px'>Cu</div>`]:["raw-html",""],
				"blank",
				player.d.unlocked?["raw-html", `<div style='width:50px;height:50px;border:cyan solid 2px;font-size:44px;background-color:${tmp.d.notify?"rgba(0,255,255,.5)":"transparent"};border-radius:8px'>D</div>`]:["raw-html",""],
				"blank",
				player.du.unlocked?["raw-html", `<div style='width:50px;height:50px;border:cyan solid 2px;font-size:44px;background-color:${tmp.du.notify?"rgba(0,255,255,.5)":"transparent"};border-radius:8px'>Du</div>`]:["raw-html",""],
			]]
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
	hotkeys: [
		{ key: "C", description: "Shift + C: Go to Coin upgrades", onPress() { if (player.cu.unlocked) player.tab = "cu" } },
	],
	doReset(layer) {
		if (layers[layer].row <= this.row) return
		let keep = []
		layerDataReset(this.layer, keep)
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
        unlocked: false,
		points: new Decimal(0),
		crystals: new Decimal(0),

		autoWorker: false,
		autoInvestments: false,
		autoPrinters: false,
		autoCoin_mints: false,
		autoAlchemies: false,
		autoAccelerators: false,
		autoMultipliers: false,

		refineries: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
		coal_plants: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
		coal_rigs: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
		pickaxes: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
		pandoras_boxes: { count: new Decimal(0), amount: new Decimal(0), second: new Decimal(0) },
    }},
    color: "cyan",
    type: "custom",
	displayRow: 1,
    row: 1,
    layerShown(){ return player[this.layer].unlocked || player.points.gte(1e13) },
	update(delta) {
		let pandoras_boxes = player[this.layer].pandoras_boxes.count.add(player[this.layer].pandoras_boxes.amount).mul(.25)
		player[this.layer].pickaxes.amount = player[this.layer].pickaxes.amount.add(pandoras_boxes.mul(delta))
		let pickaxes = player[this.layer].pickaxes.count.add(player[this.layer].pickaxes.amount).mul(.5)
		player[this.layer].coal_rigs.amount = player[this.layer].coal_rigs.amount.add(pickaxes.mul(delta))
		let coal_rigs = player[this.layer].coal_rigs.count.add(player[this.layer].coal_rigs.amount).mul(1)
		player[this.layer].coal_plants.amount = player[this.layer].coal_plants.amount.add(coal_rigs.mul(delta))
		let coal_plants = player[this.layer].coal_plants.count.add(player[this.layer].coal_plants.amount).mul(2)
		player[this.layer].refineries.amount = player[this.layer].refineries.amount.add(coal_plants.mul(delta))
		let refineries = player[this.layer].refineries.count.add(player[this.layer].refineries.amount).mul(4)
		
		player[this.layer].refineries.second = refineries
		player[this.layer].coal_plants.second = coal_plants
		player[this.layer].coal_rigs.second = coal_rigs
		player[this.layer].pickaxes.second = pickaxes
		player[this.layer].pandoras_boxes.second = pandoras_boxes

		let total = refineries.mul(delta)

		player[this.layer].crystals = player[this.layer].crystals.add(total)
	},
	effect() { return player[this.layer].crystals.max(1).ln().mul(5).sub(8).max(1) },
	tabFormat: [
		function() {
			return ["display-text", `You have <h2 style='color:cyan;text-shadow:cyan 0px 0px 10px'>${format(player[this.layer].points)}</h2> Diamonds`]
		},
		function() {
			return ["display-text", `(${format(0)}/sec)`]
		},
		"blank",
		function() {
			return ["row", [
				player.c.unlocked?["raw-html", `<div style='width:50px;height:50px;border:gold solid 2px;font-size:44px;background-color:${tmp.c.notify?"rgba(255,255,0,.5)":"transparent"};border-radius:8px'>C</div>`]:["raw-html",""],
				"blank",
				player.cu.unlocked?["raw-html", `<div style='width:50px;height:50px;border:yellow solid 2px;font-size:44px;background-color:${tmp.cu.notify?"rgba(255,255,0,.5)":"transparent"};border-radius:8px'>Cu</div>`]:["raw-html",""],
				"blank",
				player.d.unlocked?["raw-html", `<div style='width:50px;height:50px;border:cyan solid 2px;font-size:44px;background-color:${tmp.d.notify?"rgba(0,255,255,.5)":"transparent"};border-radius:8px'>D</div>`]:["raw-html",""],
				"blank",
				player.du.unlocked?["raw-html", `<div style='width:50px;height:50px;border:cyan solid 2px;font-size:44px;background-color:${tmp.du.notify?"rgba(0,255,255,.5)":"transparent"};border-radius:8px'>Du</div>`]:["raw-html",""],
			]]
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
					function() {
						return ['column', [
							["row", [
								["raw-html", `<div style='width:250px;text-align:left'>Refineries: ${format(player[this.layer].refineries.count)} [+${format(player[this.layer].refineries.amount)}]</div>`, {"color":"cyan"}],
								["blank", ["10px", "10px"]],
								["buyable", "11"],
								["raw-html", `<div style='width:300px;text-align:right'>Crystals/Sec: ${format(player[this.layer].refineries.second)}</div>`, {"color":"cyan"}],
							]],
							["row", [
								["raw-html", `<div style='width:250px;text-align:left'>Coal Plants: ${format(player[this.layer].coal_plants.count)} [+${format(player[this.layer].coal_plants.amount)}]</div>`, {"color":"cyan"}],
								["blank", ["10px", "10px"]],
								["buyable", "12"],
								["raw-html", `<div style='width:300px;text-align:right'>Ref./Sec: ${format(player[this.layer].coal_plants.second)}</div>`, {"color":"cyan"}],
							]],
							["row", [
								["raw-html", `<div style='width:250px;text-align:left'>Coal Rigs: ${format(player[this.layer].coal_rigs.count)} [+${format(player[this.layer].coal_rigs.amount)}]</div>`, {"color":"cyan"}],
								["blank", ["10px", "10px"]],
								["buyable", "13"],
								["raw-html", `<div style='width:300px;text-align:right'>Plants/Sec: ${format(player[this.layer].coal_rigs.second)}</div>`, {"color":"cyan"}],
							]],
							["row", [
								["raw-html", `<div style='width:250px;text-align:left'>Pickaxes: ${format(player[this.layer].pickaxes.count)} [+${format(player[this.layer].pickaxes.amount)}]</div>`, {"color":"cyan"}],
								["blank", ["10px", "10px"]],
								["buyable", "14"],
								["raw-html", `<div style='width:300px;text-align:right'>Rigs/Sec: ${format(player[this.layer].pickaxes.second)}</div>`, {"color":"cyan"}],
							]],
							["row", [
								["raw-html", `<div style='width:250px;text-align:left'>Pandoras Boxes: ${format(player[this.layer].pandoras_boxes.count)} [+${format(player[this.layer].pandoras_boxes.amount)}]</div>`, {"color":"cyan"}],
								["blank", ["10px", "10px"]],
								["buyable", "15"],
								["raw-html", `<div style='width:300px;text-align:right'>Pickaxes/Sec: ${format(player[this.layer].pandoras_boxes.second)}</div>`, {"color":"cyan"}],
							]],
						]]
					},
					["blank", "50px"],
					function() { return ["display-text", `<div style='color:pink'>You have ${format(player[this.layer].crystals)} Crystals, multiplying Coin production by ${format(tmp[this.layer].effect)}x</div>`] },
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
	buyables: {
		11: {
			cost() { return new Decimal(1.26).pow(player[this.layer].refineries.count).mul(100) },
			display() { return `Cost: ${format(this.cost())} Diamonds` },
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				player[this.layer].refineries.count = player[this.layer].refineries.count.add(1)
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
			cost() { return new Decimal(1.563).pow(player[this.layer].coal_plants.count).mul(1e6) },
			display() { return `Cost: ${format(this.cost())} Diamonds` },
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				player[this.layer].coal_plants.count = player[this.layer].coal_plants.count.add(1)
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
			cost() { return new Decimal(3.814).pow(player[this.layer].coal_rigs.count).mul(1e300) },
			display() { return `Cost: ${format(this.cost())} Diamonds` },
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				player[this.layer].coal_rigs.count = player[this.layer].coal_rigs.count.add(1)
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
			cost() { return new Decimal(2.437).pow(player[this.layer].pickaxes.count).mul(1e300) },
			display() { return `Cost: ${format(this.cost())} Diamonds` },
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				player[this.layer].pickaxes.count = player[this.layer].pickaxes.count.add(1)
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
			cost() { return new Decimal(3.05).pow(player[this.layer].pandoras_boxes.count).mul(1e300) },
			display() { return `Cost: ${format(this.cost())} Diamonds` },
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				player[this.layer].pandoras_boxes.count = player[this.layer].pandoras_boxes.count.add(1)
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
	milestones: {
		0: {
			requirementDescription: "100 Diamonds",
			effectDescription: "Autobuy Workers once per tick",
			done() { return player[this.layer].points.gte(1e2) },
			style() { return {"background-color":(hasMilestone(this.layer,this.id)?"rgba(0,255,255,0.5)":"transparent"),"border-color":"cyan","border-radius":"10px 10px 0px 0px"} },
			toggles: [["d", "autoWorker"]],
		},
		1: {
			requirementDescription: "10,000 Diamonds",
			effectDescription: "Autobuy Investments once per tick",
			done() { return player[this.layer].points.gte(1e4) },
			style() { return {"background-color":(hasMilestone(this.layer,this.id)?"rgba(0,255,255,0.5)":"transparent"),"border-color":"cyan"} },
			toggles: [["d", "autoInvestments"]],
		},
		2: {
			requirementDescription: "1,000,000 Diamonds",
			effectDescription: "Autobuy Printers once per tick",
			done() { return player[this.layer].points.gte(1e6) },
			style() { return {"background-color":(hasMilestone(this.layer,this.id)?"rgba(0,255,255,0.5)":"transparent"),"border-color":"cyan"} },
			toggles: [["d", "autoPrinters"]],
		},
		3: {
			requirementDescription: "100,000,000 Diamonds",
			effectDescription: "Autobuy Coin Mints once per tick",
			done() { return player[this.layer].points.gte(1e8) },
			style() { return {"background-color":(hasMilestone(this.layer,this.id)?"rgba(0,255,255,0.5)":"transparent"),"border-color":"cyan"} },
			toggles: [["d", "autoCoin_mints"]],
		},
		4: {
			requirementDescription: "1.00e10 Diamonds",
			effectDescription: "Autobuy Alchemies once per tick",
			done() { return player[this.layer].points.gte(1e10) },
			style() { return {"background-color":(hasMilestone(this.layer,this.id)?"rgba(0,255,255,0.5)":"transparent"),"border-color":"cyan"} },
			toggles: [["d", "autoAchemies"]],
		},
		5: {
			requirementDescription: "1.00e15 Diamonds",
			effectDescription: "Autobuy Accelerators once per tick",
			done() { return player[this.layer].points.gte(1e15) },
			style() { return {"background-color":(hasMilestone(this.layer,this.id)?"rgba(0,255,255,0.5)":"transparent"),"border-color":"cyan"} },
			toggles: [["d", "autoAccelerators"]],
		},
		6: {
			requirementDescription: "1.00e20 Diamonds",
			effectDescription: "Autobuy Multipliers once per tick",
			done() { return player[this.layer].points.gte(1e20) },
			style() { return {"background-color":(hasMilestone(this.layer,this.id)?"rgba(0,255,255,0.5)":"transparent"),"border-color":"cyan","border-radius":"0px 0px 10px 10px"} },
			toggles: [["d", "autoMultipliers"]],
		},
	},
	branches: [
		["du", function() { return player.du.unlocked ? "#00ffff" : "#303030" }, 25],
	],
	hotkeys: [
		{ key: "d", description: "D: Go to Diamond layer", onPress() { if (player.d.unlocked) player.tab = "d" } },
	],
	doReset(layer) {
		if (layers[layer].row <= this.row) return
		if (layer == "ac") keep.push("milestones")
		let keep = []
		keep.push("autoWorker")
		keep.push("autoInvestments")
		keep.push("autoPrinters")
		keep.push("autoCoin_mints")
		keep.push("autoAlchemies")
		layerDataReset(this.layer, keep)
	},
})

addLayer("du", {
    name: "Diamond upgrades",
    symbol: "Du",
	resource: "Dimonds",
	baseResource: "Dimonds",
	requires: new Decimal(100),
	baseAmount() { return player.d.points },
	resetsNothing() { return true },
	tooltip() { return player[this.layer].unlocked ? "" : "Reach 100 Diamonds to unlock" },
    position: 1,
    startData() { return {
        unlocked: false,
    }},
    color: "#00ffff",
    type: "none",
	displayRow: 1,
    row: 1,
    layerShown(){ return player[this.layer].unlocked },
	update() {
		if (!player[this.layer].unlocked) if (player.d.points.gte(100)) player[this.layer].unlocked = true
	},
	tabFormat: [
		function() {
			return ["display-text", `You have <h2 style='color:cyan;text-shadow:cyan 0px 0px 10px'>${format(player.d.points)}</h2> Diamonds`]
		},
		function() {
			return ["display-text", `(${format(tmp[this.layer].effect)}/sec)`]
		},
		"blank",
		function() {
			return ["row", [
				player.c.unlocked?["raw-html", `<div style='width:50px;height:50px;border:gold solid 2px;font-size:44px;background-color:${tmp.c.notify?"rgba(255,255,0,.5)":"transparent"};border-radius:8px'>C</div>`]:["raw-html",""],
				"blank",
				player.cu.unlocked?["raw-html", `<div style='width:50px;height:50px;border:yellow solid 2px;font-size:44px;background-color:${tmp.cu.notify?"rgba(255,255,0,.5)":"transparent"};border-radius:8px'>Cu</div>`]:["raw-html",""],
				"blank",
				player.d.unlocked?["raw-html", `<div style='width:50px;height:50px;border:cyan solid 2px;font-size:44px;background-color:${tmp.d.notify?"rgba(0,255,255,.5)":"transparent"};border-radius:8px'>D</div>`]:["raw-html",""],
				"blank",
				player.du.unlocked?["raw-html", `<div style='width:50px;height:50px;border:cyan solid 2px;font-size:44px;background-color:${tmp.du.notify?"rgba(0,255,255,.5)":"transparent"};border-radius:8px'>Du</div>`]:["raw-html",""],
			]]
		},
		["blank", "25px"],
		["h-line", "100%", {"border-color":"cyan"}],
		["blank", "25px"],
		["display-text", "<h3 style='color:cyan'>Diamond upgrades</h3>"],
		"upgrades",
	],
	upgrades: {
		11: {
			cost() { return new Decimal(100) },
			currencyLocation() { return player.d },
			currencyInternalName: "points",
			fullDisplay() { return "" },
			style() { return {
					"height":"60px","width":"60px","border-color":"#00aaff","background-color":(hasUpgrade(this.layer, this.id) ? "cyan" : "#0f0f0f")
				} 
			},
			tooltip() { return `<span style='color:cyan'>Cost: ${format(this.cost())}</span><br><span style='color:pink'>Effect: +1 Mulitpliers & +5 Accelerators</span>` },
			effect() { return hasUpgrade(this.layer, this.id) ? new Decimal(1000) : new Decimal(1) },
		},
		12: {
			cost() { return new Decimal(1e3) },
			currencyLocation() { return player.d },
			currencyInternalName: "points",
			fullDisplay() { return "" },
			style() { return {
					"height":"60px","width":"60px","border-color":"#00aaff","background-color":(hasUpgrade(this.layer, this.id) ? "cyan" : "#0f0f0f")
				} 
			},
			tooltip() { return `<span style='color:cyan'>Cost: ${format(this.cost())}</span><br><span style='color:pink'>Effect: +1 Mulitpliers & +4 Accelerators</span>` },
			effect() { return hasUpgrade(this.layer, this.id) ? new Decimal(1000) : new Decimal(1) },
		},
		13: {
			cost() { return new Decimal(1e5) },
			currencyLocation() { return player.d },
			currencyInternalName: "points",
			fullDisplay() { return "" },
			style() { return {
					"height":"60px","width":"60px","border-color":"#00aaff","background-color":(hasUpgrade(this.layer, this.id) ? "cyan" : "#0f0f0f")
				} 
			},
			tooltip() { return `<span style='color:cyan'>Cost: ${format(this.cost())}</span><br><span style='color:pink'>Effect: +1 Mulitpliers & +3 Accelerators</span>` },
			effect() { return hasUpgrade(this.layer, this.id) ? new Decimal(1000) : new Decimal(1) },
		},
		14: {
			cost() { return new Decimal(1e6) },
			currencyLocation() { return player.d },
			currencyInternalName: "points",
			fullDisplay() { return "" },
			style() { return {
					"height":"60px","width":"60px","border-color":"#00aaff","background-color":(hasUpgrade(this.layer, this.id) ? "cyan" : "#0f0f0f")
				} 
			},
			tooltip() { return `<span style='color:cyan'>Cost: ${format(this.cost())}</span><br><span style='color:pink'>Effect: +1 Mulitpliers & +2 Accelerators</span>` },
			effect() { return hasUpgrade(this.layer, this.id) ? new Decimal(1000) : new Decimal(1) },
		},
		15: {
			cost() { return new Decimal(1e7) },
			currencyLocation() { return player.d },
			currencyInternalName: "points",
			fullDisplay() { return "" },
			style() { return {
					"height":"60px","width":"60px","border-color":"#00aaff","background-color":(hasUpgrade(this.layer, this.id) ? "cyan" : "#0f0f0f")
				} 
			},
			tooltip() { return `<span style='color:cyan'>Cost: ${format(this.cost())}</span><br><span style='color:pink'>Effect: +1 Mulitpliers & +1 Accelerators</span>` },
			effect() { return hasUpgrade(this.layer, this.id) ? new Decimal(1000) : new Decimal(1) },
		},
	},
	hotkeys: [
		{ key: "D", description: "Shift + D: Go to Diamond upgrades", onPress() { if (player.du.unlocked) player.tab = "du" } },
	],
	doReset(layer) {
		if (layers[layer].row <= this.row) return
		let keep = []
		layerDataReset(this.layer, keep)
	},
})

addLayer("ac", {
    name: "Boost",
    symbol: "Ac",
    position: 0,
    startData() { return {
        unlocked: false,
    }},
    color: "cyan",
    type: "none",
	displayRow: 0,
    row: 2,
    layerShown(){ return false },
	doReset() {},
})

addLayer("a", {
    name: "Achievements",
    symbol: "A",
    position: 0,
	tooltip: "Achievements",
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
	achievementPopups: false,
    color: "yellow",
    type: "none",
    row: "side",
    layerShown(){ return true },
	hotkeys: [
		{ key: "a", description: "A: Go to achievements", onPress() { if (player.a.unlocked) player.tab = "a" } },
	],
	tabFormat: [
		["display-text", "<h2 style='color:gold'>Achievements</h2>"],
		"blank",
		"achievements",
	],
	achievements: {
		11: {
			done() { return player.c.workers.count.gte(1) },
			tooltip() { return "<div style='color:gold'>Goal: Get 1 Worker</div><div style='color:limegreen'>Reward: 1 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(1) },
		},
		12: {
			done() { return player.c.workers.count.gte(10) },
			tooltip() { return "<div style='color:gold'>Goal: Get 10 Workers</div><div style='color:limegreen'>Reward: 2 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(2) },
		},
		13: {
			done() { return player.c.workers.count.gte(100) },
			tooltip() { return "<div style='color:gold'>Goal: Get 100 Workers</div><div style='color:limegreen'>Reward: 4 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(4) },
		},

		21: {
			done() { return player.c.investments.count.gte(1) },
			tooltip() { return "<div style='color:gold'>Goal: Get 1 Investment</div><div style='color:limegreen'>Reward: 1 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(1) },
		},
		22: {
			done() { return player.c.investments.count.gte(10) },
			tooltip() { return "<div style='color:gold'>Goal: Get 10 Investments</div><div style='color:limegreen'>Reward: 2 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(2) },
		},
		23: {
			done() { return player.c.investments.count.gte(100) },
			tooltip() { return "<div style='color:gold'>Goal: Get 100 Investments</div><div style='color:limegreen'>Reward: 4 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(4) },
		},

		31: {
			done() { return player.c.printers.count.gte(1) },
			tooltip() { return "<div style='color:gold'>Goal: Get 1 Printer</div><div style='color:limegreen'>Reward: 1 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(1) },
		},
		32: {
			done() { return player.c.printers.count.gte(10) },
			tooltip() { return "<div style='color:gold'>Goal: Get 10 Printers</div><div style='color:limegreen'>Reward: 2 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(2) },
		},
		33: {
			done() { return player.c.printers.count.gte(100) },
			tooltip() { return "<div style='color:gold'>Goal: Get 100 Printers</div><div style='color:limegreen'>Reward: 4 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(4) },
		},

		41: {
			done() { return player.c.coin_mints.count.gte(1) },
			tooltip() { return "<div style='color:gold'>Goal: Get 1 Coin Mint</div><div style='color:limegreen'>Reward: 1 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(1) },
		},
		42: {
			done() { return player.c.coin_mints.count.gte(10) },
			tooltip() { return "<div style='color:gold'>Goal: Get 10 Coin Mints</div><div style='color:limegreen'>Reward: 2 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(2) },
		},
		43: {
			done() { return player.c.coin_mints.count.gte(100) },
			tooltip() { return "<div style='color:gold'>Goal: Get 100 Coin Mints</div><div style='color:limegreen'>Reward: 4 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(4) },
		},

		51: {
			done() { return player.c.alchemies.count.gte(1) },
			tooltip() { return "<div style='color:gold'>Goal: Get 1 Alchemy</div><div style='color:limegreen'>Reward: 1 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(1) },
		},
		52: {
			done() { return player.c.alchemies.count.gte(10) },
			tooltip() { return "<div style='color:gold'>Goal: Get 10 Alchemys</div><div style='color:limegreen'>Reward: 2 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(2) },
		},
		53: {
			done() { return player.c.alchemies.count.gte(100) },
			tooltip() { return "<div style='color:gold'>Goal: Get 100 Alchemys</div><div style='color:limegreen'>Reward: 4 Quark</div>" },
			style() { return {"width":"50px","height":"50px","background-color":(hasAchievement(this.layer,this.id)?"rgba(255,255,0,.5)":"transparent"),"border-color":"gold"} },
			onComplete() { player.c.quarks = player.c.quarks.add(4) },
		},
	},
})