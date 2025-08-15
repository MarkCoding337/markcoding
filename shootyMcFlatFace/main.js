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
		this.load.plugin('rexvirtualjoystickplugin', "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js", true);
	}
	create() {
		ctx = this;
		screen.orientation.lock("landscape")
        .then(() => {
            console.log("Screen locked to landscape.");
        })
        .catch((error) => {
            console.error("Failed to lock screen orientation:", error);
        });
		this.player = this.add.rectangle(0,0,50,50,0xFFFFFF);
		this.player = this.matter.add.gameObject(this.player).setFrictionAir(0.5).setDepth(5).setCollisionCategory(1);
		this.player.body.isPlayer = true;
		this.cameras.main.startFollow(this.player, 0, 0.2);
		this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: 200,
                y: config.height-200,
                radius: 75,
                base: this.add.circle(0, 0, 100, 0x888888),
                thumb: this.add.circle(0, 0, 50, 0xcccccc),
                // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
                // forceMin: 16,
                // enable: true
            });
			this.joyStickCursor = this.joyStick.createCursorKeys();
			this.input.addPointer(1);
		this.sprintButton = this.add.rectangle(config.width - 150, config.height - 150, 100, 100, 0xcccccc).setDepth(5).setInteractive().setScrollFactor(0).setAlpha(0.5);
		this.sprintButton.on('pointerover', ()=>{
			ctx.sprintButton.isDown = true;
		});
		this.sprintButton.on('pointerdown', ()=>{
			ctx.sprintButton.isDown = true;
		});
		this.sprintButton.on('pointerout', ()=>{
			ctx.sprintButton.isDown = false;
		});
		this.sprintButton.on('pointerup', ()=>{
			ctx.sprintButton.isDown = false;
		});
		
		this.fireTarget;
		this.fireCD = 0;
		
		this.params = {
			speed: 5,
			sprintSpeed: 10,
			attackRadius: 500,
			fireCD: 50,
		}
		
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
				this.setTexture("");
				this.setDisplaySize(25,25);
				
				this.setBody({
					shape: "rectangle",
					width: 25,
					height: 25,
				});
				this.body.isEnemy = true;
				this.health = 2;//Math.floor(Math.random()*5+5);
				this.setFrictionAir(0.05);
				this.setFriction(0.05);
				this.setMass(0.15);
				this.setAngle(90);
				this.setFixedRotation(true);
				this.scene.events.on('update', this.update, this);
				scene.add.existing(this);
				this.setCollisionCategory(2);
				this.body.attackCD = 0;
				this.idleTimer = 0;
				this.following = false;
				this.speed = Math.random()*2+2;
				this.distDePlayer;
				this.body.density = 1;
				ctx.enemiesAliveBodies[""+this.body.id] = (this.body);
			}
			update() {
				var playPos = ctx.player.body.position;
				var thisPos = this.body.position;
				this.distDePlayer = Phaser.Math.Distance.BetweenPoints(playPos, thisPos);
				
				if(this.distDePlayer < 500) {
					this.following = true;
				};
				if(this.following) {
					if(playPos.x > thisPos.x+2) this.setVelocityX(this.speed); else if(playPos.x < thisPos.x-2) this.setVelocityX(-this.speed); else this.setVelocityX(0);
					if(playPos.y > thisPos.y+2) this.setVelocityY(this.speed); else if(playPos.y < thisPos.y-2) this.setVelocityY(-this.speed); else this.setVelocityY(0);
				} else {
					if(this.idleTimer <= 0) {
						this.setVelocityX((Math.random()*4)-2);
						this.setVelocityY((Math.random()*4)-2);
						this.idleTimer = Math.random()*120;
					}
					this.idleTimer -= 1;
				};
				if(this.health <= 0) {
					this.scene.events.off('update', this.update, this);
					delete ctx.enemiesAliveBodies[""+this.body.id];
					this.destroy();
				}
			}
		}
		class playerBullet extends Phaser.GameObjects.Rectangle
		{
			constructor(scene, x, y) {
				super(scene, x, y, 25, 25, 0xFF0000, 1);
				//this.scene = scene;
				scene.matter.add.gameObject(this);
				this.setDepth(1);
				this.setFrictionAir(0);
				this.bulletLife = 60;
				this.setCollisionCategory(3);
				this.body.isBullet = true;
				this.scene.events.on('update', this.update, this);
				var angle = Phaser.Math.Angle.Between(ctx.fireTarget.position.x, ctx.fireTarget.position.y, x, y);
				// Set a desired speed
				const speed = 5;

				// Calculate velocity components
				this.setVelocityX(-Math.cos(angle) * speed);
				this.setVelocityY(-Math.sin(angle) * speed);
				this.setCollidesWith(2);
				this.body.blacklist = [];
				this.pierce = 0;
				this.setSensor(true);
				this.body.isBullet = true;
			}
			update() {
				this.bulletLife -= 1;
				if(this.bulletLife <= 0) {
					this.destroy();
				}
			}
		}
		this.createEnemy = function(x, y) {
			var bull = new enemy1(this, x, y)
		} 
		this.createPlayerBullet = function(x, y) {
			var bull = new playerBullet(this, x, y);
			this.add.existing(bull);
		} 
		this.enemiesAliveBodies = {};
		for(var i=0;i<200;i++) {
			this.createEnemy(0,-100);
		}
		
		
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
					};
				} else if (body2.isBullet && !body2.blacklist.includes(body1.id)) {
					if(body1.isEnemy) {
						body1.gameObject.health -= 1;
						body2.blacklist.push(body1.id);
					};
				}
			}
		});
		
	}
	update() {
		var playPos = this.player.body.position;

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
			if(this.fireCD <= 0) {
				this.createPlayerBullet(playPos.x, playPos.y);
				this.fireCD = this.params.fireCD;
			} else {
				this.fireCD -= 1;
			}
		};
		
		const { scrollX, scrollY } = this.cameras.main;

		this.griddy.x = -Phaser.Math.Wrap(scrollX, 0, cellSize);
		this.griddy.y = -Phaser.Math.Wrap(scrollY, 0, cellSize);
		
		if(this.keys["e"].isDown) {
			this.createEnemy(0,0);
		}
		
		var down = this.cursorKeys.down.isDown || this.keys["s"].isDown || this.joyStickCursor.down.isDown;
		var up = this.cursorKeys.up.isDown || this.keys["w"].isDown || this.joyStickCursor.up.isDown;
		var right = this.cursorKeys.right.isDown || this.keys["d"].isDown || this.joyStickCursor.right.isDown;
		var left = this.cursorKeys.left.isDown || this.keys["a"].isDown || this.joyStickCursor.left.isDown;
		
		var speed;
		
		if(this.keys["shift"].isDown || this.sprintButton.isDown) {
			speed = this.params.sprintSpeed;
		} else {
			speed = this.params.speed;
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
}

var config = {
	type: Phaser.AUTO,
    parent: "body",
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#666666",
    //mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
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
				y: 0,
			}
        },
    },
	loader: {
		crossOrigin: "anonymous",
	},
    scene: [Main],
}

var game = new Phaser.Game(config)