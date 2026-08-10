var soundManager;
var phaserG;
var phaserTime;
var cWidth;
var popCounter;
var endCard;
var ctx;
var ballSpeed;
var ballCount;
var dragPopChoice;
var mapChoice;

var counter = 0;

var fadeDelay = 500;

class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }
  preload() {
    this.load.image("particle","https://ik.imagekit.io/markathious/Stimulas/blue_bubble.png");
    this.load.image("red", "https://labs.phaser.io/assets/particles/red.png");
    this.load.image("white", "https://labs.phaser.io/assets/particles/white.png");
    this.load.image("happyGreen", "https://cdn.glitch.global/16759f38-d101-4b36-ba93-dc7b873629ca/particle%20(1).png?v=1725907280961");
	this.load.image("backButton", "https://ik.imagekit.io/markathious/Stimulas/backButton.png");
    this.load.audio("button1", "https://ik.imagekit.io/markathious/Stimulas/dragon-studio-pop-402323.mp3");
    this.load.audio("button2", "https://ik.imagekit.io/markathious/Stimulas/dragon-studio-clean-minimal-pop-467466.mp3");
    this.load.audio('button3', "https://ik.imagekit.io/markathious/Stimulas/dragon-studio-pop-402324.mp3");
    this.load.audio('secretHehe', 'https://cdn.glitch.global/16759f38-d101-4b36-ba93-dc7b873629ca/audiomass-output%20(9).mp3?v=1725907730905');
	
  }
  create() {
	  ctx = this;
    if(window.innerWidth < 500) {
      document.querySelector("canvas").style.width = window.innerWidth;
    }
    document.querySelector("canvas").style.left = (window.innerWidth-cWidth)/2+"px";
    soundManager = this.sound;
    const backgroundParticles = this.add.particles(0, 0, 'particle', {
      x: {min: config.width/2-150, max: config.width/2+150 },
      y: {min: 150, max: 200},
      lifespan: 1000,
      speedX: { min:-50, max: 50 },
      speedY: { min: -25, max: 50 },
      scale: { start: 0, end: 0.05 },
      quantity: 1,
      frequency: 150,
      tint: 0x888888,
      alpha: {start: 0.7, end: 0},
      rotate: {min: -30, max: 30},
    });
    let text = this.add.text(config.width/2,160,"STIMULAS").setScrollFactor(0).setFontSize(60).setFontFamily('Courier New').setOrigin(0.5, 0.5).setShadow(3,10,0xFF0000,20).setColor("#004708");
    text.setShadow(-3, 3, 'rgba(4, 135, 6, 0.4)', 2);
    let verText = this.add.text(config.width/2, 205, "Release Delta").setScrollFactor(0).setFontSize(20).setFontFamily("Courier New").setOrigin(0, 0.5).setColor("#FFFFFF");
		
	
	
    let start = this.add.rectangle(config.width/2, 500, 300,200, 0x004708).setOrigin(0.5,0.5);
    this.openVal = 0;
    start.setInteractive();
    start.on('pointerover', () => {
      start.setScale(1.1);
      this.sound.play("button1", {volume: 0.8});
    });
    start.on('pointerout', () => {
      start.setScale(1);
    });
    start.on('pointerdown', () => {
      this.sound.play("button1", {volume: 0.8});
      start.setScale(0.9);
      this.openVal++;
      if(this.openVal >= 5) {
		start.disableInteractive();
		this.tweens.add({
			targets: [backgroundParticles, text, start, verText],
			x: config.width*2,
			duration: 1000,
			ease: "Quad.easeInOut",
			onComplete: ()=>{
				ctx.scene.stop("Start");
				ctx.scene.start("SelectScene");
			}
		});
      };
    });
    start.on('pointerup', () => {
      start.setScale(1.1);
    });
    
    let shadowFX = start.postFX.addShadow(0, 0, 0.5, 0.5, 0x307738, 2, 0.5);
	this.cameras.main.fadeIn(fadeDelay);
  } 

}

