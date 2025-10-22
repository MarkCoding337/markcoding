var Phaser;
var PhaserNavMeshPlugin;
var ctx;

var JSONFILE = `
{
	"tree1": {
	  "type": "fromPhysicsEditor",
	  "isStatic": false,
	  "density": 0.8,
	  "restitution": 0.1,
	  "friction": 0.1,
	  "frictionAir": 0.001,
	  "frictionStatic": 0.5,
	  "collisionFilter": { "group": 0, "category": 1, "mask": 255 },
	  "label": "treeWhole",
	  "fixtures": [
		{
		  "label": "treeBottom",
		  "isSensor": false,
		  "vertices": [
			[
			  { "x": 102, "y": 195 },
			  { "x": 82, "y": 195 },
			  { "x": 79, "y": 31 },
			  { "x": 100, "y": 31 }
			]
		  ]
		},
		{
		  "label": "tree",
		  "isSensor": false,
		  "vertices": [
			[
			  { "x": 136, "y": 115 },
			  { "x": 45, "y": 116 },
			  { "x": 46, "y": 32 },
			  { "x": 133, "y": 31 }
			]
		  ]
		}
	  ]
	},
	"tree2": {
	  "type": "fromPhysicsEditor",
	  "isStatic": false,
	  "density": 0.8,
	  "restitution": 0.1,
	  "friction": 0.1,
	  "frictionAir": 0.001,
	  "frictionStatic": 0.5,
	  "collisionFilter": { "group": 0, "category": 1, "mask": 255 },
	  "label": "b24c302d-f9cf-418f-9dc8-0bb8af152f7c.png",
	  "fixtures": [
		{
		  "label": "treeBottom",
		  "isSensor": false,
		  "vertices": [
			[
			  { "x": 365, "y": 640 },
			  { "x": 230, "y": 638 },
			  { "x": 229, "y": 277 },
			  { "x": 367, "y": 280 }
			]
		  ]
		},
		{
		  "label": "tree",
		  "isSensor": false,
		  "vertices": [
			[
			  { "x": 492, "y": 321 },
			  { "x": 106, "y": 320 },
			  { "x": 112, "y": 105 },
			  { "x": 490, "y": 102 }
			]
		  ]
		}
	  ]
	}
}
`

class Menu extends Phaser.Scene {
	constructor() {
		super("Menu");
	}
	preload() {
		this.load.image("black", "https://cdn-icons-png.freepik.com/512/3/3854.png");
	}
	create() {
		ctx = this;
		this.background = this.add.rectangle(0,0,config.width,config.height, 0xAA6666).setScrollFactor(0).setDepth(1).setOrigin(0,0);
		this.startButton = this.add.sprite(config.width/2-5, config.height-200, "black").setDisplaySize(200,50).setScrollFactor(0).setDepth(2).setInteractive();
		
		this.cursorPiece = this.add.circle(0,0,3,0x000000).setScrollFactor(0).setDepth(5);
		this.cursorPiece2 = this.add.circle(0,0,5,0xFFFFFF).setScrollFactor(0).setDepth(4);
		
		this.text = this.add.text(config.width/2, config.height/3, "Fabrik").setDepth(2).setOrigin(0.5, 0).setFontFamily("Arial").setFontSize(40);
		
		this.tweens.add({
			targets: this.startButton,
			x: '+=10',
			yoyo: true,
			duration: 900,
			ease: 'Quad.easeInOut',
			persist: true,
			repeat: -1,
		});
		
		this.startButton.on('pointerover', () => {
		  this.startButton.setDisplaySize(210,60);
		});
		
		this.startButton.on('pointerout', () => {
		  this.startButton.setDisplaySize(200,50);
		});
		this.startButton.on("pointerdown", () => {
			this.scene.stop();
			this.scene.start("Main");
		})
	}
	update() {
		this.cursorPiece.setPosition(this.input.mousePointer.x, this.input.mousePointer.y);
		this.cursorPiece2.setPosition(this.input.mousePointer.x, this.input.mousePointer.y);

	}
}

