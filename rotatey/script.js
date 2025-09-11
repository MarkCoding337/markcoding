var ctx;
var gameMenu;
class Menu extends Phaser.Scene {
	constructor() {
		super("Menu");
	}
	create() {
		ctx = this;
		gameMenu = document.getElementById("gameMenu");
		gameMenu.style.display = "none";
		/*gameMenu.onclick = () => {
			if(gameMenu.style.left == "0px") {
				gameMenu.style.left = "";
				gameMenu.style.backgroundColor = "#6666BB";
				gameMenu.style.border = "";
			} else {
				gameMenu.style.left = "0px";
				gameMenu.style.backgroundColor = "#444499";
				gameMenu.style.border = "solid black 2px";
			};
		}*/
		this.startB = this.add.rectangle(config.width/2,config.height - 200, 200, 80, 0x000000)
		.setInteractive();
		this.startT = this.add.text(config.width/2,config.height - 200, "Start")
		.setOrigin(0.5,0.5)
		.setFontFamily("Arial, monospace")
		.setFontSize(35);
		
		this.startB.on("pointerover", function() {
			this.setScale(1.1);
		});
		this.startB.on("pointerout", function() {
			this.setScale(1);
		});
		
		this.startB.on("pointerdown", function() {
			this.setScale(0.9);
			ctx.scene.stop();
			ctx.scene.start("Main");
		});
		this.startB.on("pointerup", function() {
			this.setScale(1.1);
		});
	}
}