class SelectScene extends Phaser.Scene {
	constructor() {
		super("SelectScene");
	}
	create() {
		ctx = this;
		let backButton = this.add.image(10,10, "backButton").setOrigin(0,0).setDisplaySize(45,45).setInteractive();
		backButton.on('pointerover', () => {
		  backButton.setDisplaySize(50,50);
		  this.sound.play("button1", {volume: 0.8});
		});
		backButton.on('pointerout', () => {
		  backButton.setDisplaySize(45,45);
		});
		backButton.on('pointerdown', () => {
		  backButton.setDisplaySize(40,40);
		  backButton.disableInteractive();
		  this.tweens.add({
			targets: [poppingGameContainer, titleText, backButton],
			x: -config.width,
			duration: 1000,
			ease: "Quad.easeInOut",
			onComplete: ()=>{
				ctx.scene.stop();
				ctx.scene.start("Start");
			}
		});
		  this.sound.play("button1", {volume: 0.8});
		});
		backButton.on('pointerup', () => {
		  backButton.setDisplaySize(50,50);
		});
		let titleText = this.add.text(config.width/2, config.height/12, "Please Select A Game").setFontFamily("Arial").setOrigin(0.5, 0).setFontSize(30).setAngle(-1);
		this.tweens.add({
			targets: titleText,
			angle: 1,
			yoyo: true,
			persist: true,
			repeat: -1,
			duration: 1000,
			ease: "Quad.easeInOut"
		});
		let poppingGame = this.add.image(config.width/3, config.height/4, "particle").setDisplaySize(config.width/4, config.width/4).setInteractive();
		let poppingGameText = this.add.text(config.width/3, config.height/4, "Bubble Popping").setOrigin(0.5,0).setStroke("#000000", 8).setFontFamily("Arial");
		let poppingGameContainer = this.add.container(0,0,[poppingGame, poppingGameText]);
		poppingGame.on('pointerover', () => {
		  poppingGame.setDisplaySize(config.width/4+10, config.width/4+10);
		  this.sound.play("button1", {volume: 0.8});
		});
		poppingGame.on('pointerout', () => {
		  poppingGame.setDisplaySize(config.width/4, config.width/4);
		});
		poppingGame.on('pointerdown', () => {
		  poppingGame.setDisplaySize(config.width/4-10, config.width/4-10);
		  poppingGame.disableInteractive();
		  ctx.cameras.main.fadeOut(fadeDelay, 0, 0, 0)
		  this.tweens.add({
			targets: [poppingGameContainer, popWavesGameContainer, titleText, backButton],
			x: -config.width,
			duration: 1000,
			ease: "Quad.easeInOut",
			onComplete: ()=>{
				ctx.scene.stop();
				ctx.scene.start("PoppingOptions");
			}
		});
		  this.sound.play("button1", {volume: 0.8});
		});
		poppingGame.on('pointerup', () => {
		  poppingGame.setDisplaySize(config.width/4+10, config.width/4+10);
		});

		let popWavesGame = this.add.image(config.width/3*2, config.height/4, "particle").setDisplaySize(config.width/4, config.width/4).setInteractive();
		let popWavesGameText = this.add.text(config.width/3*2, config.height/4, "Pop Waves").setOrigin(0.5,0).setStroke("#000000", 8).setFontFamily("Arial");
		let popWavesGameContainer = this.add.container(0,0,[popWavesGame, popWavesGameText]);
		popWavesGame.on('pointerover', () => {
		  popWavesGame.setDisplaySize(config.width/4+10, config.width/4+10);
		  this.sound.play("button1", {volume: 0.8});
		});
		popWavesGame.on('pointerout', () => {
		  popWavesGame.setDisplaySize(config.width/4, config.width/4);
		});
		popWavesGame.on('pointerdown', () => {
		  popWavesGame.setDisplaySize(config.width/4-10, config.width/4-10);
		  popWavesGame.disableInteractive();
		  ctx.cameras.main.fadeOut(fadeDelay, 0, 0, 0)
		  this.tweens.add({
			targets: [popWavesGameContainer, poppingGameContainer, titleText, backButton],
			x: -config.width,
			duration: 1000,
			ease: "Quad.easeInOut",
			onComplete: ()=>{
				ctx.scene.stop();
				ctx.scene.start("PopWaves");
			}
		});
		  this.sound.play("button1", {volume: 0.8});
		});
		popWavesGame.on('pointerup', () => {
		  popWavesGame.setDisplaySize(config.width/4+10, config.width/4+10);
		});

		this.cameras.main.fadeIn(fadeDelay);
	}
	update() {
		
	}
}

