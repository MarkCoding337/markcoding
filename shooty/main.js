var Phaser;
var PhaserNavMeshPlugin;
var ctx;
var mobile;

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
		
		this.tweens.add({
			targets: this.startButton,
			x: '+=10',
			yoyo: true,
			duration: 900,
			ease: 'Quad.easeInOut',
			persist: true,
			repeat: -1,
		});
		
		this.mobileFriendly = false;
		
		this.mobileText = this.add.text(config.width/2, config.height/2-75, "Playing Mobile?").setDepth(2).setOrigin(0.5, 0.5).setFontFamily("Arial");
		
		this.checkbox = this.add.rectangle(config.width/2, config.height/2, 50, 50, 0xCCCCCC).setDepth(2);
		this.checkmark = this.add.rectangle(config.width/2, config.height/2, 40, 40, 0x00AA00).setDepth(3).setInteractive().setAlpha(0.1);
		
		this.checkmark.on('pointerdown', () => {
			if(ctx.mobileFriendly) {
				ctx.checkmark.setAlpha(0.1);
				ctx.mobileFriendly = false;
			} else {
				ctx.checkmark.setAlpha(1);
				ctx.mobileFriendly = true;
			}
		})
		
		this.startButton.on('pointerover', () => {
		  this.startButton.setDisplaySize(210,60);
		});
		
		this.startButton.on('pointerout', () => {
		  this.startButton.setDisplaySize(200,50);
		});
		this.startButton.on("pointerdown", () => {
			if(this.mobileFriendly) {
				mobile = true;
			} else {mobile = false};
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
    }
    create() {
        ctx = this;
		this.platforms = [];
		this.platformBodies = [];
		this.UIElements = [];
		this.chunkLoads = [];
		this.isPointering = false;
		this.spawn = {x:0,y: -400};
		this.bullet;
		this.maxPlatforms = 750;
		this.cursorPiece = this.add.circle(0,0,3,0x000000).setScrollFactor(0).setDepth(10);
		this.cursorPiece2 = this.add.circle(0,0,5,0xFFFFFF).setScrollFactor(0).setDepth(9);
		
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
		
		this.graphics = this.add.graphics().setDepth(2);
		this.graphics.lineStyle(5, 0xFF0000, 1.0);
		
		this.terrain = this.add.graphics();
		this.terrainL = this.add.graphics();
		
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
		this.matter.world.on("collisionactive", (e) => {
			e.pairs.forEach(pair => {
				const {bodyA, bodyB } = pair;
				if(bodyA != ctx.player.body && bodyB != ctx.player.body) {
					if((bodyA === ctx.playerMoveSensor || bodyB === ctx.playerMoveSensor) && bodyA != ctx.playerDamageSensor && bodyB != ctx.playerDamageSensor && !bodyA.isEnemy && !bodyB.isEnemy) {
						ctx.player.touching = true;
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
						ctx.player.touching = false;
					}
					if((bodyA === ctx.playerDamageSensor || bodyB === ctx.playerDamageSensor) && (bodyA.isEnemy || bodyB.isEnemy) && bodyA != ctx.playerMoveSensor && bodyB != ctx.playerMoveSensor){
						console.log("No Oof");
					}
				}
			});
		})
		this.player.setCollidesWith(2);
		
		
		this.setCenterOfMass(this.player.body, this.player, {x: 0, y: 25});
		
		this.cameras.main.startFollow(this.player, false, 1, 1, 0, 100);
		
		if(mobile) {
			this.leftMove = this.add.rectangle(50, config.height-50, config.width/6, config.height/5, 0xFFFFFF).setAlpha(0.3).setDepth(10).setScrollFactor(0).setOrigin(0,1).setInteractive();
				this.leftMove.on('pointerover', () => {
					this.leftDown = true;
				});
				this.leftMove.on('pointerout', () => {
					this.leftDown = false;
				});
			
			
			this.rightMove = this.add.rectangle(60 + config.width/6, config.height-50, config.width/6, config.height/5, 0xFFFFFF).setAlpha(0.3).setDepth(10).setScrollFactor(0).setOrigin(0,1).setInteractive();
				this.rightMove.on('pointerover', () => {
					this.rightDown = true;
				});
				this.rightMove.on('pointerout', () => {
					this.rightDown = false;
				});
			
			this.jumpButton = this.add.rectangle(config.width-50, config.height-50, 175, 125, 0xFFFFFF).setAlpha(0.3).setDepth(10).setScrollFactor(0).setOrigin(1,1).setInteractive();
				this.jumpButton.on('pointerover', () => {
					this.upDown = true;
				});
				this.jumpButton.on('pointerout', () => {
					this.upDown = false;
				});
			this.dashButton = this.add.rectangle(config.width-50, config.height-185, 175, 125, 0xFFFFFF).setAlpha(0.3).setDepth(10).setScrollFactor(0).setOrigin(1,1).setInteractive();
				this.dashButton.on('pointerover', () => {
					this.dashDown = true;
				});
				this.dashButton.on('pointerout', () => {
					this.dashDown = false;
				});
			
		}
		
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
		
		this.UIElements.push(this.add.rectangle(83.5,13.5,153,13,0x000000).setScrollFactor(0).setDepth(4).setAngle(-0.5));
		this.sprintCDIndicator = this.add.rectangle(85,15,150,10,0xFFFFFF).setScrollFactor(0).setDepth(5).setAngle(-0.5);
		
		this.tweens.add({
			targets: [this.UIElements[0],this.sprintCDIndicator],
			angle: 0.5,
			duration: 1000,
			repeat: -1,
			yoyo: true,
		})
		
		this.UIElements.push(this.add.rectangle(83.5,33.5,153,13,0x000000).setScrollFactor(0).setDepth(4).setAngle(0.5));
		this.healthIndicator = this.add.rectangle(85,35,150,10,0xFFAAAA).setScrollFactor(0).setDepth(5).setAngle(0.5);
		this.damageCDIndicator = this.add.rectangle(85,43,150,2,0xFFFFFF).setScrollFactor(0).setDepth(6).setAngle(0.5);
		
		this.tweens.add({
			targets: [this.UIElements[1],this.healthIndicator,this.damageCDIndicator],
			angle: -0.5,
			duration: 1000,
			repeat: -1,
			yoyo: true,
		})
		
		
		this.keys["a"] = this.input.keyboard.addKey("a");
		this.keys["d"] = this.input.keyboard.addKey("d");
		this.keys["w"] = this.input.keyboard.addKey("w");
		this.keys["space"] = this.input.keyboard.addKey("space");
		this.keys["e"] = this.input.keyboard.addKey("e");
		this.keys["esc"] = this.input.keyboard.addKey("esc");
		
		this.cursors = this.input.keyboard.createCursorKeys();
    }
    update() {
		var cent = this.player.getCenter();
		this.matter.body.setPosition(this.playerDamageSensor, cent);
		this.matter.body.setAngle(this.playerDamageSensor, Phaser.Math.Angle.Wrap(this.player.rotation));
		
		this.mousePos = this.input.mousePointer;
		
		for(var i=0;i<this.chunkLoads.length;i++) {
			if(this.player.x > this.chunkLoads[i].data.beginX && this.player.x < this.chunkLoads[i].data.finalX) {	
				this.loadChunks(i);
				this.currentChunk = i;
			} else if(i != this.currentChunk-1 && i != this.currentChunk+1){
				this.unloadChunks(i);
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
		if((this.cursors.right.isDown || this.keys["d"].isDown || this.rightDown) && this.player.touching) {
			this.player.setVelocityX(10);
		}
		if((this.cursors.left.isDown || this.keys["a"].isDown || this.leftDown) && this.player.touching) {
			this.player.setVelocityX(-10);
		}
		if((this.cursors.up.isDown || this.keys["space"].isDown || this.keys["w"].isDown || this.upDown) && this.player.touching && this.playerParams.val.jumpingCD >= 0) {
			this.player.setVelocityY(-16);
			this.player.touching = false;
			this.playerParams.val.jumpingCD = this.playerParams.max.jumpingCD;
		};
		if(this.keys["e"].isDown) {
			this.createEnemy(this.player.body.position.x, -300 );
		};
		if((this.cursors.shift.isDown || this.dashDown) && this.playerParams.val.sprintingCD <= 0) {
			if(this.cursors.right.isDown || this.keys["d"].isDown || this.rightDown) {
				this.playerParams.val.sprintingCD = this.playerParams.max.sprintingCD;
				this.player.setVelocityX(18);
				this.player.setVelocityY(-8);
			};
			if(this.cursors.left.isDown || this.keys["a"].isDown || this.leftDown) {
				this.playerParams.val.sprintingCD = this.playerParams.max.sprintingCD;
				this.player.setVelocityX(-18);
				this.player.setVelocityY(-8);
			};
		};
		if(this.player.touching && this.playerParams.val.sprintingCD > 0) {
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
		platform.setAlpha(1);
		platform.objectType = "floor";
		//platform.setCollidesWith(null);
		platform.body.slop = 0;
		platform.setAngle(options.angle);
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
				var angle = prevPlat.rotation+(Math.random()*15-7.5);
				if(angle > 30) angle = 30;
				if(angle < -30) angle = -30;
			} else angle = Math.random()*15-7.5;
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
		points.push({x: finalX, y: 500});
		points.push({x: points[0].x, y: 500});
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
		
		this.dirt = this.add.tileSprite(0,0,c,1000,"dirt").setTileScale(0.5).setOrigin(0,0.5);
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
		
		
		this.grass = this.add.tileSprite(0,0,c,1000,"grass").setTileScale(0.3).setOrigin(0,0.5);
		this.grass.setMask(this.terrainMask);
		
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
            debug: false,
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