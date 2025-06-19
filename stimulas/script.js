var soundManager;
var phaserG;
var phaserTime;
var cWidth;
var popCounter;
var endCard;

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
    var OrbType = Math.floor(Math.random()*50);
    if(OrbType >= 2) {
      OrbType = 0;
    }
    var gameOrbs = ['particle', 'happyGreen'];
    popCounter = 0;
    endCard = false;
    this.timeCounter = new Date();
    phaserG = this;
    phaserTime = this.time;
    class bouncies extends Phaser.GameObjects.Image {
      constructor(scene) {
        super(scene, 0, 0, gameOrbs[OrbType]);
        }

      fire(x, y, speed) {
        popCounter += 1;
        this.particleG = phaserG.add.particles(x, y, "red", {
          lifespan: 1000,
          speedX: { min:-100, max: 100 },
          speedY: { min: -100, max: 100 },
          scale: 0.6,
          quantity: 1,
          frequency: 10,
          blendMode: "ADD",
          alpha: {start: 1, end: 0},
          rotate: {min: -30, max: 30},
          });
          
        this.particleG.stop();
        this.particleG.depth = -1;
        this.setScale(0.01+(Math.random()*0.01 ));
        this.setInteractive();
        this.setPosition(x, y);
        this.body.setCircle(1500);
        this.body.velocity.x = ((Math.random()*speed)-(speed/2));
        this.body.velocity.y = ((Math.random()*speed)-(speed/2));
        this.body.setAngularVelocity((Math.random()*720)-360);
        let alphaY = Math.random()+0.5;
        if(alphaY>1) {
          alphaY = 1;
        }
        this.setAlpha(alphaY);
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(1);
        this.on("pointerdown", () => {
          if(OrbType == 1) {
            soundManager.play("secretHehe", {volume: 0.8});
          } else {
            soundManager.play("button"+(Math.floor(Math.random()*3)+1), {volume: 0.8});
          };
          this.disableInteractive();
          this.particleG.start();
          phaserTime.delayedCall(200, () => {this.particleG.stop();});
          phaserTime.delayedCall(1000, () => {this.particleG.destroy();});
          popCounter -= 1;
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;
          phaserG.tweens.add({
                targets: this,
                duration: 200,
                alpha: 0,
                scale: 0.05
          });
          phaserTime.delayedCall(200, () => {this.destroy();});
        });
        this.on("pointerover", () => {
          this.setScale(0.025);
        });
        this.on("pointerout", () => {
          this.setScale(0.02);
        });
      }
      update(time, delta) {
        this.particleG.x = this.x;
        this.particleG.y = this.y;
      }
    }
    this.bouncies = this.physics.add.group({
      classType: bouncies,
      maxSize: 1000,
      runChildUpdate: true,
    });
    this.temp1 = this.physics.add.staticGroup();
   this.tempO =  this.add.rectangle(config.width/2, config.height/3, 2, (config.height/3), 0xFFFFFF).setOrigin(0.5,0);
    //this.tempP = this.add.line(100, 100, 0, 0, 0, 100, 0xFFFFFF);
    //this.temp1.add(this.tempP);
    this.temp1.add(this.tempO);
    
    this.physics.add.collider(this.temp1, this.bouncies, () => {
      
    });
    const bounce = this.bouncies.get();
    if (bounce) {
      bounce.fire(config.width/2, config.height-60, 1000);
    }
    for(var i=0;i<=100;i++){
      const bounce = this.bouncies.get();
      if (bounce)
      {
        var jk;
        if(Math.random()*2 > 1 ) {jk = 3} else {jk = 1}
          bounce.fire(config.width/2, config.height/4*(jk), 400);
      }
    };
    //this.physics.add.collider(this.bouncies, this.bouncies);
  }
  update() {
    if(popCounter == 0 && endCard == false) {
      endCard = true;
      
      this.endTime = new Date();
      
      this.timeCounter = this.endTime-this.timeCounter;
      
      var endTime = this.add.text(config.width/2, 0, (Math.floor(this.timeCounter/10)/100 + " Seconds")).setScrollFactor(0).setFontSize(40).setFontFamily("Courier New").setOrigin(0.5,0.5).setShadow(3, 10, 0xFF0000, 20).setColor("#FFD1DC"); 
      
      var endButton = this.add.rectangle(config.width/2, 500, 300,200, 0xFFD1DC).setOrigin(0.5,0.5);
      let shadowFX = endButton.postFX.addShadow(0, 0, 0.5, 0.5, 0xFFD1DC, 2, 0.5);
      endButton.alpha = 0;
      this.tweens.add({
            targets: endButton,
            duration: 1000,
            alpha: 1
        });
      this.tweens.add({
            targets: endTime,
            duration: 1000,
            alpha: 1,
            y: 150,
        });
      this.tweens.add({
            targets: this.tempO,
            duration: 1000,
            alpha: 0,
        });
      this.openVal = 0;
      endButton.setInteractive();
      endButton.on('pointerover', () => {
        endButton.setScale(1.1);
        this.sound.play("button1", {volume: 0.8});
      });
      endButton.on('pointerout', () => {
        endButton.setScale(1);
      });
      endButton.on('pointerdown', () => {
        this.sound.play("button1", {volume: 0.8});
        endButton.setScale(0.9);
        this.openVal++;
        if(this.openVal >= 10) {
          this.scene.restart();
        };
      });
      endButton.on('pointerup', () => {
        endButton.setScale(1.1);
      });
    }
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
          arcade: {
             // debug: true,
          },
          default: 'arcade',
        },
        fps: {
          target: 100,
          forceSetTimeOut: true
        },
    };

const game = new Phaser.Game(config);