class PoppingOptions extends Phaser.Scene {
	constructor() {
		super("PoppingOptions");
	}
	create() {
		ctx = this;
		let targets = [];
		var buttonWidth = config.width-200;
		if(buttonWidth < 300) {
			buttonWidth = 300;
		}
		let backButton = this.add.image(10,10, "backButton").setOrigin(0,0).setDisplaySize(45,45).setInteractive();
		backButton.on('pointerover', () => {
		  backButton.setDisplaySize(50,50);
		  this.sound.play("button1", {volume: 0.8});
		});
		backButton.on('pointerout', () => {
		  backButton.setDisplaySize(45,45);
		});
		backButton.on('pointerdown', () => {
		    backButton.setDisplaySize(40,40);
		    backButton.disableInteractive();
		    ctx.cameras.main.fadeOut(fadeDelay, 0, 0, 0, (camera, progress)=>{
				if(progress >= 0.99) {
					ctx.scene.stop();
					ctx.scene.start("SelectScene");
				}
			});	
		});
		
		let titleText = this.add.text(config.width/2, 20, "Bubble Popping").setFontFamily("Arial").setOrigin(0.5, 0).setFontSize(30).setAngle(-1);
		this.tweens.add({
			targets: titleText,
			angle: 1,
			yoyo: true,
			persist: true,
			repeat: -1,
			duration: 1000,
			ease: "Quad.easeInOut"
		});
		
		if (dragPopChoice == undefined) {
			dragPopChoice = 0;
		}
		var dragPopChoices = ["Enabled", "Disabled"];
		this.dragPop = this.add.rectangle(config.width/2, 185, buttonWidth, 75, 0xFFFFFF).setInteractive();
		this.add.text(config.width/2, 165, "Drag To Pop").setFontSize(30).setFontFamily("Courier New").setOrigin(0.5, 0.5).setColor("#000000");
		this.add.rectangle(config.width/2, 185, buttonWidth, 2, 0x000000);
		this.dragPopText = this.add.text(config.width/2, 201, dragPopChoices[dragPopChoice]).setFontSize(20).setFontFamily("Arial").setOrigin(0.5, 0.5).setColor("#000000").setAngle(-4);
		this.tweens.add({
			targets: this.dragPopText,
			angle: 4,
			repeat: -1,
			yoyo: true,
			persist: true,
			ease: "Quad.easeInOut",
		});
		
		this.dragPop.on('pointerover', () => {
		  this.dragPop.setScale(1.1);
		});
		this.dragPop.on('pointerout', () => {
		  this.dragPop.setScale(1);
		});
		this.dragPop.on('pointerdown', () => {
		  this.sound.play("button1", {volume: 0.8});
		  this.dragPop.setScale(0.9);
		  if(dragPopChoice >= 1) {
			  dragPopChoice = 0;
		  } else {
			  dragPopChoice += 1;
		  };
		  this.dragPopText.setText(dragPopChoices[dragPopChoice]);
		});
		this.dragPop.on('pointerup', () => {
		  this.dragPop.setScale(1.1);
		});
			
		if (ballSpeed == undefined) {
			ballSpeed = 1;
		}
		var ballSpeeds = ["Zen", "Normal", "Insane", "Ludicrous"];
			
		this.speedIndicator = this.add.rectangle(config.width/2, 345, buttonWidth, 75, 0xFFFFFF).setInteractive();
		this.add.text(config.width/2, 325, "Ball Speed").setFontSize(30).setFontFamily("Courier New").setOrigin(0.5, 0.5).setColor("#000000");
		this.add.rectangle(config.width/2, 345, buttonWidth, 2, 0x000000);
		this.speedText = this.add.text(config.width/2, 365, ballSpeeds[ballSpeed]).setFontSize(20).setFontFamily("Arial").setOrigin(0.5, 0.5).setColor("#000000").setAngle(-4);
		this.tweens.add({
			targets: this.speedText,
			angle: 4,
			repeat: -1,
			yoyo: true,
			persist: true,
			ease: "Quad.easeInOut",
		});
		
		this.speedIndicator.on('pointerover', () => {
		  this.speedIndicator.setScale(1.1);
		});
		this.speedIndicator.on('pointerout', () => {
		  this.speedIndicator.setScale(1);
		});
		this.speedIndicator.on('pointerdown', (e) => {
		    this.sound.play("button1", {volume: 0.8});
		    this.speedIndicator.setScale(0.9);
			if(e.x >= config.width/2) {
				if(ballSpeed >= 3) {
					ballSpeed = 0;
				} else {
					ballSpeed += 1;
				};
			} else {
				if(ballSpeed <= 0) {
					ballSpeed = 3;
				} else {
					ballSpeed -= 1;
				};
			}
		    this.speedText.setText(ballSpeeds[ballSpeed]);
		});
		this.speedIndicator.on('pointerup', () => {
		    this.speedIndicator.setScale(1.1);
		});
		
		if (ballCount == undefined) {
			ballCount = 2;
		}
		var ballCounts = ["Lower", "Low", "Normal", "A Lot", "Absurd", "Death"];
		this.countIndicator = this.add.rectangle(config.width/2, 265, buttonWidth, 75, 0xFFFFFF).setInteractive();
		this.add.text(config.width/2, 245, "Ball Count").setFontSize(30).setFontFamily("Courier New").setOrigin(0.5, 0.5).setColor("#000000");
		this.add.rectangle(config.width/2, 265, buttonWidth, 2, 0x000000);
		this.countText = this.add.text(config.width/2, 285, ballCounts[ballCount]).setFontSize(20).setFontFamily("Arial").setOrigin(0.5, 0.5).setColor("#000000").setAngle(4);
		this.tweens.add({
			targets: this.countText,
			angle: -4,
			repeat: -1,
			yoyo: true,
			persist: true,
			ease: "Quad.easeInOut",
		});
		
		this.countIndicator.on('pointerover', () => {
		  this.countIndicator.setScale(1.1);
		});
		this.countIndicator.on('pointerout', () => {
		  this.countIndicator.setScale(1);
		});
		this.countIndicator.on('pointerdown', (e) => {
		  this.sound.play("button1", {volume: 0.8});
		  this.countIndicator.setScale(0.9);
		  if(e.x >= config.width/2) {
				if(ballCount >= 5) {
					ballCount = 0;
				} else {
					ballCount += 1;
				};
			} else {
				if(ballCount <= 0) {
					ballCount = 5;
				} else {
					ballCount -= 1;
				};
			}
		  this.countText.setText(ballCounts[ballCount]);
		});
		this.countIndicator.on('pointerup', () => {
		  this.countIndicator.setScale(1.1);
		});
		
		if (mapChoice == undefined) {
			mapChoice = 0;
		}
		var maps = ["Random", "Single Bar", "Empty", "Double Bar", "Plinko", "Triangled"];
		this.mapIndicator = this.add.rectangle(config.width/2, 425, buttonWidth, 75, 0xFFFFFF).setInteractive();
		this.add.text(config.width/2, 405, "Map").setFontSize(30).setFontFamily("Courier New").setOrigin(0.5, 0.5).setColor("#000000");
		this.add.rectangle(config.width/2, 425, buttonWidth, 2, 0x000000);
		this.mapText = this.add.text(config.width/2, 445, maps[mapChoice]).setFontSize(20).setFontFamily("Arial").setOrigin(0.5, 0.5).setColor("#000000").setAngle(4);
		this.tweens.add({
			targets: this.mapText,
			angle: -4,
			repeat: -1,
			yoyo: true,
			persist: true,
			ease: "Quad.easeInOut",
		});
		if (mapChoice == undefined) {
			mapChoice = 0;
		}
		
		this.mapIndicator.on('pointerover', () => {
		  this.mapIndicator.setScale(1.1);
		});
		this.mapIndicator.on('pointerout', () => {
		  this.mapIndicator.setScale(1);
		});
		this.mapIndicator.on('pointerdown', (e) => {
		    this.sound.play("button1", {volume: 0.8});
		    this.mapIndicator.setScale(0.9);
			if(e.x >= config.width/2) {
				if(mapChoice >= 5) {
					mapChoice = 0;
				} else {
					mapChoice += 1;
				};
			} else {
				if(mapChoice <= 0) {
					mapChoice = 5;
				} else {
					mapChoice -= 1;
				};
			}
		    this.mapText.setText(maps[mapChoice]);
		});
		this.mapIndicator.on('pointerup', () => {
		    this.mapIndicator.setScale(1.1);
		});
		
		let start = this.add.rectangle(config.width/2, 550, buttonWidth, 150, 0x004708).setOrigin(0.5,0.5);
		start.setInteractive();
		start.on('pointerover', () => {
		  start.setScale(1.1);
		  this.sound.play("button1", {volume: 0.8});
		});
		start.on('pointerout', () => {
		  start.setScale(1);
		});
		start.on('pointerdown', () => {
			this.sound.play("button1", {volume: 0.8});
			start.setScale(0.9);
			start.disableInteractive();
			ctx.cameras.main.fadeOut(fadeDelay, 0, 0, 0, (camera, progress)=>{
				if(progress >= 0.99) {
					ctx.scene.stop();
					ctx.scene.start("Popping");
				}
			});
		});
		start.on('pointerup', () => {
		  start.setScale(1.1);
		});
		
		let shadowFX = start.postFX.addShadow(0, 0, 0.5, 0.5, 0x307738, 2, 0.5);
		
		this.cameras.main.fadeIn(fadeDelay);
	}
}

