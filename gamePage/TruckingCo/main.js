var ctx;
class Main extends Phaser.Scene
{
	constructor() {
		super("Main");
	}
	preload() {
		this.load.image("road", "https://res.cloudinary.com/dohbq0tta/image/upload/v1767475009/IMG_0065_x8fv3m.jpg");
	}	
	create() {
		ctx = this;
		this.keys = {};
		this.UIElements = [];
		
		this.roadEntity = this.add.sprite(0,0,"road").setOrigin(0,0).setDepth(-1).setScale(10);

		this.marker = this.add.rectangle(0,0,100,100,0xFF0000);
		this.marker2 =  this.add.line(0,0,0,0,0,900, 0x0000FF).setOrigin(0.5,0);

		
		this.car = this.add.rectangle(0,0,100,150,0xFFFFFF);
		this.car = this.matter.add.gameObject(this.car, {});
		this.car.setFrictionAir(0.2);
		this.car.setCollisionCategory(2);
		this.car.setCollidesWith([4]);
		this.setCenterOfMass(this.car.body, this.car, {x: 0, y: 125});
		this.deck = this.add.rectangle(200,0,100,100, 0x999999);
		this.deck = this.matter.add.gameObject(this.deck, {});
		this.deck.setCollisionCategory(8);
		this.truckConnection = this.matter.add.constraint(this.car, this.deck, 0, 0.5, {
			pointA: {x: 0, y: 0}
		});
		
		this.cart = this.add.rectangle(0, 250, 100, 400, 0xAAAAAA);
		this.cart = this.matter.add.gameObject(this.cart);
		this.cart.setCollisionCategory(4);
		this.cart.setCollidesWith([2]);
		this.cart.setFrictionAir(0.2);
		this.setCenterOfMass(this.cart.body, this.cart, {x: 0, y: 125});
		
		this.hitch = this.matter.add.constraint(this.deck, this.cart, 0, 0.5, {
			pointB: {x: 0, y: -300},
		});

		
		
		this.engineRPM = 0;
		this.wheelRotation = 0;
		this.vehicleGear = 1;
		this.engineStress = 0;
		this.vehicleGearIndex = ["R","N","1","2","3","4","5","6","7"]
		this.gearRatios = [-12.69, 0, 12.69, 9.29, 6.75, 4.90, 3.62, 2.59, 1.90];
		this.cameras.main.startFollow(this.car);
		this.cameras.main.zoomTo(0.76);
		this.cursors = this.input.keyboard.createCursorKeys();
		
		this.gearBack = this.add.rectangle(100, config.height-110, 100, 100, 0xAAAAAA).setAlpha(0.7).setOrigin(0.5, 0.5);
		this.UIElements.push(this.gearBack);
		this.gearMarker = this.add.text(100, config.height-100, "N").setOrigin(0.5, 1).setFontSize(40).setFontFamily("Arial").setStroke("#000000", 3);
		this.UIElements.push(this.gearMarker);

		this.rpmIndicator = this.add.text(config.width-100, config.height-100, "0 RPM").setOrigin(0.5, 1).setFontSize(40).setFontFamily("Arial").setStroke("#000000", 3);
		this.UIElements.push(this.rpmIndicator);
		
		this.cameras.main.ignore(this.UIElements);
		
		this.uiCam = this.cameras.add();
		
		if(config.physics.matter.debug) {
		  this.uiCam.ignore(this.matter.world.debugGraphic);
		};
		
		this.uiCam.ignore(this.marker);
		this.uiCam.ignore(this.car);
		this.uiCam.ignore(this.cart);
		this.uiCam.ignore(this.deck);
		this.uiCam.ignore(this.roadEntity);
		
		this.keys["a"] = this.input.keyboard.addKey("a");
		this.keys["d"] = this.input.keyboard.addKey("d");
		this.keys["w"] = this.input.keyboard.addKey("w");
		this.keys["s"] = this.input.keyboard.addKey("s");
		this.keys["c"] = this.input.keyboard.addKey("c");
		this.keyC = true;
		this.keys["v"] = this.input.keyboard.addKey("v");
		this.keyV = true;
		this.keys["space"] = this.input.keyboard.addKey("space");
		this.keys["e"] = this.input.keyboard.addKey("e");
		this.keyE = true;
		this.keys["esc"] = this.input.keyboard.addKey("esc");
	}
	update() {

				
		this.add.rectangle(cartXOffset+this.cart.x, cartYOffset+this.cart.y, 20,20, 0x00FF00);
		this.rpmIndicator.setText(Math.round(this.engineRPM*10)+" RPM");
		this.matter.body.setAngle(this.deck.body, Phaser.Math.Angle.Wrap(this.car.rotation));
		if(this.keys["c"].isDown && this.keyC && this.vehicleGear > 0) {
			this.vehicleGear -= 1;
			this.gearMarker.setText(this.vehicleGearIndex[this.vehicleGear]);
			this.keyC = false;
		};
		if(this.keys["c"].isUp) {
			this.keyC = true;
		}
		if(this.keys["v"].isDown && this.keyV && this.vehicleGear < this.vehicleGearIndex.length-1) {
			this.vehicleGear += 1;
			this.gearMarker.setText(this.vehicleGearIndex[this.vehicleGear]);
			this.keyV = false;
		};
		if(this.keys["v"].isUp) {
			this.keyV = true;
		}
		
		if(this.keys["e"].isDown && this.keyE) {
			this.keyE = false;
			if(this.hitch == null) {
				var cartXOffset = Math.sin(Phaser.Math.DegToRad(this.cart.angle))*300;
				var cartYOffset = Math.cos(Phaser.Math.DegToRad(this.cart.angle))*-300;				
				if(Phaser.Math.Distance.Between(this.deck.x, this.deck.y, cartXOffset+this.cart.x, cartYOffset+this.cart.y) < 50) {
					this.hitch = this.matter.add.constraint(this.deck, this.cart, 0, 0.5, {
						pointB: {x: Math.sin(Phaser.Math.DegToRad(this.cart.angle))*300, y: Math.cos(Phaser.Math.DegToRad(this.cart.angle))*-300},
					});
				}
			} else {
				this.matter.world.remove(this.hitch);
				this.hitch = null;
			};
		}
		if(this.keys["e"].isUp) {
			this.keyE = true;
		}
		var keyed = false;
		if(this.cursors.up.isDown || this.keys["w"].isDown) {
			keyed = true;
			this.engineRPM += 1;
		};
		if((this.cursors.down.isDown || this.keys["s"].isDown) && this.car.body.speed > 0) {
			if(this.engineRPM > 0) {
				this.engineRPM -= 0.5;
			} else {
				this.engineRPM += 0.5;
			};
		};
		if(this.keys["space"].isDown && this.car.body.speed > 0) {
			if(this.engineRPM > 0) {
				this.engineRPM -= 1;
			} else {
				this.engineRPM += 1;
			};
		}
		if(Math.abs(this.engineRPM) < 1 && !keyed) {
			this.engineRPM = 0;
		}

		if(this.isBetween(this.engineRPM, 0.5, 0.7)) {
			
		}
		var speed;
		if (this.gearRatios[this.vehicleGear] != 0) {
			speed = this.engineRPM/this.gearRatios[this.vehicleGear];
		} else {
			speed = 0;
		};

		const angle = this.car.body.angle - Math.PI / 2;

		// Calculate the x and y components of the forward velocity
		// cos(angle) gives the x component, sin(angle) gives the y component
		const velocityX = Math.cos(angle) * speed;
		const velocityY = Math.sin(angle) * speed;

		// Create the velocity vector
		const forwardVelocity = { x: velocityX, y: velocityY };

		// Apply the velocity to the body
		this.matter.body.setVelocity(this.car.body, forwardVelocity);

		var backOrNo;
		if(this.engineRPM > 0) {
			backOrNo = 1;
		} else {
			backOrNo = -1;
		}
		if(this.car.body.speed >= 0.05) {
			this.matter.body.setAngle(this.car.body, (this.car.body.angle + this.wheelRotation*0.001*this.car.body.speed*backOrNo))
		}
		if((this.cursors.left.isDown || this.keys["a"].isDown) && this.wheelRotation > -4) {
			this.wheelRotation -= 0.1;
		};
		if((this.cursors.right.isDown || this.keys["d"].isDown) && this.wheelRotation < 4) {
			this.wheelRotation += 0.1;
		}

		// Restrict the cart's movement to its independent forward axis (simulate trailer)
		if (this.cart && this.cart.body) {
			const a = this.cart.body.angle; // radians
			const v = this.cart.body.velocity;
			// forward unit vector for this project's angle convention: x = sin(a), y = -cos(a)
			const fx = Math.sin(a);
			const fy = -Math.cos(a);
			const dot = v.x * fx + v.y * fy;
			const vx = fx * dot;
			const vy = fy * dot;
			this.matter.body.setVelocity(this.cart.body, { x: vx, y: vy });
		}
	}
	setCenterOfMass(body, gameObj, offset) {
		this.matter.body.setCentre( body, offset, true );

		const originX = gameObj.originX + ( offset.x / gameObj.displayWidth );
		const originY = gameObj.originY + ( offset.y / gameObj.displayHeight );
		gameObj.setOrigin( originX, originY );
	}
	isBetween(value, num1, num2) {
		// Use Math.min and Math.max to handle cases where num1 > num2.
		const min = Math.min(num1, num2);
		const max = Math.max(num1, num2);
		
		// The condition directly returns the boolean result.
		return (value >= min && value <= max);
	}
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
				y: 0,
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