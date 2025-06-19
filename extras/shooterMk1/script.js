var gameVars = {
  velX: 0,
  velY: 0,
  dash: false,
  lDir: 'F',
  timeVar: null,
  physicsVars: null,
  playerHealth: 100,
  playerMaxHealth: 100,
  playerMana: 100,
  playerMaxMana: 100,
  playerManaRegen: 0.5,
  immune: false,
  score: 0,
  dropHeals: null,
  spacingDir: null,
  currentWeapon: 0,
  weaponDictionary: [
    'Slash',
    'Force Blast',
  ],
  directionary: {
    'F': [0, 1],
    'B': [0, -1],
    'R': [1, 0],
    'L': [-1, 0],
  },
  expLevel: 0,
  expReq: 25,
  playerLevel: 0,
  projectileUpgrades: {
    sizeMod: 1,
    speedMod: 1,
    manaCost: 10,
    cd: 200,
    dmg: 50,
  },
  slashUpgrades: {
    sizeMod: 1,
    speedMod: 1,
    manaCost: 0,
    cd: 400,
    dmg: 40,
  },
  monsters: {
    delay: 32000,
    amt: 5,
    scale: 1,
  }
};

var keys = {};

class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }
  preload() {
    this.load.image('button', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/button.png?v=1712939740274')
  }
  create() {
    let startButton = this.add.image(0,150, 'button').setOrigin(0,0).setDisplaySize(500,80);
    this.add.text(15, 162, 'Start', {fontSize: 40});
    
    startButton.setInteractive();
    
    startButton.on('pointerover', () => {
      startButton.setTint("0x888888");
    });
    
    startButton.on('pointerout', () => {
      startButton.setTint("0xFFFFFF");
    });
    
    startButton.on('pointerdown', () => {
      this.scene.stop("Start");
      this.scene.start('mainGame');
    });
    
    let controlsButton = this.add.image(0,250, 'button').setOrigin(0,0).setDisplaySize(500,80);
    this.add.text(15, 262, 'Controls', {fontSize: 40});
    
    controlsButton.setInteractive();
    
    controlsButton.on('pointerover', () => {
      controlsButton.setTint("0x888888");
    });
    
    controlsButton.on('pointerout', () => {
      controlsButton.setTint("0xFFFFFF");
    });
    
    controlsButton.on('pointerdown', () => {
      this.scene.stop("Start");
      this.scene.start('Controls');
    });
  }
}

class Controls extends Phaser.Scene {
  constructor() {
    super("Controls");
  }
  create() {
    this.add.rectangle(0, 0, config.width, config.height, 0x000000, 50).setOrigin(0, 0);
    const text = this.add.text(config.width/2, config.height*0.25, 'Controls', { align: 'center' });

    text.setOrigin(0.5, 0.5);
    text.setResolution(window.devicePixelRatio);
    text.setFontFamily('Arial');
    text.setFontStyle('bold');
    text.setFontSize(80);

    text.preFX.setPadding(32);
    
    const controls = this.add.text(config.width/2, config.height*0.6, '[W|A|S|D] -- Movement\n[E] -- Wield Slash Attack\n[Q] -- Wield Gun\n[Shift] -- Sprint\n[LMB/Space] -- Attack (In Direction Currently Facing)', { align: 'center' });

    controls.setOrigin(0.5, 0.5);
    controls.setResolution(window.devicePixelRatio);
    controls.setFontFamily('Arial');
    controls.setFontStyle('bold');
    controls.setFontSize(50);

    controls.preFX.setPadding(32);
    
    let startButton = this.add.image(0,config.height-90, 'button').setOrigin(0,0).setDisplaySize(500,80);
    this.add.text(15, config.height-78, 'Continue', {fontSize: 40});
    
    startButton.setInteractive();
    
    startButton.on('pointerover', () => {
      startButton.setTint("0x888888");
    });
    
    startButton.on('pointerout', () => {
      startButton.setTint("0xFFFFFF");
    });
    
    startButton.on('pointerdown', () => {
      this.scene.stop("Controls");
      this.scene.start("Start");
    });
  }
}

class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }
  create() {
    this.add.rectangle(0, 0, config.width, config.height, 0x000000, 50).setOrigin(0, 0);
    
    const backgroundParticles2 = this.add.particles(0, 0, 'bandaid', {
      x: {min: 0, max: config.width * 2 },
      y: -5,
      lifespan: 3500,
      speedX: { min:-5, max: -100 },
      speedY: { min: 100, max: 300 },
      scale: { start: 0.1, end: 0 },
      quantity: 1,
      tint: 0x888888,
      rotate: {min: -30, max: 30},
    });
    const text = this.add.text(config.width/2, config.height*0.25, 'Temp Name', { align: 'center' });

    text.setOrigin(0.5, 0.5);
    text.setResolution(window.devicePixelRatio);
    text.setFontFamily('Arial');
    text.setFontStyle('bold');
    text.setFontSize(80);

    text.preFX.setPadding(32);
    
    let startButton = this.add.image(0,250, 'button').setOrigin(0,0).setDisplaySize(500,80);
    this.add.text(15, 262, 'Continue', {fontSize: 40});
    
    let menuButton = this.add.image(0,350, 'button').setOrigin(0,0).setDisplaySize(500,80);
    this.add.text(15, 362, 'Main Menu', {fontSize: 40});
    
    
    startButton.setInteractive();
    
    startButton.on('pointerover', () => {
      startButton.setTint("0x888888");
    });
    
    startButton.on('pointerout', () => {
      startButton.setTint("0xFFFFFF");
    });
    
    startButton.on('pointerdown', () => {
      this.scene.stop("Menu");
      this.scene.resume("mainGame");
    });
    
    menuButton.setInteractive();
    
    menuButton.on('pointerover', () => {
      menuButton.setTint("0x888888");
    });
    
    menuButton.on('pointerout', () => {
      menuButton.setTint("0xFFFFFF");
    });
    
    menuButton.on('pointerdown', () => {
      this.scene.stop("Menu");
      this.scene.stop("mainGame");
      gameVars.music.stop();
      this.scene.start("Start");
    });
  }
}

