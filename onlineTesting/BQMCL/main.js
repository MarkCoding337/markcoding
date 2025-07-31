var nightShiftChecklist = {
	stockCoffeeIsland: {
		id: "stockCoffeeIsland",
		simpleName: "Stock The Coffee Island",
		detail: "Stock: \n\tBrunn Cups & Lids,\n\tSoda Cups & Lids,\n\tTorke Cups & Lids,\n\tCoffee Creamers,\n\tCondiments, ",
		completed: false
	},
	sanitizeIslandCounter: {
		id: "sanitizeIslandCounter",
		simpleName: "Sanitize The Island Counter",
		detail: "",
		completed: false
	},
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