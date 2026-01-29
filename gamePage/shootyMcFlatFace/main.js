/*screen.orientation.lock("landscape")
        .then(() => {
            console.log("Screen locked to landscape.");
        })
        .catch((error) => {
            console.error("Failed to lock screen orientation:", error);
        });
*/
var ctx;
var cellSize = 500;

var Phaser;


class Menu extends Phaser.Scene
{
	constructor() {
		super("Menu");
	}
	create() {
		this.add.rectangle(0,0,100,100,0x000000);
	}
}

class Main extends Phaser.Scene
{
	constructor() {
		super("Main");
	}
	preload() {
		this.load.spritesheet("enemy1", "https://ik.imagekit.io/markathious/ShootyMcFlatFace/IMG_0066.png", {frameWidth: 16, frameHeight: 16});
		this.load.plugin('rexvirtualjoystickplugin', "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js", true);
		//this.load.plugin('rextoggleswitchplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextoggleswitchplugin.min.js', true);
	}
	create() {
		ctx = this;

		this.mobile = this.sys.game.device.input.touch;

		this.game.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
		this.player = this.add.rectangle(0,0,50,50,0xFFFFFF);
		this.player = this.matter.add.gameObject(this.player).setFrictionAir(0.5).setDepth(5).setCollisionCategory(1);
		this.player.setFixedRotation(true);
		this.player.body.sleepThreshold = -1;
		this.player.body.isPlayer = true;
		
		this.animationPrep();
		
		this.waveBar = this.add.rectangle(0,0,config.width,20,0x88FF88).setScrollFactor(0).setDepth(10).setOrigin(0,0);
		this.waveBarBG = this.add.rectangle(0,0,config.width,21,0x000000).setScrollFactor(0).setDepth(9).setOrigin(0,0);
		this.waveProgress = 0;
		this.nextWaveTimer = 600;
		this.waveLevel = 0;

		this.enemieNum = 0;
		this.enemieTracker = this.add.text(10,30,"Enemies: 0",{fontSize: '20px', fill: '#FFFFFF'}).setScrollFactor(0).setDepth(10);

		this.waveTracker = this.add.text(10,50,"Wave: 0",{fontSize: '20px', fill: '#FFFFFF'}).setScrollFactor(0).setDepth(10);

		this.pointInScreen2 = this.add.circle(config.width/2,config.height/2, 4, 0xFF0000).setScrollFactor(0).setDepth(5);
		this.connectionLine = this.add.line(0,0,0,0,0,0,0xFF0000, 1).setScrollFactor(0).setDepth(6);
		this.pointInScreen = this.add.circle(config.width/2,config.height/2, 3, 0x000000).setScrollFactor(0).setDepth(7);
		this.cameras.main.startFollow(this.player, 0);
		if(this.mobile) {
			this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
					x: 150,
					y: config.height-150,
					radius: config.height/10,
					base: this.add.circle(0, 0, config.height/7, 0x888888).setDepth(5),
					thumb: this.add.circle(0, 0, config.height/14, 0xcccccc).setDepth(5),
					// dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
					// forceMin: 16,
					// enable: true
				});
				this.input.addPointer(1);
			this.aimJoyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
					x: config.width-150,
					y: config.height-150,
					radius: config.height/10,
					base: this.add.circle(0, 0, config.height/7, 0x888888).setDepth(5),
					thumb: this.add.circle(0, 0, config.height/14, 0xcccccc).setDepth(5),
					// dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
					// forceMin: 16,
					// enable: true
				});
				this.input.addPointer(1);
		};
		
		/*this.spawnButton = this.add.rectangle(config.width - 150, config.height - 150, 100, 100, 0xcccccc).setDepth(5).setInteractive().setScrollFactor(0).setAlpha(0.5);
		this.spawnButton.on('pointerover', ()=>{
			ctx.spawnButton.isDown = true;
		});
		this.spawnButton.on('pointerdown', ()=>{
			ctx.spawnButton.isDown = true;
		});
		this.spawnButton.on('pointerout', ()=>{
			ctx.spawnButton.isDown = false;
		});
		this.spawnButton.on('pointerup', ()=>{
			ctx.spawnButton.isDown = false;
		});*/
		this.mouse = this.input.activePointer;
		
		this.fireTarget;
		this.fireCD = 0;
		
		this.params = {
			speed: 5,
			sprintSpeed: 10,
			attackRadius: 500,
			fireCD: 50,
			pierce: 2,
			bulletSpeed: 10,
			bulletLife: 60,
			bulletNum: 1,
		}
		
		this.aimMem = {
			angle: 0,
			dx: 0,
			dy: 0,
		};
		
		const cam = this.cameras.main;

		const { width, height } = cam;
		
		this.griddy = this.add
		.grid(0, 0, width + cellSize, height + cellSize, cellSize, cellSize, 0x000000, 1, 0xFFFFFF, 1)
		.setAlpha(0.2)
		.setOrigin(0,0)
		.setScrollFactor(0)
		.setDepth(1);
		
		this.cursorKeys = this.input.keyboard.createCursorKeys();
		this.keys = {
			"a": ctx.input.keyboard.addKey("a"),
			"d": ctx.input.keyboard.addKey("d"),
			"w": ctx.input.keyboard.addKey("w"),
			"s": ctx.input.keyboard.addKey("s"),
			"shift": ctx.input.keyboard.addKey("shift"),
			"e": ctx.input.keyboard.addKey("e"),
		};
		
		//Enemies
		
		class enemy1 extends Phaser.Physics.Matter.Sprite
		{
			constructor(scene, x, y) {
				super(scene.matter.world, x, y);
				this.scene = scene;
				this.setTexture("enemy1");
				this.setDisplaySize(25,25);
				this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
				this.setBody({
					shape: "rectangle",
					width: 15,
					height: 20,
				});
				this.body.isEnemy = true;
				this.body.sleepThreshold = -1;
				this.health = 2;//Math.floor(Math.random()*5+5);
				this.setFrictionAir(0.05);
				this.setFriction(0.05);
				this.setMass(0.15);
				this.setAngle(0);
				this.setFixedRotation(true);
				this.setScale(Math.random()*0.5+3);
				this.scene.events.on('update', this.update, this);
				scene.add.existing(this);
				this.setCollisionCategory(2);
				this.body.attackCD = 0;
				this.idleTimer = 0;
				this.despawnTimer = 0;
				this.following = false;
				ctx.enemieNum += 1;
				this.speed = (Math.random()*2+2)*1.2;
				this.frameCount = 0;
				this.distDePlayer;
				this.body.density = 1;
				ctx.enemiesAliveBodies[""+this.body.id] = (this.body);
			}
			update() {
				this.frameCount += 1;
				if(this.frameCount % 5 == 0) {
					var playPos = ctx.player.body.position;
					var thisPos = this.body.position;
					this.distDePlayer = Phaser.Math.Distance.BetweenPoints(playPos, thisPos);
					
					//Movement
					if(this.following) {
						const angle = Phaser.Math.Angle.Between(
							thisPos.x, thisPos.y,
							playPos.x, playPos.y
						);
						this.setVelocity(
							Math.cos(angle) * this.speed,
							Math.sin(angle) * this.speed
						)
						
					} else if(this.distDePlayer <= 2000) {
						if(this.idleTimer <= 0) {
							this.setVelocityX((Math.random()*5)-2.5);
							this.setVelocityY((Math.random()*5)-2.5);
							this.idleTimer = Math.random()*5;
						}
						this.idleTimer -= 1;
					};

					//Animation
					const absVelX = Math.abs(this.body.velocity.x);
					const absVelY = Math.abs(this.body.velocity.y);
					if(absVelX < 0.5 && absVelY < 0.5) {
						//Idle
						this.anims.stop();
					} else {
						//Moving
						if(absVelX > absVelY) {
							//Moving sideways
							if(this.body.velocity.x > 0) {
								this.anims.play('e1WalkRight', true);
							} else {
								this.anims.play('e1WalkLeft', true);
							}
						} else {
							//Moving up/down
							if(this.body.velocity.y > 0) {
								this.anims.play('e1WalkDown', true);
							} else {
								this.anims.play('e1WalkUp', true);
							}
						}
					};

					//Player Tracking
					if(this.distDePlayer < 500) {
						this.following = true;
						Phaser.Physics.Matter.Matter.Sleeping.set(this.body, false);
					};
					if(this.distDePlayer > 1000) {
						this.following = false;
					};
					if(this.distDePlayer > 2000) {
						Phaser.Physics.Matter.Matter.Sleeping.set(this.body, true);
						this.anims.stop();
					};
					if(this.distDePlayer > 2500) {
						this.scene.events.off('update', this.update, this);
						delete ctx.enemiesAliveBodies[""+this.body.id];
						ctx.enemieNum -= 1;
						this.destroy();
					};
					
					if(this.health <= 0) {
						this.scene.events.off('update', this.update, this);
						delete ctx.enemiesAliveBodies[""+this.body.id];
						ctx.enemieNum -= 1;
						this.destroy();
					}
					
				};
			}
		}
		class playerBullet extends Phaser.GameObjects.Arc
		{
			constructor(scene, x, y, speed, angle) {
				super(scene, x, y, 12.5, 0, 360, false, 0xFF0000, 1);
				//this.scene = scene;
				scene.matter.add.gameObject(this);
				this.setCircle(12.5);
				this.setDepth(1);
				this.setFrictionAir(0);
				this.bulletLife = ctx.params.bulletLife;
				
				this.setCollisionCategory(3);
				this.body.isBullet = true;
				this.scene.events.on('update', this.update, this);
				var bullSpeed;
				if(speed != null) {
					bullSpeed = speed;
				} else {
					bullSpeed = ctx.params.bulletSpeed;
				};
				this.setVelocityX(-Math.cos(angle) * bullSpeed);
				this.setVelocityY(-Math.sin(angle) * bullSpeed);
				/*if(ctx.fireTarget != null) {
					var angle = Phaser.Math.Angle.Between(ctx.fireTarget.position.x, ctx.fireTarget.position.y, x, y);

					// Calculate velocity components
					this.setVelocityX(-Math.cos(angle) * bullSpeed);
					this.setVelocityY(-Math.sin(angle) * bullSpeed);
				} else {
					var a = Math.floor(Math.random()*2)-1;
					var b = Math.floor(Math.random()*2)-1;
					this.setVelocityX(bullSpeed*a);
					this.setVelocityY(bullSpeed*b);
				};*/
				this.setCollidesWith(2);
				this.body.blacklist = [];
				this.body.pierce = ctx.params.pierce;
				this.setSensor(true);
				this.body.isBullet = true;
			}
			update() {
				this.bulletLife -= 1;
				if(this.bulletLife <= 0 || this.body.pierce <= 0) {
					this.scene.events.off('update', this.update, this);
					this.destroy();
				}
			}
		}
		this.createEnemy = function(x, y) {
			var bull = new enemy1(this, x, y)
		} 
		this.createPlayerBullet = function(x, y, speed, angle) {
			var bull = new playerBullet(this, x, y, speed, angle);
			this.add.existing(bull);
		} 
		this.enemiesAliveBodies = {};
		
		this.enemyTimer = 60;
		
		
		this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
			for (let i = 0; i < event.pairs.length; i++) {
				const pair = event.pairs[i];

				// Access the Matter bodies involved in the collision
				const body1 = pair.bodyA;
				const body2 = pair.bodyB;
				// Check if either of the bodies belongs to your array
				if (body1.isBullet) {
					if(body2.isEnemy && !body1.blacklist.includes(body2.id)) {
						body2.gameObject.health -= 1;
						body1.blacklist.push(body2.id);
						body1.pierce -= 1;
					};
				} else if (body2.isBullet && !body2.blacklist.includes(body1.id)) {
					if(body1.isEnemy) {
						body1.gameObject.health -= 1;
						body2.blacklist.push(body1.id);
						body2.pierce -= 1;
					};
				}
			}
		});
		
	}
	update() {
		var playPos = this.player.body.position;

		this.enemieTracker.setText("Enemies: " + this.enemieNum);

		this.waveBar.width = (this.waveProgress / this.nextWaveTimer) * config.width;
		if(this.waveProgress >= this.nextWaveTimer) {
			this.waveProgress = 0;
			this.waveLevel += 1;
			this.waveTracker.setText("Wave: " + this.waveLevel);
			this.nextWaveTimer += 300*this.waveLevel;
		} else {
			this.waveProgress += 1;
		};
		if(this.enemyTimer > 0) {
			this.enemyTimer -= 1;
		} else {
			this.enemyTimer = 120 - (this.waveLevel*2);
		};
		if(this.enemyTimer == 1) {
			for(var i=0;i<this.waveLevel*2;i++) {
				var angle = Math.random()*Math.PI*2;
				var dist = Math.random()*500+500;
				var x = playPos.x + Math.cos(angle)*dist;
				var y = playPos.y + Math.sin(angle)*dist;
				this.createEnemy(x,y);
			}
		};

		var dx;
		var dy;

		var angle;
		if(this.mobile) {
			if(this.aimJoyStick.force >= 10) {
				angle = Phaser.Math.DegToRad(this.aimJoyStick.angle+180);

				this.aimMem.angle = angle;

				dx = (this.aimJoyStick.forceX) * 0.05;
				dy = (this.aimJoyStick.forceY) * 0.05;

				this.aimMem.dx = dx;
				this.aimMem.dy = dy;

				this.cameras.main.followOffset.x = -dx;
				this.cameras.main.followOffset.y = -dy;
			} else {
				angle = this.aimMem.angle;
				dx = this.aimMem.dx;
				dy = this.aimMem.dy;
			};
		} else {
			angle = Phaser.Math.Angle.Between(this.mouse.x, this.mouse.y, config.width/2, config.height/2);
			
			dx = (this.mouse.x - config.width/2) * 0.05;
			dy = (this.mouse.y - config.height/2) * 0.05;

			this.cameras.main.followOffset.x = -dx;
			this.cameras.main.followOffset.y = -dy;
		};
		var x = -Math.cos(angle) * 50;
		var y = -Math.sin(angle) * 50;
		this.pointInScreen.setPosition(config.width/2+x-dx, config.height/2+y-dy);
		this.pointInScreen2.setPosition(config.width/2-dx, config.height/2-dy);
		this.connectionLine.setTo(config.width/2-dx, config.height/2-dy, config.width/2+x-dx, config.height/2+y-dy);
		if(this.fireCD <= 0) {
			for(var i=0;i<this.params.bulletNum;i++) {
				this.time.delayedCall(10*i, ()=>{this.createPlayerBullet(playPos.x, playPos.y, null, angle)}, [], this);
			};
			this.fireCD = this.params.fireCD;
		} else {
			this.fireCD -= 1;
		}

		/*
		//Automatic targeting and firing
		let closestBody = null;
		let minDistance = Infinity;

		for (const body of Object.values(this.enemiesAliveBodies)) {
		  // Calculate the distance between your source (e.g., mouse position)
		  // and the center of the current `body`
		  const distance = Phaser.Math.Distance.Between(
			playPos.x,
			playPos.y,
			body.position.x,
			body.position.y
		  );

		  if (distance < minDistance && distance < this.params.attackRadius) {
			minDistance = distance;
			closestBody = body;
		  }
		}
		
		this.fireTarget = closestBody;
		if(this.fireTarget != null) {
			var angle = Phaser.Math.Angle.Between(ctx.fireTarget.position.x, ctx.fireTarget.position.y, playPos.x, playPos.y);
			var x = -Math.cos(angle) * 50;
			var y = -Math.sin(angle) * 50;
			this.pointInScreen.setPosition(config.width/2+x, config.height/2+y);
			this.connectionLine.setTo(config.width/2, config.height/2, config.width/2+x, config.height/2+y);
			if(this.fireCD <= 0) {
				for(var i=0;i<this.params.bulletNum;i++) {
					this.time.delayedCall(10*i, ()=>{this.createPlayerBullet(playPos.x, playPos.y, null, angle)}, [], this);
				};
				this.fireCD = this.params.fireCD;
			} else {
				this.fireCD -= 1;
			}
			
			
			//this.pointInScreen.setPosition(ctx.fireTarget.position.x-this.cameras.main.scrollX, ctx.fireTarget.position.y-this.cameras.main.scrollY);
			//this.connectionLine.setTo(config.width/2, config.height/2, ctx.fireTarget.position.x-this.cameras.main.scrollX, ctx.fireTarget.position.y-this.cameras.main.scrollY);
			
		} else {
			this.pointInScreen.setPosition(config.width/2, config.height/2);
			this.connectionLine.setTo(config.width/2, config.height/2, config.width/2, config.height/2);
		};
		*/
		const { scrollX, scrollY } = this.cameras.main;

		this.griddy.x = -Phaser.Math.Wrap(scrollX, 0, cellSize);
		this.griddy.y = -Phaser.Math.Wrap(scrollY, 0, cellSize);
		
		if(this.keys["e"].isDown) {
			this.createEnemy(playPos.x,playPos.y-200);
		}
		
		var down = this.cursorKeys.down.isDown || this.keys["s"].isDown;
		var up = this.cursorKeys.up.isDown || this.keys["w"].isDown;
		var right = this.cursorKeys.right.isDown || this.keys["d"].isDown;
		var left = this.cursorKeys.left.isDown || this.keys["a"].isDown;

		var speed;
		if(this.mobile) {
			this.joyStick.force > 80 || this.keys["shift"].isDown ? speed = this.params.sprintSpeed : speed = this.params.speed;
			if(this.joyStick.force < 10 && !down && !up) {
				this.player.setVelocityY(0);
			}
			if(this.joyStick.force < 10 && !right && !left) {
				this.player.setVelocityX(0);
			}
			if(this.joyStick.force >= 10) {
				const angle = Phaser.Math.DegToRad(this.joyStick.angle);
				this.player.setVelocity(
					Math.cos(angle) * speed,
					Math.sin(angle) * speed
				);
			}
		} else {
			this.keys["shift"].isDown ? speed = this.params.sprintSpeed : speed = this.params.speed;
		}

		if(down) {
			this.player.setVelocityY(speed);
		}
		if(up) {
			this.player.setVelocityY(-speed);
		}
		if(right) {
			this.player.setVelocityX(speed);
		}
		if(left) {
			this.player.setVelocityX(-speed);
		}
		
	}
	setCenterOfMass(body, gameObj, offset) {
		this.matter.body.setCentre( body, offset, true );

		const originX = gameObj.originX + ( offset.x / gameObj.displayWidth );
		const originY = gameObj.originY + ( offset.y / gameObj.displayHeight );
		gameObj.setOrigin( originX, originY );
	}
	animationPrep() {
		this.anims.create({
			key: 'e1WalkDown',
			frames: this.anims.generateFrameNumbers('enemy1', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1 // -1 means loop forever
		});
		this.anims.create({
			key: 'e1WalkUp',
			frames: this.anims.generateFrameNumbers('enemy1', { start: 4, end: 7 }),
			frameRate: 10,
			repeat: -1 // -1 means loop forever
		});
		this.anims.create({
			key: 'e1WalkRight',
			frames: this.anims.generateFrameNumbers('enemy1', { start: 8, end: 11 }),
			frameRate: 10,
			repeat: -1 // -1 means loop forever
		});
		this.anims.create({
			key: 'e1WalkLeft',
			frames: this.anims.generateFrameNumbers('enemy1', { start: 12, end: 15 }),
			frameRate: 10,
			repeat: -1 // -1 means loop forever
		});
	}
}

var config = {
	type: Phaser.AUTO,
    parent: "body",
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#666666",
    //mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
    maxLights: 40,
	input: {
    	touch: {
      		capture: false
    	}
  	},
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
				y: 0,
			},
			enableSleeping: true,
        },
    },
	loader: {
		crossOrigin: "anonymous",
	},
    scene: [Main],
}

var game = new Phaser.Game(config)