class Main extends Phaser.Scene {
    constructor() {
        super("Main");
    }
    preload() {
		this.load.image("grass", "https://static.vecteezy.com/system/resources/thumbnails/002/948/764/small/pixel-background-the-concept-of-games-background-vector.jpg");
		this.load.image("dirt", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5qtry-61iUvRWABkVv2tekiQ9FEX6PINFwQ&s");
		this.load.image("bullet1", "https://res.cloudinary.com/dohbq0tta/image/upload/v1748922194/bullet1_qrjatd.png");
		this.load.image("tree1", "https://res.cloudinary.com/dohbq0tta/image/upload/v1750993165/f198bbfc-c66f-4eb5-ac83-3e562c9621d4.png");
		this.load.image("tree2", "https://res.cloudinary.com/dohbq0tta/image/upload/v1751134101/b24c302d-f9cf-418f-9dc8-0bb8af152f7c.png");
		this.load.image("water", "https://res.cloudinary.com/dohbq0tta/image/upload/v1751137543/waterImg_i6wjrv.png");
		this.load.image("machineBaseLvl1", "https://res.cloudinary.com/dohbq0tta/image/upload/v1751167138/machineBaseLvl1_kfqrj0.png");
		this.load.image("machineBaseLvl2", "https://res.cloudinary.com/dohbq0tta/image/upload/v1751167140/machineBaseLvl2_uwz7qg.png");
		this.load.image("machineBaseLvl3", "https://res.cloudinary.com/dohbq0tta/image/upload/v1751167140/machineBaseLvl3_h2angf.png");

    }
    create() {
        ctx = this;
		this.platforms = [];
		this.platformBodies = [];
		this.UIElements = [];
		this.chunkLoads = [];
		this.trees = {};
		this.isPointering = false;
		this.spawn = {x:0,y: -700};
		this.bullet;
		this.maxPlatforms = 1500;
		this.cursorPiece = this.add.circle(0,0,3,0x000000).setScrollFactor(0).setDepth(10);
		this.cursorPiece2 = this.add.circle(0,0,5,0xFFFFFF).setScrollFactor(0).setDepth(9);
		this.uiC = this.cameras.add();
		this.selectedMachine = null;
		
		
		class enemy extends Phaser.Physics.Matter.Sprite
		{
			constructor(scene, x, y) {
				super(scene.matter.world, x, y);
				this.scene = scene;
				this.setTexture("grass");
				this.setDisplaySize(100,20);
				this.setBody({
					shape: "rectangle",
					width: 100,
					height: 30,
				});
				this.body.isEnemy = true;
				this.body.health = Math.floor(Math.random()*5+5);
				this.setFrictionAir(0.05);
				this.setFriction(0.05);
				ctx.setCenterOfMass(this.body, this, {x: 15, y: 0});
				this.setMass(0.15);
				this.setAngle(90);
				this.setFixedRotation(true);
				this.scene.events.on('update', this.update, this);
				scene.add.existing(this);
				this.setCollisionCategory(4);
				this.body.attackCD = 0;
				this.following = false;
				this.speed = Math.random()*2+2;
				this.body.density = 1;
			}
			update() {
				if(this.body.attackCD > 0) {
					this.body.attackCD -= 1;
				};
				var cent = ctx.player.getCenter();
				if(this.following == false) {
					if(Phaser.Math.Distance.Between(this.body.position.x, this.body.position.y, cent.x, cent.y) <= 500) {
						this.following = true;
					}
				} else {
					if(cent.x > this.body.position.x) {
						this.setVelocityX(this.speed)
					} else {
						this.setVelocityX(-this.speed)
					}
				};
				if(this.body.health <= 0) {
					this.scene.events.off('update', this.update, this);
					this.destroy();
				}
			}
		}
		
		var shapez = JSON.parse(JSONFILE);
		
		class tree extends Phaser.Physics.Matter.Sprite
		{
			constructor(scene, x, y, size, type) {
				super(scene.matter.world, x, y);
				this.scene = scene;
				if(!type) {
					type = "tree1";
				}
				this.setTexture(type);
				this.setBody(shapez[type]);
				this.setDisplaySize(250*size,300*size);
				this.setDepth(-1);
				ctx.setCenterOfMass(this.body, this, {x: 0, y: 100});
				this.setCollisionGroup(-2);
				this.setFrictionAir(0);
				//this.scene.events.on('update', this.update, this);
				scene.add.existing(this);
			}
		}
		
		class machineBase extends Phaser.Physics.Matter.Sprite {
			constructor(scene, x, y, type, data) {
				super(scene.matter.world, x, y);
				this.scene = scene;
				this.setTexture(type);
				this.setBody("rectangle");
				this.body.isMachine = true;
				this.setDisplaySize(200,200);
				this.setInteractive();
				this.on("pointerover", () => {
					ctx.selectedMachine = this;
				});
				this.on("pointerout", () => {
					ctx.selectedMachine = null;
				})
				scene.add.existing(this);
			}
		}
		
		class bullet extends Phaser.Physics.Matter.Sprite
		{
			constructor(scene, x, y, angle, options) {
				super(scene.matter.world, x, y);
				this.scene = scene;
				this.setTexture("bullet1");
				this.setBody("rectangle");
				this.setFrictionAir(0);
				this.setDisplaySize(30,7.5);
				ctx.setCenterOfMass(this.body, this, {x: 5, y: 0});
				this.setAngle(angle);
				this.body.bulletDamage = 1;
				this.body.destruction = false;
				this.body.isBullet = true;
				this.body.slop = 0.00001;
				this.setMass(this.scene.playerParams.extra.bulletWeight);
				this.setIgnoreGravity(options.disableGravity);
				this.scene.events.on('update', this.update, this);
				scene.add.existing(this);
				this.thrust(this.scene.playerParams.extra.bulletThrust);
				this.setCollisionCategory(8)
				this.setCollidesWith([2,4,8]);
				this.timeout = 100;
				this.body.density = 1;
			}
			update(time) {
				this.timeout -= 1;
				if(this.timeout <= 0 || this.body.destruction) {
					this.scene.events.off('update', this.update, this);
					this.destroy();
				}
			}
		}
		
		this.createBullet = function(x, y, angle, options) {
			var bull = new bullet(this, x, y, angle, options);
		} 
		
		this.createEnemy = function(x, y) {
			var bull = new enemy(this, x, y)
		} 
		
		this.createTree = function(x, y, size, type) {
			return new tree(this, x, y, size, type)
		} 
		
		this.createMachineBase = function(x, y, type, data) {
			var mach = new machineBase(this, x, y, type, data);
		}
		
		this.graphics = this.add.graphics().setDepth(2);
		this.graphics.lineStyle(5, 0xFF0000, 1.0);
		
		this.terrain = this.add.graphics().setDepth(1);
		this.terrainL = this.add.graphics().setDepth(1);
		
		this.createNextPlatform(null, {
			width: 100,
			height: 40,
			angle: 0,
			color: 0xFFFFFF,
		});
		
		
		this.fillTerrain();
		
		this.player = this.matter.add.sprite(this.spawn.x, this.spawn.y, "black").setDisplaySize(50,50).setFriction(0.9).setFrictionAir(0.01).setFrictionStatic(1).setDepth(3).setFixedRotation();
		this.player.isPlayer = true;

		this.playerParams = {
			max: {
				fireCD: 20,
				damageCD: 10,
				health: 100,
				jumpingCD: 300,
				sprintingCD: 200,
			},
			val: {
				fireCD: 0,
				damageCD: 0,
				health: 100,
				jumpingCD: 0,
				sprintingCD: 0,
			},
			extra: {
				shots: 1,
				bulletGravity: false,
				bulletWeight: 0.3,
				bulletThrust: 0.022,
			}
		};
		
		var waterWidth = this.platforms[this.platforms.length-1].getTopRight().x;
		this.water = this.matter.add.rectangle(waterWidth/2, 500, waterWidth, 750, {
			isSensor: true,
			isStatic: true,
			ignoreGravity: true,
		});
		this.water.isWater = true;
		
		this.waterGraphic = this.add.tileSprite(0,125,waterWidth,750,"water").setTileScale(0.5).setOrigin(0,0).setDepth(0);
		var treeTypes = ["tree1", "tree2"];
		console.log(waterWidth);
		for(var i=0;i<500;i++) {
			var a = this.createTree(Math.random()*waterWidth, -1000, Math.random()*0.2+1, treeTypes[Math.floor(Math.random()*2)]);
			a.ident = i;
			this.trees[a.ident] = a;
		}
		this.uiC.ignore(this.waterGraphic);
		this.uiC.ignore(this.platforms);
		this.uiC.ignore(Object.values(this.trees));

		this.playerDamageSensor = this.matter.add.rectangle(this.spawn.x, this.spawn.y, 50, 50, {
			isSensor: true,
			ignoreGravity: true,
		});
		this.playerDamageSensor.sensorType = "damage";
		this.playerMoveSensor = this.matter.add.rectangle(this.spawn.x, this.spawn.y, 50, 2, {
			isSensor: true,
			ignoreGravity: true,
		});
		this.playerMoveSensor.sensorType = "move";
		
		this.matter.world.on("collisionstart", (e) => {
			e.pairs.forEach(pair => {
				const {bodyA, bodyB} = pair;
				if(bodyA.label == "treeBottom" || bodyB.label == "treeBottom") {
					if(bodyA.isFloor) {
						bodyB.gameObject.body.isStatic = true;
					} else if(bodyB.isFloor) {
						bodyA.gameObject.body.isStatic = true;
					}
					if(bodyA.isWater) {
						delete this.trees[bodyB.gameObject.ident];
						bodyB.gameObject.destroy();
					} else if (bodyB.isWater) {
						delete this.trees[bodyA.gameObject.ident].destroy();
						bodyA.gameObject.destroy();
						
					}
				} else if(bodyA.isMachine || bodyB.isMachine) {
					if(bodyA.isFloor) {
						bodyB.gameObject.body.isStatic = true;
					} else if(bodyB.isFloor) {
						bodyA.gameObject.body.isStatic = true;
					}
				}
				
			})
		})
		
		this.matter.world.on("collisionactive", (e) => {
			e.pairs.forEach(pair => {
				const {bodyA, bodyB } = pair;
				if(bodyA != ctx.player.body && bodyB != ctx.player.body && bodyA.label != "treeBottom" && bodyB.label != "treeBottom" && bodyA.label != "tree" && bodyB.label != "tree" && !bodyA.isMachine && !bodyB.isMachine) {
					if((bodyA === ctx.playerMoveSensor || bodyB === ctx.playerMoveSensor) && bodyA != ctx.playerDamageSensor && bodyB != ctx.playerDamageSensor && !bodyA.isEnemy && !bodyB.isEnemy) {
						if(bodyA.isWater || bodyB.isWater) {
							ctx.player.inWater = true;
							this.player.setFrictionAir(0.4);
						} else {
							ctx.player.touching = true;
						};
					}
					if((bodyA === ctx.playerDamageSensor || bodyB === ctx.playerDamageSensor) && (bodyA.isEnemy || bodyB.isEnemy) && bodyA != ctx.playerMoveSensor && bodyB != ctx.playerMoveSensor){
						var canAttack = false;
						if(this.playerParams.val.damageCD <= 0) {
							if(bodyA.isEnemy) {
								if(bodyA.attackCD <= 0) {
									bodyA.attackCD = 10;
									this.playerParams.val.damageCD = this.playerParams.max.damageCD;
									canAttack = true;
								};
							} else if(bodyB.isEnemy) {
								if(bodyB.attackCD <= 0) {
									bodyB.attackCD = 10;
									this.playerParams.val.damageCD = this.playerParams.max.damageCD;
									canAttack = true;
								};
							};
						};
						if(canAttack) this.playerParams.val.health -= 1;
					}
					if((bodyA.isBullet || bodyB.isBullet) && (bodyA.isEnemy || bodyB.isEnemy)) {
						if(bodyA.isEnemy) {
							bodyA.health -= bodyB.bulletDamage;
							bodyB.destruction = true;
						} else {
							bodyB.health -= bodyA.bulletDamage;
							bodyA.destruction = true;
						}
					}
				}
			});
		});
		this.matter.world.on("collisionend", (e) => {
			e.pairs.forEach(pair => {
				const {bodyA, bodyB } = pair;
				if(bodyA != ctx.player.body && bodyB != ctx.player.body) {
					if((bodyA === ctx.playerMoveSensor || bodyB === ctx.playerMoveSensor) && bodyA != ctx.playerDamageSensor && bodyB != ctx.playerDamageSensor && !bodyA.isEnemy && !bodyB.isEnemy) {
						if(bodyA.isWater || bodyB.isWater) {
							ctx.player.inWater = false;
							this.player.setFrictionAir(0.01);
						} else {
							ctx.player.touching = false;
						};					}
					if((bodyA === ctx.playerDamageSensor || bodyB === ctx.playerDamageSensor) && (bodyA.isEnemy || bodyB.isEnemy) && bodyA != ctx.playerMoveSensor && bodyB != ctx.playerMoveSensor){
						console.log("No Oof");
					}
				}
			});
		})
		this.player.setCollidesWith(2);
		
		
		this.setCenterOfMass(this.player.body, this.player, {x: 0, y: 25});
		
		this.cameras.main.startFollow(this.player, false, 1, 1, 0, 100);
		
		this.input.on("pointerdown", (e) => {
			console.log("X: "+Math.floor(e.worldX*1000)/1000+"\nY: "+Math.floor(e.worldY*1000)/1000);
			this.isPointering = true;
		});
		this.input.on("pointerup", (e) => {
			this.isPointering = false;
		});
		
		this.mousePos = {
			worldX: 0,
			worldY: 0,
			x: 0,
			y: 0,
		}
		this.keys = {};
		
		this.UIElements.push(this.add.rectangle(83.5,13.5,153,13,0x000000).setDepth(4).setAngle(-0.5));
		this.sprintCDIndicator = this.add.rectangle(85,15,150,10,0xFFFFFF).setDepth(5).setAngle(-0.5);
		
		this.tweens.add({
			targets: [this.UIElements[0],this.sprintCDIndicator],
			angle: 0.5,
			duration: 1000,
			repeat: -1,
			yoyo: true,
		})
		
		this.UIElements.push(this.add.rectangle(83.5,33.5,153,13,0x000000).setDepth(4).setAngle(0.5));
		this.healthIndicator = this.add.rectangle(85,35,150,10,0xFFAAAA).setDepth(5).setAngle(0.5);
		this.damageCDIndicator = this.add.rectangle(85,43,150,2,0xFFFFFF).setDepth(6).setAngle(0.5);
		
		this.tweens.add({
			targets: [this.UIElements[1],this.healthIndicator,this.damageCDIndicator],
			angle: -0.5,
			duration: 1000,
			repeat: -1,
			yoyo: true,
		});
		
		this.UIElements.push(this.add.rectangle(config.width/2, config.height-100, config.width/3*2, 100, 0x999999).setAlpha(0.5));
		this.invSlots = {};
		this.invSlots["1"] = this.add.image(config.width/2-config.width/2/7*4, config.height-100, "tree1").setDisplaySize(config.width/2/8, 90);
		this.invSlots["2"] = this.add.image(config.width/2-config.width/2/7*3, config.height-100, "tree1").setDisplaySize(config.width/2/8, 90);
		this.invSlots["3"] = this.add.image(config.width/2-config.width/2/7*2, config.height-100, "tree1").setDisplaySize(config.width/2/8, 90);
		this.invSlots["4"] = this.add.image(config.width/2-config.width/2/7, config.height-100, "tree1").setDisplaySize(config.width/2/8, 90);
		this.invSlots["5"] = this.add.image(config.width/2, config.height-100, "tree1").setDisplaySize(config.width/2/8, 90);
		this.invSlots["6"] = this.add.image(config.width/2+config.width/2/7, config.height-100, "tree1").setDisplaySize(config.width/2/8, 90);
		this.invSlots["7"] = this.add.image(config.width/2+config.width/2/7*2, config.height-100, "tree1").setDisplaySize(config.width/2/8, 90);
		this.invSlots["8"] = this.add.image(config.width/2+config.width/2/7*3, config.height-100, "tree1").setDisplaySize(config.width/2/8, 90);
		this.invSlots["9"] = this.add.image(config.width/2+config.width/2/7*4, config.height-100, "tree1").setDisplaySize(config.width/2/8, 90);
		
		this.cameras.main.ignore(this.UIElements);
		this.cameras.main.ignore(this.healthIndicator);
		this.cameras.main.ignore(this.damageCDIndicator);
		this.cameras.main.ignore(this.sprintCDIndicator);
		this.cameras.main.ignore(Object.values(this.invSlots));
		
		this.keys["a"] = this.input.keyboard.addKey("a");
		this.keys["d"] = this.input.keyboard.addKey("d");
		this.keys["w"] = this.input.keyboard.addKey("w");
		this.keys["s"] = this.input.keyboard.addKey("s");
		this.keys["space"] = this.input.keyboard.addKey("space");
		this.keys["e"] = this.input.keyboard.addKey("e");
		this.keys["esc"] = this.input.keyboard.addKey("esc");
		
		this.cursors = this.input.keyboard.createCursorKeys();
		
		
		
		
		this.unloadable = false;
		setTimeout(()=>{ctx.unloadable = true}, 4000);
    }
    update() {
		var cent = this.player.getCenter();
		this.matter.body.setPosition(this.playerDamageSensor, cent);
		this.matter.body.setAngle(this.playerDamageSensor, Phaser.Math.Angle.Wrap(this.player.rotation));
		
		this.mousePos = this.input.mousePointer;
		if(this.unloadable) {
			for(var i=0;i<this.chunkLoads.length;i++) {
				if(this.player.x > this.chunkLoads[i].data.beginX && this.player.x < this.chunkLoads[i].data.finalX) {	
					this.loadChunks(i);
					this.currentChunk = i;
				} else if(i != this.currentChunk-1 && i != this.currentChunk+1){
					this.unloadChunks(i);
				};
			};
		};
		
		this.cursorPiece.setPosition(this.mousePos.x, this.mousePos.y);
		this.cursorPiece2.setPosition(this.mousePos.x, this.mousePos.y);
		if(this.isPointering && this.playerParams.val.fireCD <= 0) {
			this.playerParams.val.fireCD = this.playerParams.max.fireCD;
			var cent = this.player.getCenter();
			var angle = Phaser.Math.RadToDeg(Math.atan2((this.mousePos.y+this.cameras.main.scrollY)-cent.y, (this.mousePos.x+this.cameras.main.scrollX)-cent.x));
			for(var i=0;i<this.playerParams.extra.shots;i++) {
				this.createBullet(cent.x-(5*(i+1))+((this.playerParams.extra.shots-1)*2.5),cent.y,angle, {
					disableGravity: this.playerParams.extra.bulletGravity,
				});
			};
		};
		
		var a = this.player.getBottomLeft();
		var b = this.player.getBottomRight();
		var c = {x: ((a.x+b.x)/2), y: ((a.y+b.y)/2)}
		
		if(this.playerParams.val.jumpingCD > 0) this.playerParams.val.jumpingCD -= 1;
		
		this.matter.body.setPosition(this.playerMoveSensor, c);
		this.matter.body.setAngle(this.playerMoveSensor, Phaser.Math.Angle.Wrap(this.player.rotation));
		this.graphics.clear();
		this.graphics.lineStyle(2, 0xFF0000, 0.2);
		var a = this.player.getCenter();
		this.graphics.lineBetween(a.x, a.y, this.mousePos.x+this.player.body.position.x-config.width/2, this.mousePos.y+this.player.body.position.y-config.height/2-100);
		
		if(this.player.inWater) {
			if((this.cursors.up.isDown || this.keys["space"].isDown || this.keys["w"].isDown)) {
				this.player.thrustLeft(0.02);
			} else if((this.cursors.down.isDown || this.keys["s"].isDown)) {
				this.player.thrustRight(0.002);
			} else {
				this.player.thrustLeft(0.004);
			}
		} else {
			
		};
		
		if((this.cursors.right.isDown || this.keys["d"].isDown)) {
			if(this.player.touching) {
				this.player.thrust(0.03);
			} else if(this.player.inWater){
				this.player.thrust(0.01);
			};
		}
		if((this.cursors.left.isDown || this.keys["a"].isDown)) {
			if(this.player.touching) {
				this.player.thrustBack(0.03);
			} else if(this.player.inWater){
				this.player.thrustBack(0.01);
			};
		}
		if((this.cursors.up.isDown || this.keys["space"].isDown || this.keys["w"].isDown) && this.player.touching && this.playerParams.val.jumpingCD >= 0) {
			this.player.setVelocityY(-16);
			this.player.touching = false;
			this.playerParams.val.jumpingCD = this.playerParams.max.jumpingCD;
		};
		if(this.keys["e"].isDown) {
			if(this.selectedMachine != null) {
			}
		};
		if(this.cursors.shift.isDown && this.playerParams.val.sprintingCD <= 0) {
			if(this.cursors.right.isDown || this.keys["d"].isDown) {
				this.playerParams.val.sprintingCD = this.playerParams.max.sprintingCD;
				this.player.setVelocityX(15);
				this.player.setVelocityY(-8);
			};
			if(this.cursors.left.isDown || this.keys["a"].isDown) {
				this.playerParams.val.sprintingCD = this.playerParams.max.sprintingCD;
				this.player.setVelocityX(-15);
				this.player.setVelocityY(-8);
			};
		};
		if((this.player.touching || this.player.inWater) && this.playerParams.val.sprintingCD > 0) {
			this.playerParams.val.sprintingCD -= 1;
		};
		if(this.playerParams.val.damageCD > 0) {
			this.playerParams.val.damageCD -= 1;
		}
		if(this.playerParams.val.fireCD > 0) {
			this.playerParams.val.fireCD -= 1;
		}
		this.sprintCDIndicator.setScale(1-this.playerParams.val.sprintingCD/this.playerParams.max.sprintingCD, 1);
		this.healthIndicator.setScale(this.playerParams.val.health/this.playerParams.max.health, 1);
		this.damageCDIndicator.setScale(this.playerParams.val.damageCD/this.playerParams.max.damageCD, 1);
		if(this.keys["esc"].isDown) {
			this.scene.pause("Main");
			this.scene.launch("pauseMenu");
		};
    }
	loadChunks(mainChunk) {
		if(this.chunkLoads[mainChunk-1]) {
			this.chunkLoads[mainChunk-1].plats.forEach((plat) => {
				plat.setVisible(true);
				plat.setCollidesWith(-1);
			});
		}
		this.chunkLoads[mainChunk].plats.forEach((plat) => {
			plat.setVisible(true);
			plat.setCollidesWith(-1);
		});
		if(this.chunkLoads[mainChunk+1]) {
			this.chunkLoads[mainChunk+1].plats.forEach((plat) => {
				plat.setVisible(true);
				plat.setCollidesWith(-1);
			});
		};
	};
	unloadChunks(mainChunk) {
		this.chunkLoads[mainChunk].plats.forEach((plat) => {
			plat.setVisible(false);
			plat.setCollidesWith(null);
		});
	}
	createNextPlatform(prevPlat, options) {
		var platform = this.add.rectangle(0, 0, options.width, options.height, options.color);
		platform = this.matter.add.gameObject(platform, {
			isStatic: true,
		});
		platform.setCollisionCategory(2);
		platform.body.isFloor = true;
		platform.setAlpha(1);
		platform.objectType = "floor";
		//platform.setCollidesWith(null);
		platform.body.slop = 0;
		platform.setAngle(options.angle);
		if(platform.getBottomRight().y > 450 || platform.getBottomLeft().y > 450 || platform.getBottomRight().y < -500 || platform.getBottomLeft().y < -500) {
			platform.setAngle(-options.angle)
		}
		if(prevPlat != null) {
			var a = prevPlat.getTopRight();
			var b = platform.getTopLeft();
			platform.setPosition(platform.body.position.x-(b.x-a.x), platform.body.position.y-(b.y-a.y));
		};
		var endOfChunk = false;
		if(this.chunkLoads[this.chunkLoads.length-1]) {
			if(this.chunkLoads[this.chunkLoads.length-1].plats.length >= 32) {
				endOfChunk = true;
			}
		};
		
		if(this.chunkLoads.length == 0 || endOfChunk) {
		   this.chunkLoads.push({data: {}, plats: []});
		}
		
		var a = platform.getTopLeft().x;
		var b = platform.getBottomLeft().x;
		var c;
		if(a < b) {
			c = a;
		} else {
			c = b;
		};
		this.chunkLoads[this.chunkLoads.length-1].plats.push(platform);
		if(this.chunkLoads[this.chunkLoads.length-1].plats.length == 1) {
			this.chunkLoads[this.chunkLoads.length-1].data.beginX = c;
		}
		
		var a = platform.getTopRight().x;
		var b = platform.getBottomRight().x;
		var c;
		if(a > b) {
			c = a;
		} else {
			c = b;
		};
		if(this.chunkLoads[this.chunkLoads.length-1].plats.length == 32) {
			this.chunkLoads[this.chunkLoads.length-1].data.finalX = c;
		}
		this.platforms.push(platform);
		this.platformBodies.push(platform.body);
		if(this.platforms.length < this.maxPlatforms) {
			if(prevPlat != null) {
				var angle = prevPlat.rotation+(Math.random()*24-12);
				if(angle > 40) angle = 40;
				if(angle < -40) angle = -40;
			} else angle = (Math.random()*24-12);
			this.createNextPlatform(platform, {
				width: Math.floor(Math.random()*50+50),
				height: 40,
				angle: angle,
				color: 0xFFFFFF,
			});
		};
		this.spawn.x = (this.platforms[this.platforms.length-1].getTopRight().x)/2;
	}
	fillTerrain() {
		var points = [];
		var points2 = [];
		var points3 = [];
		var finalX = 0;
		for(var i=0;i<this.platforms.length;i++) {
			points.push(this.platforms[i].getTopLeft());
			points.push(this.platforms[i].getTopRight());
			points2.push(this.platforms[i].getTopLeft());
			points2.push(this.platforms[i].getTopRight());
			finalX = this.platforms[i].getTopRight().x;
		}
		for(var i=0;i<this.platforms.length;i++) {
			points3.push(this.platforms[i].getBottomRight());
			points3.push(this.platforms[i].getBottomLeft());
		}
		points.push({x: finalX, y: 1000});
		points.push({x: points[0].x, y: 1000});
		this.terrainL.clear();
		this.terrainL.beginPath();
		this.terrainL.moveTo(points[0].x,points[0].y);
		for(var i=0;i<points.length;i++) {
			this.terrainL.lineTo(points[i].x, points[i].y);
		}
		this.terrainL.closePath();
		this.terrainL.fill();
		
		this.terrainMask2 = this.terrainL.createGeometryMask();
		
		var a = this.platforms[this.platforms.length-1].getTopRight().x;
		var b = this.platforms[this.platforms.length-1].getBottomRight().x;
		var c;
		if(a > b) {
			c = a;
		} else {
			c = b;
		};
		
		this.dirt = this.add.tileSprite(0,500,c,2000,"dirt").setTileScale(0.5).setOrigin(0,0.5).setDepth(1);
		this.dirt.setMask(this.terrainMask2);
		
		points2 = points2.concat(points3.sort(compareNums));
		
		this.terrain.beginPath();
		this.terrain.moveTo(points2[0].x,points2[0].y);
		for(var i=0;i<points2.length;i++) {
			this.terrain.lineTo(points2[i].x, points2[i].y);
		}
		this.terrain.closePath
		this.terrain.fill();
		
		this.terrainMask = this.terrain.createGeometryMask();
		
		
		this.grass = this.add.tileSprite(0,0,c,1500,"grass").setTileScale(0.3).setOrigin(0,0.5).setDepth(1);
		this.grass.setMask(this.terrainMask);
		
		this.uiC.ignore(this.dirt);
		this.uiC.ignore(this.grass);
		
	}
	setCenterOfMass(body, gameObj, offset) {
		this.matter.body.setCentre( body, offset, true );

		const originX = gameObj.originX + ( offset.x / gameObj.displayWidth );
		const originY = gameObj.originY + ( offset.y / gameObj.displayHeight );
		gameObj.setOrigin( originX, originY );
	}
}

class pauseMenu extends Phaser.Scene {
	constructor() {
		super("pauseMenu");
	}
	preload() {
		
	}
	create() {
		this.background = this.add.rectangle(0,0,config.width,config.height, 0x000000).setAlpha(0.6).setInteractive().setScrollFactor(0).setOrigin(0,0);
		this.continueButton = this.add.sprite(config.width/2,config.height-200, "dirt").setScrollFactor(0).setInteractive().setDisplaySize(200,50);
		this.tweens.add({
			targets: this.continueButton,
			x: '+=10',
			yoyo: true,
			duration: 900,
			ease: 'Quad.easeInOut',
			persist: true,
			repeat: -1,
		});
		this.cursorPiece = this.add.circle(0,0,3,0x000000).setScrollFactor(0).setDepth(10);
		this.cursorPiece2 = this.add.circle(0,0,5,0xFFFFFF).setScrollFactor(0).setDepth(9);
		
		this.continueButton.on('pointerover', () => {
		  this.continueButton.setDisplaySize(210,60);
		});
		
		this.continueButton.on('pointerout', () => {
		  this.continueButton.setDisplaySize(200,50);
		});
		this.continueButton.on("pointerdown", () => {
			this.scene.stop("pauseMenu");
			this.scene.resume("Main");
		});
	}
	update() {
		this.mousePos = this.input.mousePointer;
		
		this.cursorPiece.setPosition(this.mousePos.x, this.mousePos.y);
		this.cursorPiece2.setPosition(this.mousePos.x, this.mousePos.y);
	}
}

function compareNums(a,b) {
	return b.x - a.x;
}

const config = {
    type: Phaser.AUTO,
    parent: "body",
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#666666",
    mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
    maxLights: 40,
    fps: {
      forceSetTimeOut: true,
      target: 60
    },
    physics: {
        default: "matter",
        matter: {
            //debug: true,
			gravity: {
				x: 0,
				y: 2,
			}
        },
    },
	loader: {
		crossOrigin: "anonymous",
	},
    plugins: {
          scene: [
              {
                  key: "PhaserNavMeshPlugin",
                  plugin: PhaserNavMeshPlugin.PhaserNavMeshPlugin,
                  mapping: "navMeshPlugin",
                  start: true
              },
          ]
      },
    scene: [Menu, Main, pauseMenu],
  }

  const game = new Phaser.Game(config);