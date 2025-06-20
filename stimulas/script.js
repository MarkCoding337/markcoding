var soundManager;
var phaserG;
var phaserTime;
var cWidth;
var popCounter;
var endCard;
var ctx;
var ballSpeed;

class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }
  preload() {
    this.load.image("particle","https://cdn.glitch.global/16759f38-d101-4b36-ba93-dc7b873629ca/particle.png?v=1724899988378");
    this.load.image("red", "https://cdn.glitch.global/16759f38-d101-4b36-ba93-dc7b873629ca/image_2024-08-29_132609369.png?v=1724955970277");
    this.load.image("white", "https://cdn.glitch.global/16759f38-d101-4b36-ba93-dc7b873629ca/image_2024-08-29_132621354.png?v=1724955981895");
    this.load.image("happyGreen", "https://cdn.glitch.global/16759f38-d101-4b36-ba93-dc7b873629ca/particle%20(1).png?v=1725907280961");
    this.load.audio("button1", "https://cdn.glitch.global/16759f38-d101-4b36-ba93-dc7b873629ca/mixkit-arcade-game-jump-coin-216.wav?v=1724899093217");
    this.load.audio("button2", "https://cdn.glitch.global/16759f38-d101-4b36-ba93-dc7b873629ca/audiomass-output%20(7).mp3?v=1724901939238");
    this.load.audio('button3', "https://cdn.glitch.global/16759f38-d101-4b36-ba93-dc7b873629ca/audiomass-output%20(8).mp3?v=1724902388902");
    this.load.audio('secretHehe', 'https://cdn.glitch.global/16759f38-d101-4b36-ba93-dc7b873629ca/audiomass-output%20(9).mp3?v=1725907730905');
  }
  create() {
    if(window.innerWidth < 500) {
      document.querySelector("canvas").style.width = window.innerWidth;
    }
    document.querySelector("canvas").style.left = (window.innerWidth-cWidth)/2+"px";
    soundManager = this.sound;
    const backgroundParticles2 = this.add.particles(0, 0, 'particle', {
      x: {min: config.width/2-150, max: config.width/2+150 },
      y: {min: 100, max: 200},
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
    let text = this.add.text(config.width/2,150,"STIMULAS").setScrollFactor(0).setFontSize(60).setFontFamily('Courier New').setOrigin(0.5, 0.5).setShadow(3,10,0xFF0000,20).setColor("#FFD1DC");
    text.setShadow(-3, 3, 'rgba(255,255,255,0.4)', 2);
        this.add.text(config.width/2, 180, "Release Beta").setScrollFactor(0).setFontSize(20).setFontFamily("Courier New").setOrigin(0, 0.5).setColor("#FFFFFF");
	
	this.speedIndicator = this.add.rectangle(config.width/2, 350, 250, 50, 0xFFFFFF).setInteractive();
	this.speedText = this.add.text(config.width/2, 350, "Normal").setFontSize(20).setFontFamily("Arial").setOrigin(0.5, 0.5).setColor("#000000").setAngle(-5);
	this.tweens.add({
		targets: this.speedText,
		angle: 5,
		repeat: -1,
		yoyo: true,
		persist: true,
		ease: "Quad.easeInOut",
	});
	ballSpeed = 1;
	var ballSpeeds = ["Zen", "Normal", "Insane"];
	
	this.speedIndicator.on('pointerover', () => {
      this.speedIndicator.setScale(1.1);
    });
    this.speedIndicator.on('pointerout', () => {
      this.speedIndicator.setScale(1);
    });
    this.speedIndicator.on('pointerdown', () => {
      this.sound.play("button1", {volume: 0.8});
      this.speedIndicator.setScale(0.9);
	  if(ballSpeed >= 2) {
		  ballSpeed = 0;
	  } else {
		  ballSpeed += 1;
	  };
	  this.speedText.setText(ballSpeeds[ballSpeed]);
    });
    this.speedIndicator.on('pointerup', () => {
      this.speedIndicator.setScale(1.1);
    });
	
    let start = this.add.rectangle(config.width/2, 500, 300,200, 0xFFD1DC).setOrigin(0.5,0.5);
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
        this.scene.stop("Start");
        this.scene.start("Main");
      };
    });
    start.on('pointerup', () => {
      start.setScale(1.1);
    });
    
    let shadowFX = start.postFX.addShadow(0, 0, 0.5, 0.5, 0xFFD1DC, 2, 0.5)
  } 

}

class Main extends Phaser.Scene {
  constructor() {
		super("Main");
  }
  create() {
	  ctx = this;
	  var borderWidth = 10;
	  var ballMaxSpeeds = [1.5, 2.5, 6];
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
		this.wall = this.add.rectangle(config.width/2, config.height/2, 10, 100, 0xFFFFFF).setOrigin(0,0);
		this.wall = this.matter.add.gameObject(this.wall, {
			isStatic: true,
			slop: 0,
			restitution: 1,
		});
		this.matter.resolver._restingThresh = 0.001;
		this.createBall = function() {
			this.ball = this.add.sprite(config.width/2, 80, "particle").setDisplaySize(50,50);
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
				console.log("arg");
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
			}, this.ball);
			this.ball.setBody({
				type: "circle",
				radius: scale/2,
				maxSides: 10,
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
		for(var i=0;i<100;i++) {
			this.createBall();
		}
  }
  update() {
	  
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
        backgroundColor: "#000000",
        scene: [Start, Main],
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
          target: 100,
          forceSetTimeOut: true
        },
    };

const game = new Phaser.Game(config);