class mainGame extends Phaser.Scene {
  constructor() {
    super("mainGame");
  }
  preload() {
    this.load.image('button', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/button.png?v=1712939740274');
    this.load.spritesheet('playerMove', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/Civilian1(black)_Move.png?v=1712945505432', { frameWidth: 104, frameHeight: 104});
    this.load.spritesheet('playerIdle', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/Civilian1(black)_Idle.png?v=1712945621262', { frameWidth: 104, frameHeight: 104});
    this.load.spritesheet('slash', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/animation.png?v=1713445631279', {frameWidth: 75, frameHeight: 55});
    this.load.spritesheet('spirit', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/2e7c1003-3242-4e48-8724-1e6b78357127.image.png?v=1713469986817', {frameWidth: 288, frameHeight: 288});
    this.load.spritesheet('bullet', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/bullet.png?v=1713793050139', {frameWidth: 16, frameHeight: 32});
    this.load.spritesheet('bullet2', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/bullet2.png?v=1713793628074', {frameWidth: 32, frameHeight: 16});
    this.load.spritesheet('child', 'https://cdn.glitch.global/f49a979c-6b64-4401-b885-22d8de95245f/child.png?v=1715087777924', {frameWidth: 104, frameHeight: 104});
    this.load.image('schoolImgs', 'https://cdn.glitch.global/f49a979c-6b64-4401-b885-22d8de95245f/tileset.png?v=1716435568652');
    this.load.image('grassTiles', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/TX%20Tileset%20Grass.png?v=1712946178929');
    this.load.image('bandaid', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/bandaid.png?v=1713554289907');
    this.load.image('exp', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/BeFunky-design%20(1).png?v=1713964869961');
    this.load.tilemapTiledJSON('tilemap', './tileMap.json');
    
    this.load.audio('music', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/King%20nothing%20-%20Metallica%20(instrumental).mp3?v=1713815158381');
    this.load.audio('slash', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/audiomass-output.mp3?v=1713815620025');
    this.load.audio('gunfire', 'https://cdn.glitch.global/27dc39f2-c1ed-4431-8f86-a125544d68da/heathers-gunshot-effect2-100653.mp3?v=1713815805184');
  }
  create() {
    this.createAnimations();
    gameVars.timeVar = this.time;
    gameVars.physicsVars = this.physics;
    var mapData = Array.from({ length: 500 }, () => generateRandomArray(500));
    
    const map1 = this.make.tilemap({ data: mapData, key: "map", tileWidth: 32, tileHeight: 32});
    //map1.setCollision([6]);
    
    const tileset1 = map1.addTilesetImage("tiles1","grassTiles");
    
    const layer1 = map1.createLayer("layer", tileset1, 0, 0).setScale(2.5);
    layer1.depth = -4;
    const map2 = this.make.tilemap({ key: "tilemap"});
    
    const tileset2 = map2.addTilesetImage("tileset", "schoolImgs");
    
    this.belowLayer = map2.createLayer("MainLayer", tileset2, 0, 0).setScale(1);
    this.belowLayer.depth = -2;
    this.shadowLayer = map2.createLayer("Shadow", tileset2, 0, 0).setScale(1);
    this.shadowLayer.depth = -1;
    this.deskLayer = map2.createLayer("DeskLayer", tileset2, 0, 0).setScale(1);
    this.deskLayer.depth = -1;
    this.chairLayer = map2.createLayer("ChairLayer", tileset2, 0, 0).setScale(1);
    this.chairLayer.depth = -1;
    this.aboveLayer = map2.createLayer("AboveLayer", tileset2, 0, 0).setScale(1);
    this.aboveLayer.depth = 1;
    this.belowLayer.setCollisionByProperty({ collide: true });
    gameVars.collideLayer = this.belowLayer;
    this.deskLayer.setCollisionByProperty({ collide: true });
    
    this.vingette1 = this.cameras.main.postFX.addVignette(0.5, 0.5, 0.8, 0.4);
    
    gameVars.slashPos = {
      'F': [0, 50],
      'B': [0, -60],
      'R': [70, 0],
      'L': [-70, 0],
    }
    
    gameVars.music =  this.sound.add('music', {
		  volume: 0.05,
		  loop: true
	  });
    
    gameVars.slash =  this.sound.add('slash', {
		  volume: 0.75,
		  loop: false
	  });
    
    gameVars.gunfire =  this.sound.add('gunfire', {
		  volume: 0.75,
		  loop: false
	  });
    
    
	  if (!this.sound.locked)
	    {
		    // already unlocked so play
        if(gameVars.music.isPlaying == false) {
		      gameVars.music.play();
        };
      }
	    else
	    {
		    // wait for 'unlocked' to fire and then play
		    this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
			    gameVars.music.play();
		    });
	    }
    
    this.physics.world.setBounds(0, 0, 32*500, 32*500);
    
    class Slash extends Phaser.GameObjects.Sprite
        {
            constructor (scene)
            {
                super(scene, 0, 0, 'slash');

                this.speed = Phaser.Math.GetSpeed(gameVars.slashUpgrades.speedMod, 1);
              this.manaCost = gameVars.slashUpgrades.manaCost;
            }

            fire (x, y)
            {
              if(gameVars.lDir == "F") {
                this.flipY = false;
                this.flipX = true;
                this.dir = "F";
              } else if(gameVars.lDir == "B") {
                this.flipY = true;
                this.flipX = false;
                this.dir = "B";
              } else if(gameVars.lDir == "R") {
                this.flipY = true;
                this.flipX = false;
                this.dir = "R";
              } else if(gameVars.lDir == "L") {
                this.flipY = false;
                this.flipX = true;
                this.dir = "L";
              };
                this.setPosition(gameVars.slashPos[this.dir][0]+x, gameVars.slashPos[this.dir][1]+y);
                this.setScale(2.5*gameVars.slashUpgrades.sizeMod);
                this.setActive(true);
                this.setVisible(true);
                gameVars.slash.play();
            }

            update (time, delta)
            {
              if(this.dir == "F") {
                this.y += this.speed * delta;
              } else if(this.dir == "B") {
                this.y -= this.speed * delta;
              } else if(this.dir == "R") {
                this.x += this.speed * delta;
              } else if(this.dir == "L") {
                this.x -= this.speed * delta;
              }

                if (this.y < -50)
                {
                    this.setActive(false);
                    this.destroy();
                    this.setVisible(false);
                }
            }
        }
    
    class Bullet extends Phaser.GameObjects.Sprite
        {
            constructor (scene)
            {
              super(scene, 0, 0, 'bullet');

              this.speed = Phaser.Math.GetSpeed(gameVars.projectileUpgrades.speedMod*500, 1);
              this.manaCost = gameVars.projectileUpgrades.manaCost;
            }

            fire (x, y)
            {
              this.setScale(1);
              var height2 = this.body.height;
              var width2 = this.body.width;
              if(gameVars.spacingDir != null) {
                if(gameVars.spacingDir == "F") {
                this.flipY = true;
                this.flipX = false;
                this.dir = "F";
                /*this.body.setSize(width/2, height/2);
                this.setDisplaySize(width, height);
                this.body.setOffset(offSetX, offSetY);*/
                this.anims.play('bullet');
              } else if(gameVars.spacingDir == "B") {
                this.flipY = false;
                this.flipX = false;
                this.dir = "B";
                /*this.body.setSize(width/2, height/2);
                this.setDisplaySize(width, height);
                this.body.setOffset(offSetX, offSetY);*/
                this.anims.play('bullet');
              } else if(gameVars.spacingDir == "R") {
                this.flipY = true;
                this.flipX = false;
                this.dir = "R";
                this.body.setSize(this.body.height, this.body.width);
                //this.setDisplaySize(width, height);
                this.body.setOffset(-this.body.width/4, -this.body.height/4);
                this.anims.play('bullet2');
              } else if(gameVars.spacingDir == "L") {
                this.flipY = false;
                this.flipX = true;
                this.dir = "L";
                this.body.setSize(this.body.height, this.body.width);
                //this.setDisplaySize(width, height);
                this.body.setOffset(-this.body.width/4, -this.body.height/4);
                this.anims.play('bullet2');
              };
              } else {
              if(gameVars.lDir == "F") {
                this.flipY = true;
                this.flipX = false;
                this.dir = "F";
                /*this.body.setSize(width/2, height/2);
                this.setDisplaySize(width, height);
                this.body.setOffset(offSetX, offSetY);*/
                this.anims.play('bullet');
              } else if(gameVars.lDir == "B") {
                this.flipY = false;
                this.flipX = false;
                this.dir = "B";
                /*this.body.setSize(width/2, height/2);
                this.setDisplaySize(width, height);
                this.body.setOffset(offSetX, offSetY);*/
                this.anims.play('bullet');
              } else if(gameVars.lDir == "R") {
                this.flipY = true;
                this.flipX = false;
                this.dir = "R";
                this.body.setSize(this.body.height, this.body.width);
                //this.setDisplaySize(width, height);
                this.body.setOffset(-this.body.width/64, -this.body.height/64);
                this.anims.play('bullet2');
              } else if(gameVars.lDir == "L") {
                this.flipY = false;
                this.flipX = true;
                this.dir = "L";
                this.body.setSize(this.body.height, this.body.width);
                //this.setDisplaySize(width, height);
                this.body.setOffset(-this.body.width/64, -this.body.height/64);
                this.anims.play('bullet2');
              };
              };
                this.setPosition(gameVars.slashPos[this.dir][0]*gameVars.projectileUpgrades.sizeMod/2+x, gameVars.slashPos[this.dir][1]*gameVars.projectileUpgrades.sizeMod/2+y);
                this.setActive(true);
                this.setVisible(true);
                gameVars.gunfire.play();
              
            };

            update (time, delta)
            {
              if(this.dir == "F") {
                this.y += this.speed * delta;
              } else if(this.dir == "B") {
                this.y -= this.speed * delta;
              } else if(this.dir == "R") {
                this.x += this.speed * delta;
              } else if(this.dir == "L") {
                this.x -= this.speed * delta;
              }

                if (this.y < -50)
                {
                    this.setActive(false);
                    this.destroy();
                    this.setVisible(false);
                }
            }
        }
    
    // Function to generate a random array
function generateRandomArray(length) {
    return Array.from({ length: length }, () => Math.floor(Math.random() * 11));
}

// Generating 50 arrays
let arrays = Array.from({ length: 50 }, () => generateRandomArray(50));

// Logging the first array as an example
    
    class Baddie extends Phaser.GameObjects.Sprite
        {
            constructor (scene)
            {
                super(scene, 0, 0, 'child');

                this.speed = Phaser.Math.GetSpeed(50, 1);
            }

            spawn (x, y)
            {
              if(x && y) {
                this.setPosition(x, y);
              } else {
                this.setPosition(Math.random()*config.width+(gameVars.player.x-config.width/2), Math.random()*config.height+(gameVars.player.y-config.height/2));
              }
              this.setDisplaySize(50, 50);
              this.body.setSize(25,40).setOffset(40, 35);
              this.setScale(1.25);
              //this.body.setOffset();
              this.setActive(true);
              this.setVisible(true);
              this.health = 100;
              this.immune = false;
              this.moveTimer = 0;
              this.body.setCollideWorldBounds(true);
              this.typeOfChild = Math.floor(Math.random()*3);
              this.projectileTimeout = Math.random()*1000;
              if(this.typeOfChild == 0) {
                this.tintDefault = 0xA020F0;
                this.setTint(this.tintDefault);
              }
              console.log(this.typeOfChild);
            }
          
            hurt(amt)
          {
            if(this.immune == false) {
              this.health -= amt;
              this.alpha = 0.5;
              this.immune = true;
              this.setTint("0x05BAC9");
              gameVars.timeVar.delayedCall(250, () => {this.immune = false; this.alpha = 1; this.setTint(this.tintDefault);});
            }
            //console.log(this);
          }

            update (time, delta)
          {
            //console.log(Phaser.Math.Distance.Between(this.x, this.y, gameVars.player.x, gameVars.player.y));
            if(Phaser.Math.Distance.Between(this.x, this.y, gameVars.player.x, gameVars.player.y) < 300) {
              if(this.typeOfChild == 0) {
                gameVars.physicsVars.moveToObject(this, gameVars.player, 150);
              } else {
                gameVars.physicsVars.moveToObject(this, gameVars.player, -200);
                
              };
              this.following = true;
            } else if(this.following == true) {
              this.body.velocity.x = 0;
              this.body.velocity.y = 0;
              this.following = false;
            } else {
              if(Phaser.Math.Distance.Between(this.x, this.y, gameVars.player.x, gameVars.player.y) < 400 && this.typeOfChild == 1) {
                if(time > this.projectileTimeout) {
                  console.log(this.projectileTimeout);
                  summonNPCBullet(this.x, this.y);
                  this.projectileTimeout = time+(Math.random()*5000);
                }
              }
            };
            if(this.moveTimer < time) {
              this.body.velocity.x = (Math.random()*400)-200;
              this.body.velocity.y = (Math.random()*400)-200;
              this.moveTimer = time+500;
            };
            if(this.body.velocity.x < 0) {this.flipX = true;} else {this.flipX = false;};
                if (this.y < -50)
                {
                    this.setActive(false);
                    this.destroy();
                    this.setVisible(false);
                }
              if (this.health <= 0) {
                gameVars.score += 1;
                gameVars.killCounter.setText(gameVars.score+' Enemies Defeated;');
                if(Math.random()*100 > 90) {
                  gameVars.dropHeals = {x: this.body.x, y: this.body.y};
                }
                if(Math.random()*100 > 25) {
                  gameVars.dropEXP(1, this.body.x, this.body.y)
                }
                this.destroy();
              }
            }
        }
    
    gameVars.dropEXP = function(amt, x, y) {
      const exp = gameVars.exp.get();

            if (exp)
            {
                exp.spawn(x, y);
              
              gameVars.physicsVars.add.overlap(exp, gameVars.player, function() {
                  
                  gameVars.expLevel += amt;
                  
                  exp.destroy();
                });
            };
    };
    
    class NPCNonTrackingBullet extends Phaser.GameObjects.Image {
      constructor(scene){
        super(scene, 0, 0, 'exp');
      }
      spawn(x,y) {
        this.setScale(0.25);
        this.body.setSize(200,200);
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        gameVars.timeVar.delayedCall(1000, () => {this.destroy()});
        gameVars.physicsVars.moveToObject(this, gameVars.player,400);
        gameVars.physicsVars.add.collider(gameVars.collideLayer, this, ()=> {
          this.destroy();
        });
      }
    }
    
    class Heals extends Phaser.GameObjects.Sprite {
      constructor(scene){
        super(scene, 0, 0, 'bandaid');
      }
      spawn(x, y) {
          this.setScale(1/50);
          this.setPosition(x, y);
          //this.body.setOffset(-this.body.width*2, -this.body.height*4);
          this.setActive(true);
          this.setVisible(true);
      }
    }
    
    class EXP extends Phaser.GameObjects.Image {
      constructor(scene){
        super(scene, 0, 0, 'exp');
      }
      spawn(x, y) {
        this.setScale(0.25);
        this.body.setSize(200,200);
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
      }
      update() {
        gameVars.physicsVars.moveToObject(this, gameVars.player,600);
      }
    }
    
    gameVars.baddies = this.physics.add.group({
            classType: Baddie,
            maxSize: 1000,
            runChildUpdate: true
        });
    
    this.slashes = this.physics.add.group({
            classType: Slash,
            maxSize: 20,
            runChildUpdate: true
        });
    
    this.heals = this.physics.add.group({
            classType: Heals,
            maxSize: 20,
            runChildUpdate: true
        });
    
    gameVars.npcnontrack = this.physics.add.group({
            classType: NPCNonTrackingBullet,
            maxSize: 5000,
            runChildUpdate: true
        });
    
    gameVars.exp = this.physics.add.group({
            classType: EXP,
            maxSize: 100,
            runChildUpdate: true
        });
    
    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 20,
      runChildUpdate: true,
    });
    this.lastFired = 0;
    
    
    this.physics.add.collider(gameVars.baddies, gameVars.baddies);
    
    gameVars.cursors = this.input.keyboard.createCursorKeys();
    gameVars.player = this.physics.add.sprite(100, 100, 'player').setDisplaySize(50, 50).setSize(25,15).setOffset(40, 60).refreshBody();
    
    gameVars.player.setCollideWorldBounds(true);
    
     this.physics.add.collider(this.belowLayer, gameVars.player);
     this.physics.add.collider(this.belowLayer, gameVars.baddies);
     this.physics.add.collider(this.deskLayer, gameVars.player);
    
    
    
    this.cameras.main.startFollow(gameVars.player);
    
    this.healthBar=this.makeBar(10,10,0x2ecc71, 25, 200);
    this.setValue(this.healthBar,100, 100);
    this.expBar=this.makeBar(10,35,0xFFFFFF, 5, 200)
    this.setValue(this.expBar,100, 100);
    this.manaBar=this.makeBar(10,50,0x68c2f5, 25, 200);
    this.setValue(this.manaBar,100, 100);
    
    keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keys.Shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    keys.Space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keys.Escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    keys.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keys.E = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    keys.Q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    keys.C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

    gameVars.killCounter = this.add.text(30,90, gameVars.score+' Enemies Defeated;').setScrollFactor(0).setFontSize(20).setFontFamily('Arial');
    gameVars.killCounter.depth = 10;
    gameVars.weaponIndicator = this.add.text(config.width/2,config.height-40, 'Wielding: ['+gameVars.weaponDictionary[gameVars.currentWeapon]+']').setScrollFactor(0).setFontSize(20).setFontFamily('Arial').setOrigin(0.5, 0.5);
    
    let g = this.add.rectangle(config.width/2,config.height-40, 500, 50, 0x000000, 50).setOrigin(0.5, 0.5).setScrollFactor(0);
    g.depth = 9;
    gameVars.weaponIndicator.depth = 10;
    
    /*gameVars.summonTimer = this.time.addEvent({
            callback: () => {this.summonWave(gameVars.monsters.amt, gameVars.baddies)},
            callbackScope: this,
            delay: gameVars.monsters.delay*0.5,
            loop: true
        });*/
    gameVars.manaRegen = this.time.addEvent({
      callback: () => {    
        if(gameVars.playerMana < gameVars.playerMaxMana) {
          gameVars.playerMana += gameVars.playerManaRegen;
        }
      },
      callbackScope: this,
      delay: 100,
      loop: true,
    })
    /*this.time.delayedCall(5000, () => {
      this.summonWave(1, gameVars.baddies);
    });*/
    var botSpawnTile=83;
    console.log(this.chairLayer);
    var mapArray = this.chairLayer.getTilesWithin(0, 0, 100, 100);        
      for(var i=0;i<mapArray.length;i++){
        var myTile=mapArray[i];
        if(myTile.index==82 || myTile.index==83 || myTile.index==84 || myTile.index==85){
          this.summonSingle(myTile.x*48, myTile.y*48);
         }
      }
  }
  
  levelUp() {
    gameVars.expLevel = 0;
    gameVars.expReq = gameVars.expReq*1.5;
    gameVars.playerLevel += 1;
    gameVars.projectileUpgrades.sizeMod += 1;
    gameVars.projectileUpgrades.speedMod += 1;
    gameVars.projectileUpgrades.manaCost += 1;
    gameVars.projectileUpgrades.cd += 1;
    gameVars.projectileUpgrades.dmg += 1;
    
    gameVars.monsters.amt += 10;
    gameVars.monsters.delay -= 100;
    
    /*gameVars.summonTimer.remove();
    
    gameVars.summonTimer = this.time.addEvent({
            callback: () => {this.summonWave(gameVars.monsters.amt, gameVars.baddies)},
            callbackScope: this,
            delay: gameVars.monsters.delay*0.5,
            loop: true
        });*/
  }
  
  summonWave(amt, type) {
            for(var i=0;i<amt;i++) {
            const baddie = type.get();
            if (baddie)
            {
                baddie.spawn();
                baddie.anims.play('child');
                this.physics.add.overlap(this.slashes, baddie, function() {
                  baddie.hurt(gameVars.slashUpgrades.dmg);
                });
                this.physics.add.overlap(this.bullets, baddie, function() {
                  baddie.hurt(gameVars.projectileUpgrades.dmg);
                });
              
                this.physics.add.overlap(baddie, gameVars.player, function() {
                  if(gameVars.immune == false) {
                    gameVars.playerHealth -= 1;
                    gameVars.immune = true;
                    gameVars.player.alpha = 0.5;
                    gameVars.player.setTint("0x05BAC9");
                    gameVars.timeVar.delayedCall(250, () => {gameVars.immune = false; gameVars.player.alpha = 1; gameVars.player.setTint("0xFFFFFF");});
                  }
                });
            }
            };
    gameVars.monsters.amt += 1;
  }
  summonSingle(x, y) {
            const baddie = gameVars.baddies.get();
            if (baddie)
            {
                baddie.spawn(x, y);
                baddie.anims.play('child');
                this.physics.add.overlap(this.slashes, baddie, function() {
                  baddie.hurt(gameVars.slashUpgrades.dmg);
                });
                this.physics.add.overlap(this.bullets, baddie, function() {
                  baddie.hurt(gameVars.projectileUpgrades.dmg);
                });
              
                this.physics.add.overlap(baddie, gameVars.player, function() {
                  if(gameVars.immune == false) {
                    gameVars.playerHealth -= 1;
                    gameVars.immune = true;
                    gameVars.player.alpha = 0.5;
                    gameVars.player.setTint("0x05BAC9");
                    gameVars.timeVar.delayedCall(250, () => {gameVars.immune = false; gameVars.player.alpha = 1; gameVars.player.setTint("0xFFFFFF");});
                  }
                });
            }
  }
  
  
  makeBar(x, y,color, h, w) {
        //draw the bar
        let bar = this.add.graphics();
        let barB = this.add.graphics();
        let barC = this.add.graphics();

        //color the bar
        bar.fillStyle(color, 1);
        barB.fillStyle(0x005500, 1);
        barC.fillStyle(0x000000, 1);
    
        bar.setScrollFactor(0);
        barB.setScrollFactor(0);
        barC.setScrollFactor(0);
    
        bar.depth = 10;
        barB.depth = 8;
        barC.depth = 9;

        //fill the bar with a rectangle
        bar.fillRect(0, 0, w, h);
        barC.fillRect(0, 0, w, h);
        barB.fillRect(0, 0, w+4, h+4);
        
        //position the bar
        bar.x = x;
        bar.y = y;
        barB.x = x-2;
        barB.y = y-2;
        barC.x = x;
        barC.y = y;

        //return the bar
        return bar;
    }
    setValue(bar,percentage, max) {
        //scale the bar
        bar.scaleX = percentage/max;
    }
  
  dropHeals(x, y) {
    const heals = this.heals.get();

            if (heals)
            {
                heals.spawn(x, y);
              
              this.physics.add.overlap(heals, gameVars.player, function() {
                  
                  gameVars.playerHealth += 2;
                  gameVars.playerMana += 2;
                if(gameVars.playerHealth > gameVars.playerMaxHealth) {
                  gameVars.playerHealth = gameVars.playerMaxHealth
                };
                if(gameVars.playerMana > gameVars.playerMaxMana) {
                  gameVars.playerMana = gameVars.playerMaxMana;
                };
                  heals.destroy();
                });
            };
  }
  
  createAnimations() {
        this.anims.create({
          key: 'move_down',
          frames: this.anims.generateFrameNumbers('playerMove', { start: 0, end: 3 }),
          frameRate: 8,
          repeat: -1
        });
    
        this.anims.create({
          key: 'move_up',
          frames: this.anims.generateFrameNumbers('playerMove', { start: 16, end: 19 }),
          frameRate: 8,
          repeat: -1
        });
    
        this.anims.create({
          key: 'move_right',
          frames: this.anims.generateFrameNumbers('playerMove', { start: 8, end: 11 }),
          frameRate: 8,
          repeat: -1
        });
    
        this.anims.create({
          key: 'move_dr',
          frames: this.anims.generateFrameNumbers('playerMove', { start: 4, end: 7 }),
          frameRate: 8,
          repeat: -1
        });
    
        this.anims.create({
          key: 'move_ur',
          frames: this.anims.generateFrameNumbers('playerMove', { start: 12, end: 15 }),
          frameRate: 8,
          repeat: -1
        });

        this.anims.create({
          key: 'idleF',
          frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 0 }),
          frameRate: 5,
          repeat: -1
        });
    
        this.anims.create({
          key: 'idleB',
          frames: this.anims.generateFrameNumbers('playerIdle', { start: 4, end: 4 }),
          frameRate: 5,
          repeat: -1
        });
    
        this.anims.create({
          key: 'idleR',
          frames: this.anims.generateFrameNumbers('playerIdle', { start: 2, end: 2 }),
          frameRate: 5,
          repeat: -1
        });
    
        this.anims.create({
          key: 'idleL',
          frames: this.anims.generateFrameNumbers('playerIdle', { start: 2, end: 2 }),
          frameRate: 5,
          repeat: -1
        });

        this.anims.create({
          key: 'jump',
          frames: this.anims.generateFrameNumbers('playerMove', { start: 2, end: 3 }),
          frameRate: 10,
          repeat: -1
        });
        
        this.anims.create({
          key: 'secret',
          frames: this.anims.generateFrameNumbers('playerMove', {start: 6, end: 10}),
          frameRate: 6,
        });
        
        this.anims.create({
          key: 'idleBurger',
          frames: this.anims.generateFrameNumbers('playerMove', {start:0, end: 5}),
          frameRate: 10,
          repeat: -1,
        });
    
        this.anims.create({
          key: 'slash',
          frames: this.anims.generateFrameNumbers('slash', {start:0, end:5}),
          frameRate: 15,
          repeat: 0,
        });
    
        this.anims.create({
          key: 'child',
          frames: this.anims.generateFrameNumbers('child', {start: 0, end: 3}),
          frameRate: 10,
          repeat: -1,
        });
    
        this.anims.create({
          key: 'bullet',
          frames: this.anims.generateFrameNumbers('bullet', {start: 0, end: 2}),
          frameRate: 15,
          repeat: -1,
        });
    
        this.anims.create({
          key: 'bullet2',
          frames: this.anims.generateFrameNumbers('bullet2', {start: 0, end: 2}),
          frameRate: 15,
          repeat: -1,
        });
      }
  update(time, delta) {
    if(gameVars.playerHealth <= 0) {
      gameVars.velX = 0;
      gameVars.velY = 0;
      this.scene.stop("mainGame");
    };
    var maxMove = 300;
    if(keys.Shift.isDown) {
      maxMove = 600;
    }
    if(gameVars.velY > 0) {
      if(gameVars.velX == 0) {
          gameVars.player.anims.play('move_down', true);
      }  
          gameVars.player.setVelocityY(gameVars.velY);
          gameVars.lDir = 'F';
          //gameVars.playerTrail.start();
        }
        if(gameVars.velY < 0) {
      if(gameVars.velX == 0) {
          gameVars.player.anims.play('move_up', true);
      }
          gameVars.player.setVelocityY(gameVars.velY);
          gameVars.lDir = 'B';
         // gameVars.playerTrail.start();
        }
        if(gameVars.velY == 0) {
          gameVars.player.setVelocityY(gameVars.velY);
        }
    if ((gameVars.cursors.up.isDown || keys.W.isDown)) {
          if(gameVars.velY > -maxMove) {
            if(gameVars.velY > 10) {
              gameVars.velY += -(gameVars.velY/2);
            } else {
                gameVars.velY -= 10;
            }
          }else {
            	gameVars.velY += -(gameVars.velY/4);
          };
        } else if ((gameVars.cursors.down.isDown || keys.S.isDown)) {
          if(gameVars.velY < maxMove) {
            if(gameVars.velY < -10) {
              gameVars.velY += -(gameVars.velY/2);
            } else {
                gameVars.velY += 10;
            }
          }else {
            	gameVars.velY += -(gameVars.velY/4);
          };
        } else {
          if(Math.abs(gameVars.velY) > maxMove) {
            	gameVars.velY += -(gameVars.velY/4);
          } else {
            	gameVars.velY += -(gameVars.velY/2);
          }
          if(gameVars.velY < 10 && gameVars.velY > -10) {
            gameVars.velY = 0;
          }
        };
    
    
    
    
    if(gameVars.velX > 0) {
          gameVars.player.flipX = false;
          if(gameVars.velY > 0) {
            gameVars.player.anims.play('move_dr', true);
          } else if(gameVars.velY < 0) {
            gameVars.player.anims.play('move_ur', true);
          } else {
            gameVars.player.anims.play('move_right', true);
          }
          gameVars.player.setVelocityX(gameVars.velX);
          gameVars.lDir = 'R';
          //gameVars.playerTrail.start();
        }
        if(gameVars.velX < 0) {
          gameVars.player.flipX = true;
          if(gameVars.velY > 0) {
            gameVars.player.anims.play('move_dr', true);
          } else if(gameVars.velY < 0) {
            gameVars.player.anims.play('move_ur', true);
          } else {
            gameVars.player.anims.play('move_right', true);
          }
          gameVars.player.setVelocityX(gameVars.velX);
          gameVars.lDir = 'L';
         // gameVars.playerTrail.start();
        }
        if(gameVars.velX == 0) {
          gameVars.player.setVelocityX(gameVars.velX);
        }
    if ((gameVars.cursors.left.isDown || keys.A.isDown)) {
      if(gameVars.velX > -maxMove) {
          if(gameVars.velX > 10) {
            gameVars.velX += -(gameVars.velX/2);
          } else {
                gameVars.velX -= 10;
          }
      }else {
            	gameVars.velX += -(gameVars.velX/4);
          };
        } else if ((gameVars.cursors.right.isDown || keys.D.isDown)) {
          if(gameVars.velX < maxMove) {
            if(gameVars.velX < -10) {
              gameVars.velX += -(gameVars.velX/2);
            } else {
                gameVars.velX += 10;
            }
          }else {
            	gameVars.velX += -(gameVars.velX/4);
          };
        } else {
          if(Math.abs(gameVars.velX) > maxMove) {
            	gameVars.velX += -(gameVars.velX/4);
          } else {
            	gameVars.velX += -(gameVars.velX/2);
          }
          if(gameVars.velX < 10 && gameVars.velX > -10) {
            gameVars.velX = 0;
          }
        };
    
    
        
    if(gameVars.velX == 0 && gameVars.velY == 0) {
      gameVars.player.anims.play('idle'+gameVars.lDir, true);
    }
    if(keys.E.isDown) {gameVars.currentWeapon = 0; gameVars.weaponIndicator.setText('Wielding: ['+gameVars.weaponDictionary[gameVars.currentWeapon]+']');};
    if(keys.Q.isDown) {gameVars.currentWeapon = 1; gameVars.weaponIndicator.setText('Wielding: ['+gameVars.weaponDictionary[gameVars.currentWeapon]+']');};
         if (((game.input.activePointer.isDown || keys.Space.isDown) && gameVars.currentWeapon == 0) && time > this.lastFired)
        {
            const slash = this.slashes.get();
          
            if (slash)
            {
              if(gameVars.playerMana > slash.manaCost)
                {
                slash.fire(gameVars.player.x, gameVars.player.y);
                this.time.delayedCall(250, () => {
                    slash.setActive(false);
                    slash.destroy();
                    slash.setVisible(false);
                });
                slash.anims.play('slash');
                  gameVars.playerMana -= slash.manaCost;
                this.lastFired = time + gameVars.slashUpgrades.cd;
                } else {
                  slash.destroy();
                }
            }
        }
    
    if (((game.input.activePointer.isDown || keys.Space.isDown) && gameVars.currentWeapon == 1) && time > this.lastFired)
        {
            const bullet = this.bullets.get();

            if (bullet)
            {
              if(gameVars.playerMana > bullet.manaCost)
                {
                bullet.fire(gameVars.player.x, gameVars.player.y);
                this.time.delayedCall(1000, () => {
                    bullet.setActive(false);
                    bullet.destroy();
                    bullet.setVisible(false);
                });
                gameVars.playerMana -= bullet.manaCost;
                this.lastFired = time + gameVars.projectileUpgrades.cd;
                } else {
                  bullet.destroy();
                };
            }
        }
    
     /*if (keys.Shift.isDown && time > this.lastFired)
        {
            if(gameVars.dash == false) {
              var currDir = gameVars.directionary[gameVars.lDir];
              gameVars.velX = 2000*currDir[0];
              gameVars.velY = 2000*currDir[1];
              gameVars.dash = true;
              gameVars.immune = true;
              gameVars.timeVar.delayedCall(500, () => {gameVars.immune = false;});
              gameVars.timeVar.delayedCall(500, () => {gameVars.dash = false;});
            };
        }*/
    
    if(keys.Escape.isDown) {
      this.scene.pause();
      this.scene.launch("Menu");
    };
    
    this.setValue(this.healthBar,gameVars.playerHealth, gameVars.playerMaxHealth);
    this.setValue(this.manaBar,gameVars.playerMana, gameVars.playerMaxMana);
    this.setValue(this.expBar,gameVars.expLevel, gameVars.expReq);
    if(gameVars.dropHeals != null) {
      this.dropHeals(gameVars.dropHeals.x, gameVars.dropHeals.y);
      gameVars.dropHeals = null;
    }
    if(gameVars.expLevel >= gameVars.expReq) {
      this.levelUp();
    }
  }
}

function distanceSq(x1, y1, x2, y2) {

    var xDif = x1 - x2;
    var yDif = y1 - y2;

    return Math.sqrt((xDif * xDif) + (yDif * yDif));

};

function summonNPCBullet(x, y) {
            const npcnontrack = gameVars.npcnontrack.get();
            if (npcnontrack)
            {
                npcnontrack.spawn(x, y);
              
                gameVars.physicsVars.add.overlap(npcnontrack, gameVars.player, function() {
                  if(gameVars.immune == false) {
                    gameVars.playerHealth -= 1;
                    gameVars.immune = true;
                    gameVars.player.alpha = 0.5;
                    gameVars.player.setTint("0x05BAC9");
                    gameVars.timeVar.delayedCall(250, () => {gameVars.immune = false; gameVars.player.alpha = 1; gameVars.player.setTint("0xFFFFFF");});
                  }
                });
            }
  }

const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "000000",
        scene: [Start, Controls, mainGame, Menu],
        physics: {
          default: 'arcade',
          arcade: {
           //debug: true,
           enableBody: true,
          }
        },
        fps: {
          target: 100,
          forceSetTimeOut: true
        },
        render: {
          pixelArt: true
        },
    };
const game = new Phaser.Game(config);