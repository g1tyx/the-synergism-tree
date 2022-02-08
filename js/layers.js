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

		let workers = player[this.layer].workers.count.add(player[this.layer].workers.amount).mul(10).mul(mulBoost)
		let investments = player[this.layer].investments.count.add(player[this.layer].investments.amount).mul(100).mul(mulBoost)
		let printers = player[this.layer].printers.count.add(player[this.layer].printers.amount).mul(1000).mul(mulBoost)
		let coin_mints = player[this.layer].coin_mints.count.add(player[this.layer].coin_mints.amount).mul(1e4).mul(mulBoost)
		let alchemies = player[this.layer].alchemies.count.add(player[this.layer].alchemies.amount).mul(1e5).mul(mulBoost)
		
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
			return ["display-text", `You have <h2 style='color:gold;text-shadow:#ffff00 0px 0px 10px'>${format(player.points)}</h2> Coins`]
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
})
