var ctx;
class Main extends Phaser.Scene
{
	constructor() {
		super("Main");
	}
	create() {
		ctx = this;
		this.keys = {};
		this.UIElements = [];
		
		this.marker = this.add.rectangle(0,0,100,100,0xFF0000);
		this.marker2 =  this.add.line(0,0,0,0,0,900, 0x0000FF).setOrigin(0.5,0);
		
		this.car = this.add.rectangle(0,0,100,200,0xFFFFFF);
		this.car = this.matter.add.gameObject(this.car, {});
		this.car.setFrictionAir(0.2);
		this.setCenterOfMass(this.car.body, this.car, {x: 0, y: 75});
		this.deck = this.add.rectangle(200,0,100,80, 0x999999);
		this.deck = this.matter.add.gameObject(this.deck, {});
		this.truckConnection = this.matter.add.constraint(this.car, this.deck, 0, 0.5, {
			pointA: {x: 0, y: 65}
		});
		
		
		this.cart = this.add.rectangle(0, 250, 100, 400, 0xAAAAAA);
		this.cart = this.matter.add.gameObject(this.cart);
		this.cart.setFrictionAir(0.2);
		this.setCenterOfMass(this.cart.body, this.cart, {x: 0, y: 125});
		
		this.hitch = this.matter.add.constraint(this.car, this.cart, 0, 0.5, {
			pointA: {x: 0, y: 200},
			pointB: {x: 0, y: -300},
		});
		
		this.carAccel = 0;
		this.wheelRotation = 0;
		this.vehicleGear = 1;
		this.vehicleGearIndex = ["R","N","1","2","3"]
		this.cameras.main.startFollow(this.car);
		this.cameras.main.zoomTo(0.5);
		this.cursors = this.input.keyboard.createCursorKeys();
		
		this.gearBack = this.add.rectangle(100, config.height-110, 100, 100, 0xAAAAAA).setAlpha(0.7).setOrigin(0.5, 0.5);
		this.UIElements.push(this.gearBack);
		this.gearMarker = this.add.text(100, config.height-100, "N").setOrigin(0.5, 1).setFontSize(40).setFontFamily("Arial").setStroke("#000000", 3);
		this.UIElements.push(this.gearMarker);
		
		this.cameras.main.ignore(this.UIElements);
		
		this.uiCam = this.cameras.add();
		
		this.uiCam.ignore(this.marker);
		this.uiCam.ignore(this.car);
		this.uiCam.ignore(this.cart);
		
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
		this.keys["esc"] = this.input.keyboard.addKey("esc");
	}
	update() {
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
		var keyed = false;
		if(this.cursors.up.isDown || this.keys["w"].isDown) {
			keyed = true;
			if(this.vehicleGear == 0) {
				if(this.carAccel > -1) this.carAccel -= 0.001;
			} else if(this.vehicleGear == 1) {
				
			} else if(this.vehicleGear == 2) {
				if(this.carAccel < 0.02) this.carAccel += 0.0008;
			} else if(this.vehicleGear == 3) {
				if(this.carAccel < 0.08) this.carAccel += 0.001;
			} else if(this.vehicleGear == 4) {
				if(this.carAccel < 0.2) this.carAccel += 0.001;
			};
		};
		if((this.cursors.down.isDown || this.keys["s"].isDown) && this.car.body.speed > 0) {
			if(this.carAccel > 0) {
				this.carAccel -= 0.001;
			} else {
				this.carAccel += 0.001;
			};
		};
		if(this.keys["space"].isDown && this.car.body.speed > 0) {
			if(this.carAccel > 0) {
				this.carAccel -= 0.005;
			} else {
				this.carAccel += 0.005;
			};
		}
		if(Math.abs(this.carAccel) < 0.005 && !keyed) {
			this.carAccel = 0;
		}
		this.car.thrustLeft(this.carAccel);
		var backOrNo;
		if(this.carAccel > 0) {
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
	}
	setCenterOfMass(body, gameObj, offset) {
		this.matter.body.setCentre( body, offset, true );

		const originX = gameObj.originX + ( offset.x / gameObj.displayWidth );
		const originY = gameObj.originY + ( offset.y / gameObj.displayHeight );
		gameObj.setOrigin( originX, originY );
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