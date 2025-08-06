var nightShiftChecklist = {
	stockCoffeeIsland: {
		id: "stockCoffeeIsland",
		simpleName: "Stock The Coffee Island",
		detail: 
`Stock:
	Brunn Cups & Lids,
	Soda Cups & Lids,
	Torke Cups & Lids,
	Coffee Creamers,
	Condiments,
	Napkins.
`,
		completed: false
	},
	sanitizeIslandCounter: {
		id: "sanitizeIslandCounter",
		simpleName: "Sanitize Countertops",
		detail:
`Sanitize:
	Island Counter (Coffee Island),
	Deli Prep-Table,
	Register Counter (Where Customer's Items Go),
	The Tables & Chairs Near The Front Entrance.

`,
		completed: false
	},
	stockCigarettes: {
		id: "stockCigarettes",
		simpleName: "Stock Tobacco",
		detail:
`Stock:
	Cigarettes,
	Cigars & Cigarillos,
	Cans (Grizzly, Zyn, Copenhagen, etc.),
	Vape Pods.
`,
		completed: false
	},
	stockCooler: {
		id: "stockCooler",
		simpleName: "Stock Cold Stuff",
		detail:
`Stock:
	Cooler,
	Cold Island.
`,
		completed: false
	},
	coffeeCare: {
		id: "coffeeCare",
		simpleName: "Take Care of Coffee",
		detail:
`Empty & Clean:
	Torke Carafes,
	Silver Coffee Pot.
Clean:
	Catch-Tray For Silver Pot,
	Catch-Tray For Capucino Machine,
	Catch-Tray For Brunn Machine,
`,
		completed: false
	},
	sodaMachine: {
		id: "sodaMachine",
		simpleName: "Soda Machine Care",
		detail:
`Take heads off of soda fountain, then put them into hot water overnight.
`,
	}
	
}

window.onload = () => {
	document.getElementById("settingsButton").onclick = ()=>{
		document.getElementById("settingsSidebar").style.left = "0px";
	}
	document.getElementById("backArrow").onclick = ()=>{
		document.getElementById("settingsSidebar").style.left = "-250px";
	}
	
	var nightShiftArray = Object.keys(nightShiftChecklist);
	for(var i=0;i<nightShiftArray.length;i++) {
		var currentItem = nightShiftChecklist[nightShiftArray[i]];
		var a = document.createElement("li");
		a.innerHTML = `
		<h2 class="listTitle">`+currentItem.simpleName+`</h2>
		<div class="doneSpanContainer" customVar="`+currentItem.id+`">
			<div class="doneSpan" style="animation-delay: -`+Math.floor(Math.random()*20)/10+`s">Not Done</div>
		</div>
		<h3 class="listDetail">`+currentItem.detail+`</h3>
		`;
		document.getElementById("list").appendChild(a);
	}
	
	var doneLabels = document.getElementsByClassName("doneSpanContainer");
	for(var i=0;i<doneLabels.length;i++) {
		var doneLabel = doneLabels[i];
		
		doneLabel.setAttribute("onclick", `
			var item = nightShiftChecklist.`+doneLabel.getAttribute("customVar")+`;
			item.completed = !item.completed;
			if(item.completed) {
				this.children[0].style.color = "lightgreen";
				this.children[0].style.animationName = "none";
				this.children[0].innerHTML = "Done";
			} else {
				this.children[0].style.color = "#FF3333";
				this.children[0].style.animationName = "notDoneSpan";
				this.children[0].innerHTML = "Not Done";
			}
			`);
	}
	
};