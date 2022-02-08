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
    }},
    color: "gold",
    type: "none",
	displayRow: 0,
    row: 0,
    layerShown(){ return true },
	update() {
		player[this.layer].points = player.points

		let workers = player[this.layer].workers.count.add(player[this.layer].workers.amount).mul(10)
		let investments = player[this.layer].investments.count.add(player[this.layer].investments.amount).mul(100)
		
		player[this.layer].workers.second = workers
		player[this.layer].investments.second = investments

		let total = workers.add(investments)

		player[this.layer].second = total
	},
	effect() { return player[this.layer].second },
	tabFormat: [
		function() {
			return ["display-text", `You have <h2 style='color:gold;text-shadow:#ffff00 0px 0px 10px'>${format(player.points)}</h2> Coins`]
		},
		["blank", "25px"],
		"h-line",
		["blank", "25px"],
		function() {
			return ['column', [
				["row", [
					["raw-html", `<div style='width:250px;text-align:left'>Workers: ${format(player[this.layer].workers.count)} [+${format(player[this.layer].workers.amount)}]</div>`, {"color":"gold"}],
					["blank", ["150px", "10px"]],
					["buyable", "11"],
					["raw-html", `<div style='width:250px;text-align:right'>Coins/Sec: ${format(player[this.layer].workers.second)} [${format(player[this.layer].workers.second.div(player[this.layer].second.max(1)).mul(100).min(100).max(0))}%]</div>`, {"color":"gold"}],
				]],
				["row", [
					["raw-html", `<div style='width:250px;text-align:left'>Investments: ${format(player[this.layer].investments.count)} [+${format(player[this.layer].investments.amount)}]</div>`, {"color":"gold"}],
					["blank", ["150px", "10px"]],
					["buyable", "12"],
					["raw-html", `<div style='width:250px;text-align:right'>Coins/Sec: ${format(player[this.layer].investments.second)} [${format(player[this.layer].investments.second.div(player[this.layer].second.max(1)).mul(100).min(100).max(0))}%]</div>`, {"color":"gold"}],
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
	},
})
