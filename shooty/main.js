var Phaser;
var PhaserNavMeshPlugin;
var ctx;

class Main extends Phaser.Scene {
    constructor() {
        super("Main");
    }
    preload() {
		this.load.image("black", "https://cdn-icons-png.freepik.com/512/3/3854.png");
		this.load.image("grass", "https://static.vecteezy.com/system/resources/thumbnails/002/948/764/small/pixel-background-the-concept-of-games-background-vector.jpg");
		this.load.image("dirt", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5qtry-61iUvRWABkVv2tekiQ9FEX6PINFwQ&s");
		this.load.image("bullet1", "https://res.cloudinary.com/dohbq0tta/image/upload/v1748922194/bullet1_qrjatd.png");
    }
    create() {
        ctx = this;
		this.platforms = [];
		this.platformBodies = [];
		this.spawn = {x:0,y: -200};
		this.bullet;
		this.maxPlatforms = 1000;
		
		class enemy extends Phaser.Physics.Matter.Sprite
		{
			constructor(scene, x, y) {
				super(scene.matter.world, x, y);
				this.scene = scene;
				this.setTexture("grass");
				this.setBody("rectangle");
				this.body.isEnemy = true;
				this.setFrictionAir(0.05);
				this.setFriction(0.05);
				this.setDisplaySize(100,20);
				ctx.setCenterOfMass(this.body, this, {x: 15, y: 0});
				this.setMass(0.15);
				this.setAngle(90);
				this.setFixedRotation(true);
				scene.events.on('update', (time, delta) => {this.update(time, delta, scene)});
				scene.add.existing(this);
				this.setCollisionCategory(4);
				this.timeout = 100;
				this.following = false;
				this.body.density = 1;
			}
			update() {
				var cent = ctx.player.getCenter();
				if(this.following == false) {
					if(Phaser.Math.Distance.Between(this.body.position.x, this.body.position.y, cent.x, cent.y) <= 500) {
						this.following = true;
					}
				} else {
					if(cent.x > this.body.position.x) {
						this.setVelocityX(2)
					} else {
						this.setVelocityX(-2)
					}
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
				this.body.slop = 0.00001;
				this.setMass(0.15);
				this.setIgnoreGravity(options.disableGravity);
				scene.events.on('update', (time, delta) => {this.update(time, delta, scene)});
				scene.add.existing(this);
				this.thrust(0.012);
				this.setCollidesWith([2,4]);
				this.timeout = 100;
				this.body.density = 1;
			}
			update(time) {
				this.timeout -= 1;
				if(this.timeout <= 0) {
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
			height: 30,
			angle: 0,
			color: 0xFFFFFF,
		});
		
		this.fillTerrain();
		
		this.player = this.matter.add.sprite(this.spawn.x, this.spawn.y, "black").setDisplaySize(50,50).setFriction(0.9).setFrictionAir(0.01).setDepth(3);
		this.player.isPlayer = true;
		this.player.jumpingCD = 0;

		this.playerDamageSensor = this.matter.add.rectangle(this.spawn.x, this.spawn.y, 50, 50, {
			isSensor: true,
			ignoreGravity: true,
		});
		this.playerDamageSensor.sensorType = "damage";
		this.playerMoveSensor = this.matter.add.rectangle(this.spawn.x, this.spawn.y, 40, 2, {
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
						console.log("Oof");
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
		
		this.input.on("pointerdown", (e) => {
			console.log("X: "+Math.floor(e.worldX*1000)/1000+"\nY: "+Math.floor(e.worldY*1000)/1000);
			var cent = this.player.getCenter();
			var angle = Phaser.Math.RadToDeg(Math.atan2(e.worldY-cent.y, e.worldX-cent.x));
			this.createBullet(cent.x-5,cent.y,angle, {
				disableGravity: false
			});
		});
		
		this.mousePos = {
			worldX: 0,
			worldY: 0,
			x: 0,
			y: 0,
		}
		this.keys = {};
		
		this.keys["a"] = this.input.keyboard.addKey("a");
		this.keys["d"] = this.input.keyboard.addKey("d");
		this.keys["w"] = this.input.keyboard.addKey("w");
		this.keys["space"] = this.input.keyboard.addKey("space");
		this.keys["e"] = this.input.keyboard.addKey("e");
		
		this.cursors = this.input.keyboard.createCursorKeys();
    }
    update() {
		var cent = this.player.getCenter();
		this.matter.body.setPosition(this.playerDamageSensor, cent);
		this.playerDamageSensor.angle = Phaser.Math.Angle.Wrap(this.player.rotation);
		
		var a = this.player.getBottomLeft();
		var b = this.player.getBottomRight();
		var c = {x: ((a.x+b.x)/2), y: ((a.y+b.y)/2)}
		
		if(this.player.jumpingCD > 0) this.player.jumpingCD -= 1;
		
		this.matter.body.setPosition(this.playerMoveSensor, c);
		this.playerMoveSensor.angle = this.player.rotation;
		this.mousePos = this.input.mousePointer;
		this.graphics.clear();
		this.graphics.lineStyle(2, 0xFF0000, 1.0);
		var a = this.player.getCenter();
		this.graphics.lineBetween(a.x, a.y, this.mousePos.x+this.player.body.position.x-config.width/2, this.mousePos.y+this.player.body.position.y-config.height/2-100);
		if((this.cursors.right.isDown || this.keys["d"].isDown) && this.player.touching) {
			this.player.thrust(0.04);
		}
		if((this.cursors.left.isDown || this.keys["a"].isDown) && this.player.touching) {
			this.player.thrustBack(0.04);
		}
		if((this.cursors.up.isDown || this.keys["space"].isDown || this.keys["w"].isDown) && this.player.touching && this.player.jumpingCD >= 0) {
			this.player.setVelocityY(-16);
			this.player.touching = false;
			this.player.jumpingCD = 100;
		};
		if(this.keys["e"].isDown) {
			this.createEnemy(this.player.body.position.x, -300 );
		};
    }
	createNextPlatform(prevPlat, options) {
		var platform = this.add.rectangle(0, 0, options.width, options.height, options.color);
		platform = this.matter.add.gameObject(platform, {
			isStatic: true,
		});
		platform.setCollisionCategory(2);
		platform.setAlpha(0);
		platform.objectType = "floor";
		platform.setAngle(options.angle);
		if(prevPlat != null) {
			var a = prevPlat.getTopRight();
			var b = platform.getTopLeft();
			platform.setPosition(platform.body.position.x-(b.x-a.x), platform.body.position.y-(b.y-a.y));
		};
		this.platforms.push(platform);
		this.platformBodies.push(platform.body);
		if(this.platforms.length < this.maxPlatforms) {
			if(prevPlat != null) {
				var angle = prevPlat.rotation+(Math.random()*10-5);
				if(angle > 30) angle = 30;
				if(angle < -30) angle = -30;
			} else angle = Math.random()*10-5;
			this.createNextPlatform(platform, {
				width: Math.floor(Math.random()*50+50),
				height: 30,
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
		
		
		this.grass = this.add.tileSprite(0,0,c,500,"grass").setTileScale(0.3).setOrigin(0,0.5);
		this.grass.setMask(this.terrainMask);
		
	}
	setCenterOfMass(body, gameObj, offset) {
		this.matter.body.setCentre( body, offset, true );

		const originX = gameObj.originX + ( offset.x / gameObj.displayWidth );
		const originY = gameObj.originY + ( offset.y / gameObj.displayHeight );
		gameObj.setOrigin( originX, originY );
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
            debug: true,
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
    scene: [Main],
  }

  const game = new Phaser.Game(config);