class Main extends Phaser.Scene {
	constructor() {
		super("Main");
	}
	create() {
		ctx = this;
		gameMenu.style.display = "";
		this.rotateAmt = 0;
		this.rotateBaseline = 0;
		this.args = {
			credits: 0,
			spincrease: 1,
			fullRotation: 360,
			deccelRate: 0.02,
		}
		this.shopItems = {
			incSpinSpeed: {
				DOMId: "incSpinSpeed",
				DOMLabel: "incSpinSpeedLabel",
				costDefault: 20,
				costAmp: 1.5,
				cost: 15,
				level: 0,
				levelIncrement: 1,
			},
			decPorFullRot: {
				DOMId: "decPorFullRot",
				DOMLabel: "decPorFullRotLabel",
				costDefault: 100,
				costAmp: 4,
				cost: 100,
				level: 0,
				levelIncrement: 45,
				max: 315
			},
			decDeccRate: {
				DOMId: "decDeccRate",
				DOMLabel: "decDeccRateLabel",
				costDefault: 20,
				costAmp: 2,
				cost: 20,
				level: 1,
				levelIncrement: 1,
			}
		}
		this.indicator = this.add.rectangle(config.width/2, config.height/2, 3, 110, 0xFF0000)
		.setOrigin(0,1);
		this.corcle = this.add.circle(config.width/2, config.height/2, 100, 0x000000)
		.setInteractive();
		this.rod = this.add.rectangle(config.width/2, config.height/2, 2, 100, 0xFFFFFF)
		.setOrigin(0,1);
		
		this.corcle.on("pointerdown", ()=> {
			this.rotateAmt += this.args.spincrease;
		});
		
		document.getElementById(this.shopItems.incSpinSpeed.DOMId).onclick = () => {
			if(this.args.credits >= this.shopItems.incSpinSpeed.cost) {
				this.args.credits -= this.shopItems.incSpinSpeed.cost;
				this.shopItems.incSpinSpeed.level += this.shopItems.incSpinSpeed.levelIncrement;
				this.calibrateUpgrades();
			}
		}
		document.getElementById(this.shopItems.incSpinSpeed.DOMLabel).innerHTML = "Cost: "+this.shopItems.incSpinSpeed.cost+"<br>Current: "+this.shopItems.incSpinSpeed.level+"<br>Next: "+(this.shopItems.incSpinSpeed.level+this.shopItems.incSpinSpeed.levelIncrement)+"</h4>";
		
		document.getElementById(this.shopItems.decPorFullRot.DOMId).onclick = () => {
			if(this.args.credits >= this.shopItems.decPorFullRot.cost) {
				if(this.shopItems.decPorFullRot.level < 315) {
					this.args.credits -= this.shopItems.decPorFullRot.cost;
					this.shopItems.decPorFullRot.level += this.shopItems.decPorFullRot.levelIncrement;
					this.calibrateUpgrades();
				};
			}
		}
		document.getElementById(this.shopItems.decPorFullRot.DOMLabel).innerHTML = "Cost: "+this.shopItems.decPorFullRot.cost+"<br>Current: "+(360 - this.shopItems.decPorFullRot.level)+"&deg;<br>Next: "+(360 - (this.shopItems.decPorFullRot.level+this.shopItems.decPorFullRot.levelIncrement))+"&deg;</h4>";
		
		document.getElementById(this.shopItems.decDeccRate.DOMId).onclick = () => {
			if(this.args.credits >= this.shopItems.decDeccRate.cost) {
				this.args.credits -= this.shopItems.decDeccRate.cost;
				this.shopItems.decDeccRate.level += this.shopItems.decDeccRate.levelIncrement;
				this.calibrateUpgrades();
			}
		}
		document.getElementById(this.shopItems.decDeccRate.DOMLabel).innerHTML = "Cost: "+this.shopItems.decDeccRate.cost+"<br>Current: "+this.shopItems.decDeccRate.level+"<br>Next: "+(this.shopItems.decDeccRate.level+this.shopItems.decDeccRate.levelIncrement)+"</h4>";
	}
	calibrateUpgrades() {
		this.args.spincrease = 1+this.shopItems.incSpinSpeed.level;
		if(this.shopItems.incSpinSpeed.level > 0){
			this.shopItems.incSpinSpeed.cost = this.shopItems.incSpinSpeed.costDefault*this.shopItems.incSpinSpeed.costAmp*this.shopItems.incSpinSpeed.level;
		};
		document.getElementById(this.shopItems.incSpinSpeed.DOMLabel).innerHTML = "Cost: "+this.shopItems.incSpinSpeed.cost+"<br>Current: "+this.shopItems.incSpinSpeed.level+"<br>Next: "+(this.shopItems.incSpinSpeed.level+this.shopItems.incSpinSpeed.levelIncrement)+"</h4>";
		
		
		this.args.fullRotation = 360-this.shopItems.decPorFullRot.level;
		if(this.shopItems.decPorFullRot.level > 0){
			this.shopItems.decPorFullRot.cost = this.shopItems.decPorFullRot.costDefault*this.shopItems.decPorFullRot.costAmp*this.shopItems.decPorFullRot.level;
		};
		this.indicator.setAngle(-this.shopItems.decPorFullRot.level);
		document.getElementById(this.shopItems.decPorFullRot.DOMLabel).innerHTML = "Cost: "+this.shopItems.decPorFullRot.cost+"<br>Current: "+(360 - this.shopItems.decPorFullRot.level)+"&deg;<br>Next: "+(360 - (this.shopItems.decPorFullRot.level+this.shopItems.decPorFullRot.levelIncrement))+"&deg;</h4>";
		
		if(this.shopItems.decPorFullRot.level == 315) {
			document.getElementById(this.shopItems.decPorFullRot.DOMId).style.pointerEvents = "none";
			document.getElementById(this.shopItems.decPorFullRot.DOMId).style.opacity = "0.2"
		};
		
		this.args.deccelRate = 0.02/(this.shopItems.decDeccRate.level);
		if(this.shopItems.decDeccRate.level > 1){
			this.shopItems.decDeccRate.cost = this.shopItems.decDeccRate.costDefault*this.shopItems.decDeccRate.costAmp*(this.shopItems.decDeccRate.level-1);
		};
		document.getElementById(this.shopItems.decDeccRate.DOMLabel).innerHTML = "Cost: "+this.shopItems.decDeccRate.cost+"<br>Current: "+this.shopItems.decDeccRate.level+"<br>Next: "+(this.shopItems.decDeccRate.level+this.shopItems.decDeccRate.levelIncrement)+"</h4>";
	}
	update() {
		this.rotateBaseline += this.rotateAmt;
		this.rod.setAngle(this.rotateBaseline);
		var a = Math.floor(this.rotateBaseline/this.args.fullRotation);
		this.rotateBaseline -= a*this.args.fullRotation;
		this.args.credits += a;
		for(var i=0;i<a;i++) {
			var b = config.width/2 + (Math.random()*400-200);
			var d = -Math.random()*100;
			var c = this.physics.add.existing(this.add.rectangle(b, config.height/2-100,10,10,0xFFFFFF));
			c.body.velocity.y = -100+d;
			this.time.delayedCall(1000, function(){this.destroy();}, null, c);
		}
		document.getElementById("credLabel").innerHTML = "Credits:<br>&emsp; "+this.args.credits;
		if(this.rotateAmt > 0.05) {
			this.rotateAmt -= this.args.deccelRate*this.rotateAmt;
		} else {
			this.rotateAmt = 0;
		};
	}
}

const config = {
	type: Phaser.AUTO,
    parent: "body",
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#444499",
    //mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
    maxLights: 40,
    fps: {
      forceSetTimeOut: true,
      target: 60
    },
    physics: {
        default: "arcade",
    },
	loader: {
		crossOrigin: "anonymous",
	},
    scene: [Menu, Main],
};
var game = new Phaser.Game(config);