class Popping extends Phaser.Scene {
  constructor() {
		super("Popping");
  }
  create() {
	  ctx = this;
	  var borderWidth = 10;
	  var ballMaxSpeeds = [1.5, 2.5, 6, 20];
	  var ballCounts = [20, 30, 50, 100, 200, 500];
	  var dragChoice = ["pointerover", "pointerdown"];
	  this.ballMaxSpeed = ballMaxSpeeds[ballSpeed]*2;
	  this.ballMinSpeed = this.ballMaxSpeed/2;
		this.topWall = this.matter.add.rectangle(config.width/2, 0, config.width, borderWidth, {
			isStatic: true,
			slop: 0,
			restitution: 1,
		});
		this.bottomWall = this.matter.add.rectangle(config.width/2, config.height, config.width, borderWidth, {
			isStatic: true,
			slop: 0,
			restitution: 1,
		});
		this.leftWall = this.matter.add.rectangle(0, config.height/2, borderWidth, config.height, {
			isStatic: true,
			slop: 0,
			restitution: 1,
		});
		this.rightWall = this.matter.add.rectangle(config.width, config.height/2, borderWidth, config.height, {
			isStatic: true,
			slop: 0,
			restitution: 1,
		});
		if(mapChoice == 0) {
			var mapType = Math.floor(Math.random()*5+1);
		} else {
			mapType = mapChoice;
		};
		if(mapType == 1) {
			this.wall = this.add.rectangle(config.width/2, config.height/2, 5, config.height-400, 0xFFFFFF).setOrigin(0,0);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
			});
		} else if(mapType == 2) {
			
		} else if(mapType == 3) {
			this.wall = this.add.rectangle(config.width/4, config.height/2, 5, config.height-400, 0xFFFFFF).setOrigin(0,0);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
			});
			this.wall = this.add.rectangle(config.width/4*3, config.height/2, 5, config.height-400, 0xFFFFFF).setOrigin(0,0);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
			});
		} else if(mapType == 4) {
			this.wall = this.add.circle(config.width/5, config.height/5, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			this.wall = this.add.circle(config.width/5*2, config.height/5, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			this.wall = this.add.circle(config.width/5*3, config.height/5, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			this.wall = this.add.circle(config.width/5*4, config.height/5, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			
			//LL 2
			
			this.wall = this.add.circle(config.width/4, config.height/5*2, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			this.wall = this.add.circle(config.width/4*2, config.height/5*2, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			this.wall = this.add.circle(config.width/4*3, config.height/5*2, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			
			//LL 3
			
			this.wall = this.add.circle(config.width/5, config.height/5*3, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			this.wall = this.add.circle(config.width/5*2, config.height/5*3, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			this.wall = this.add.circle(config.width/5*3, config.height/5*3, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			this.wall = this.add.circle(config.width/5*4, config.height/5*3, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			
			//LL 4
			
			this.wall = this.add.circle(config.width/4, config.height/5*4, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			this.wall = this.add.circle(config.width/4*2, config.height/5*4, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
			this.wall = this.add.circle(config.width/4*3, config.height/5*4, 5, 0xFFFFFF);
			this.wall = this.matter.add.gameObject(this.wall, {
				isStatic: true,
				slop: 0,
				restitution: 1,
				shape: "circle",
			});
		} else if(mapType == 5) {
			var verts = [
			  { x: 0, y: 0 },
			  { x: 100, y: 0 },
			  { x: 0, y: 100 }
			];
			var body = this.matter.add.fromVertices(37.5, 37.5, verts, {
				isStatic: true,
			});
			var poly = this.add.polygon(body.position.x, body.position.y, verts, 0xFFFFFF);
			this.matter.add.gameObject(poly, body, false);
			
			var verts = [
			  { x: 0, y: 0 },
			  { x: 100, y: 0 },
			  { x: 100, y: 100 }
			];
			var body = this.matter.add.fromVertices(config.width-37.5, 37.5, verts, {
				isStatic: true,
			});
			var poly = this.add.polygon(body.position.x, body.position.y, verts, 0xFFFFFF);
			this.matter.add.gameObject(poly, body, false);
			
			var verts = [
			  { x: 0, y: 0 },
			  { x: 100, y: 0 },
			  { x: 100, y: 100 }
			];
			var body = this.matter.add.fromVertices(config.width-37.5, config.height-37.5, verts, {
				isStatic: true,
			});
			var poly = this.add.polygon(body.position.x, body.position.y, verts, 0xFFFFFF);
			this.matter.add.gameObject(poly, body, false).setAngle(90);
			
			var verts = [
			  { x: 0, y: 0 },
			  { x: 100, y: 0 },
			  { x: 0, y: 100 }
			];
			var body = this.matter.add.fromVertices(37.5, config.height-37.5, verts, {
				isStatic: true,
			});
			var poly = this.add.polygon(body.position.x, body.position.y, verts, 0xFFFFFF);
			this.matter.add.gameObject(poly, body, false).setAngle(-90);
			
		}
		this.matter.resolver._restingThresh = 0.001;
		this.totalBalls = 0;
		this.popCD = 0;
		this.createBall = function() {
			this.totalBalls += 1;
			this.ball = this.add.sprite(config.width/2, config.height/2, "particle").setDisplaySize(50,50);
			this.ball = this.matter.add.gameObject(this.ball);
			var selectArr = ["+=360","-=360"];
			var angleChange = selectArr[Math.floor(Math.random()*2)];
			this.ball.rotateTween = ctx.tweens.add({
				targets: this.ball,
				angle: angleChange,
				duration: Math.random()*500+1000,
				repeat: -1,
				persist: true,
			});
			this.ball.setInteractive();
			this.ball.deathPart = this.add.particles(0, 0, "red", {
			  lifespan: 1000,
			  speedX: { min:-100, max: 100 },
			  speedY: { min: -100, max: 100 },
			  scale: 0.6,
			  quantity: 1,
			  frequency: 20,
			  blendMode: "ADD",
			  alpha: {start: 0.5, end: 0},
			  rotate: {min: -30, max: 30},
			});
			let alphaY = Math.random()+0.5;
			if(alphaY>1) {
				alphaY = 1;
			}
			this.ball.setAlpha(alphaY);
			var scale = 50*(Math.random()*0.5+1);
			this.ball.setDisplaySize(scale, scale);
			
			this.ball.deathPart.stop();
			this.ball.deathPart.depth = -1;
			this.ball.on(dragChoice[dragPopChoice], function(){
				if(ctx.popCD <= 0) {
					ctx.popCD = 3;
					ctx.sound.play("button"+(Math.floor(Math.random()*3)+1));
					ctx.totalBalls -= 1;
					this.disableInteractive();
					this.deathPart.setPosition(this.body.position.x, this.body.position.y);
					this.deathPart.start();
					this.setFrictionAir(0.8);
					ctx.time.delayedCall(200, () => {this.deathPart.stop();});
					ctx.time.delayedCall(1000, () => {
						this.deathPart.destroy();
						this.rotateTween.destroy();
						this.destroy();
					});
					ctx.tweens.add({
						targets: this,
						duration: 500,
						alpha: 0,
						scale: 0.05
					});
					if(ctx.totalBalls <= 0) {
						ctx.cameras.main.fadeOut(1500, 0, 0, 0, (camera, progress)=>{
							if(progress >= 0.99) {
								ctx.scene.stop();
								ctx.scene.start("PoppingOptions");
							};
						});
					};
				};
			}, this.ball);
			this.ball.setBody({
				type: "circle",
				radius: (scale/2)*0.9,
			}, {
				restitution: 1,
				frictionAir: 0,
				friction: 0,
				inertia: Infinity,
				slop: 0,
				frictionStatic: -1,
			})
			this.ball.setCollisionGroup(-1);
			this.ball.setBounce(1);
			this.ball.setVelocity(Math.random()*this.ballMaxSpeed-this.ballMinSpeed,Math.random()*this.ballMaxSpeed-this.ballMinSpeed);
		};
		for(var i=0;i<ballCounts[ballCount];i++) {
			this.createBall();
		}
    }
    update() {
		if(this.popCD > 0) {
			this.popCD -= 1;
		}
    }
}

class PopWaves extends Phaser.Scene {
  constructor() {
		super("PopWaves");
  }
  create() {
	ctx = this;
	this.gameStarted = false;
	var buttonWidth = config.width-200;
	if(buttonWidth < 300) {
		buttonWidth = 300;
	}

	let backButton = this.add.image(10,10, "backButton").setOrigin(0,0).setDisplaySize(45,45).setInteractive();
	backButton.on('pointerover', () => {
		backButton.setDisplaySize(50,50);
		this.sound.play("button1", {volume: 0.8});
	});
	backButton.on('pointerout', () => {
		backButton.setDisplaySize(45,45);
	});
	backButton.on('pointerdown', () => {
		backButton.setDisplaySize(40,40);
		backButton.disableInteractive();
		ctx.cameras.main.fadeOut(fadeDelay, 0, 0, 0, (camera, progress)=>{
			if(progress >= 0.99) {
				ctx.scene.stop();
				ctx.scene.start("SelectScene");
			}
		});	
	});
	let start = this.add.rectangle(config.width/2, 550, buttonWidth, 150, 0x004708).setOrigin(0.5,0.5);
	start.setInteractive();
	start.on('pointerover', () => {
		start.setScale(1.1);
		this.sound.play("button1", {volume: 0.8});
	});
	start.on('pointerout', () => {
		start.setScale(1);
	});
	start.on('pointerdown', () => {
		this.sound.play("button1", {volume: 0.8});
		start.setScale(0.9);
		start.disableInteractive();
		this.cameras.main.fadeOut(fadeDelay, 0, 0, 0, (camera, progress)=>{
			if(progress >= 0.99) {
				start.destroy();
				backButton.setVisible();
				this.startGame();
				this.cameras.main.fadeIn(fadeDelay);
			}
		});
	});
	start.on('pointerup', () => {
		start.setScale(1.1);
	});
	
	let shadowFX = start.postFX.addShadow(0, 0, 0.5, 0.5, 0x307738, 2, 0.5);

	this.events.on('resume', () => {
		// 1. Force Phaser systems alive
		this.sys.setActive(true);
		
		// 2. Wake up Matter and reset its internal step delta
		if (this.matter && this.matter.world) {
			this.matter.world.resume();
		}
		
		// 3. Kickstart Phaser's timers and tweens
		this.time.paused = false;
		this.tweens.resumeAll();
	});

	this.matter.world.on('collisionstart', (event) => {
		event.pairs.forEach((pair) => {
			const { bodyA, bodyB } = pair;
			// Check if one of the bodies is our bottom sensor
			if (bodyA.label === 'floorSensor' || bodyB.label === 'floorSensor') {
				// Identify which body is the incoming object
				const targetBody = bodyA.label === 'floorSensor' ? bodyB : bodyA;

				// Check if the body has your specific tag
				if (targetBody.label === 'ball') {
					// Safely get the Phaser Game Object attached to the Matter body
					const gameObject = targetBody.gameObject;
					if (gameObject && gameObject.active) {
						gameObject.active = false; // Mark the game object as inactive to prevent further interactions
						gameObject.deathPart.setPosition(targetBody.position.x, targetBody.position.y);
						gameObject.deathPart.start();
						ctx.health -= 1;
						ctx.time.delayedCall(100, () => {
							gameObject.deathPart.stop();
						});
						ctx.time.delayedCall(1000, () => {
							gameObject.deathPart.destroy();
							gameObject.rotateTween.destroy();
						});
						ctx.time.delayedCall(1100, () => {
							gameObject.destroy();
						});
						ctx.tweens.add({
							targets: gameObject,
							duration: 500,
							alpha: 0,
							scale: 0.05
						});
					}
				}
			}
		});
	});

	this.cameras.main.fadeIn(fadeDelay);
  }
  startGame() {
	ctx = this;
	  var borderWidth = 10;
	  this.ballSpawnInterval = 60;
	  this.ballMaxSpeed = 2.5;
	  this.ballMinSpeed = 1.25;
	  this.health = 100;
	  this.points = 0;
	  this.healthText = this.add.text(20, 20, "Health: "+this.health).setFontSize(30).setFontFamily("Arial").setOrigin(0, 0).setAngle(-1);
	  this.pointsText = this.add.text(20, 60, "Points: "+this.points).setFontSize(20).setFontFamily("Arial").setOrigin(0, 0).setAngle(1);
	  this.menuButton = this.add.image(config.width-20, 20, "backButton").setOrigin(1,0).setDisplaySize(30,30);
	  this.menuButton.setInteractive();
	  this.menuButton.on('pointerover', () => {
		this.menuButton.setDisplaySize(35,35);
		this.sound.play("button1", {volume: 0.8});
	  });
	  this.menuButton.on('pointerout', () => {
		this.menuButton.setDisplaySize(30,30);
	  });
	  this.menuButton.on('pointerdown', () => {
		this.menuButton.setDisplaySize(25,25);
		this.scene.pause();
		this.scene.launch("PopWavesMenu");
		
	  });
	  this.topWall = this.matter.add.rectangle(config.width/2, 0, config.width, borderWidth, {
			isStatic: true,
			slop: 0,
			restitution: 1,
		});
		this.leftWall = this.matter.add.rectangle(0, config.height/2, borderWidth, config.height, {
			isStatic: true,
			slop: 0,
			restitution: 1,
		});
		this.rightWall = this.matter.add.rectangle(config.width, config.height/2, borderWidth, config.height, {
			isStatic: true,
			slop: 0,
			restitution: 1,
		});
		this.bottomSensor = this.matter.add.rectangle(
			config.width / 2, 
			config.height + (borderWidth / 2), 
			config.width, 
			borderWidth, 
			{ isStatic: true, isSensor: true }
		);
		this.bottomSensor.label = 'floorSensor';
		this.matter.resolver._restingThresh = 0.001;
		this.totalBalls = 0;
		this.popCD = 0;
		this.createBall = function() {
			this.totalBalls += 1;
			var randX = Math.random()*(config.width-30)+15;
			var randY = Math.random()*(20)+100;
			this.ball = this.add.sprite(randX, randY, "particle").setDisplaySize(50,50);
			this.ball = this.matter.add.gameObject(this.ball);
			var selectArr = ["+=360","-=360"];
			var angleChange = selectArr[Math.floor(Math.random()*2)];
			this.ball.rotateTween = ctx.tweens.add({
				targets: this.ball,
				angle: angleChange,
				duration: Math.random()*500+1000,
				repeat: -1,
				persist: true,
			});
			this.ball.setInteractive();
			this.ball.deathPart = this.add.particles(0, 0, "red", {
			  lifespan: 1000,
			  speedX: { min:-100, max: 100 },
			  speedY: { min: -100, max: 100 },
			  scale: 0.6,
			  quantity: 1,
			  frequency: 20,
			  blendMode: "ADD",
			  alpha: {start: 0.5, end: 0},
			  rotate: {min: -30, max: 30},
			});
			let alphaY = Math.random()+0.5;
			if(alphaY>1) {
				alphaY = 1;
			}
			this.ball.setAlpha(alphaY);
			var scale = 50*(Math.random()*0.5+1);
			this.ball.setDisplaySize(scale, scale);
			
			this.ball.deathPart.stop();
			this.ball.deathPart.depth = -1;
			this.ball.on("pointerdown", function(){
				if(ctx.popCD <= 0) {
					ctx.popCD = 3;
					ctx.sound.play("button"+(Math.floor(Math.random()*3)+1));
					ctx.totalBalls -= 1;
					ctx.points += 1;
					this.disableInteractive();
					this.deathPart.setPosition(this.body.position.x, this.body.position.y);
					this.deathPart.start();
					this.setFrictionAir(0.8);
					ctx.time.delayedCall(200, () => {this.deathPart.stop();});
					ctx.time.delayedCall(1000, () => {
						this.deathPart.destroy();
						this.rotateTween.destroy();
						this.destroy();
					});
					ctx.tweens.add({
						targets: this,
						duration: 500,
						alpha: 0,
						scale: 0.05
					});
				};
			}, this.ball);
			this.ball.setBody({
				type: "circle",
				radius: (scale/2)*0.9,
			}, {
				restitution: 1,
				frictionAir: 0,
				friction: 0,
				inertia: Infinity,
				slop: 0,
				frictionStatic: -1,
			})
			
			this.ball.body.label = "ball";
			this.ball.setCollisionGroup(-1);
			this.ball.setBounce(1);
			this.ball.setVelocity(Math.random()*this.ballMaxSpeed-this.ballMinSpeed,Math.random()*3+1.5);
		};
		
	this.gameStarted = true;
  }
  update() {
	if(this.gameStarted) {
		this.healthText.setText("Health: "+this.health);
		this.pointsText.setText("Points: "+this.points);
		if(this.ballSpawnInterval > 0) {
			this.ballSpawnInterval -= 1;
		} else if (this.ballSpawnInterval <= 0) {
			this.ballSpawnInterval = 30;
			this.createBall();
		}
		if (this.popCD > 0) {
			this.popCD -= 1;
		}
	}
  }
}

class PopWavesMenu extends Phaser.Scene {
  constructor() {
		super("PopWavesMenu");
  }
  create() {

	this.add.rectangle(0, 0, config.width, config.height, { color: 0x000000 }).setOrigin(0,0).setAlpha(0.5);
	var buttonWidth = config.width-200;
	if(buttonWidth < 300) {
		buttonWidth = 300;
	}
	let backButton = this.add.image(10,10, "backButton").setOrigin(0,0).setDisplaySize(45,45).setInteractive();
	backButton.on('pointerover', () => {
		backButton.setDisplaySize(50,50);
		this.sound.play("button1", {volume: 0.8});
	});
	backButton.on('pointerout', () => {
		backButton.setDisplaySize(45,45);
	});
	backButton.on('pointerdown', () => {
		backButton.setDisplaySize(40,40);
		this.scene.stop("PopWavesMenu");
		this.scene.resume("PopWaves")
	});
  }
}

if (window.innerWidth < 500) {
  cWidth = window.innerWidth;
} else {
  cWidth = 500;
}

const config = {
        type: Phaser.AUTO,
        width: cWidth,
        height: window.innerHeight,
        backgroundColor: "#16161d",
        scene: [Start, SelectScene, PoppingOptions, Popping, PopWaves, PopWavesMenu],
        physics: {
          matter: {
             //debug: true,
			 gravity: {
				y: 0
			 }
          },
          default: 'matter',
        },
        fps: {
          target: 60,
          forceSetTimeOut: true
        },
    };

const game = new Phaser.Game(config);