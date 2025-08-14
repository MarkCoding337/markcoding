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
	
	create() {
		ctx = this;
		this.player = this.add.rectangle(0,0,50,50,0xFFFFFF);
		this.player = this.matter.add.gameObject(this.player).setFrictionAir(0.5).setDepth(5);
		this.cameras.main.startFollow(this.player, 0, 0.2);
		
		this.params = {
			speed: 5,
			sprintSpeed: 10,
			attackRadius: 500,
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
			"shift": ctx.input.keyboard.addKey("shift")
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
				this.health = Math.floor(Math.random()*5+5);
				this.setFrictionAir(0.05);
				this.setFriction(0.05);
				this.setMass(0.15);
				this.setAngle(90);
				this.setFixedRotation(true);
				this.scene.events.on('update', this.update, this);
				scene.add.existing(this);
				this.setCollisionCategory(4);
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
		this.createEnemy = function(x, y) {
			var bull = new enemy1(this, x, y)
		} 
		this.enemiesAliveBodies = {};
		for(var i=0;i<200;i++) {
			this.createEnemy(0,-100);
		}
		
		
		
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
		
		if(closestBody != null) closestBody.gameObject.health -= 1;
		
		const { scrollX, scrollY } = this.cameras.main;

		this.griddy.x = -Phaser.Math.Wrap(scrollX, 0, cellSize);
		this.griddy.y = -Phaser.Math.Wrap(scrollY, 0, cellSize);
		
		var down = this.cursorKeys.down.isDown || this.keys["s"].isDown;
		var up = this.cursorKeys.up.isDown || this.keys["w"].isDown;
		var right = this.cursorKeys.right.isDown || this.keys["d"].isDown;
		var left = this.cursorKeys.left.isDown || this.keys["a"].isDown;
		
		var speed;
		
		if(this.keys["shift"].isDown) {
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