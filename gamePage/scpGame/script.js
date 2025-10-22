var Phaser;
var PhaserNavMeshPlugin;
var PhaserRaycaster;
var ctx;
var keys = {
  
}
var a;
var b;
var c;
var statusBars = {
  
};
var doors = [];
var doorBodies = [];

class Main extends Phaser.Scene {
  constructor() {
    super("Main");
  }
  preload() {
    this.load.spritesheet("player", ["https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/playerAtlas.png?v=1745099852661", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/playerAtlas_n2.image.png?v=1745100737774"], { frameWidth: 300, frameHeight: 500});
    this.load.spritesheet("playerHead", ["https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/playerHead.png?v=1745099856161", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/playerHead_n2.image.png?v=1745100633508"], {frameWidth: 300, frameHeight: 500});
    this.load.spritesheet("door", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/door.png?v=1746018369363", {frameHeight: 144, frameWidth: 426});
    this.load.image("wallStuff", ["https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/wallStuff_Padded.png?v=1747758769033", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/NormalMap_Padded_2.png?v=1745435611731"]);
    this.load.image("staminaBar", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/staminaBar.png?v=1745033092453");
    this.load.image("itemSlot", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/itemSlot.png?v=1747681657204");
    this.load.image("paperItem", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/paperImg.png?v=1747681663088");
    this.load.image("beerItem", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/beerCanItemSlot.png?v=1747253035829");
    this.load.image("beerImg", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/beerCan.png?v=1747252959122");
    this.load.image("paperImg", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/paperImage.png?v=1747233309594");
    
    this.load.image("note1", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/Note1.png?v=1747747836090");
    
    this.load.image("D-1828Docum", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/D-Class%20Form%20(1).png?v=1747663701508");
    this.load.image("D-1829Docum", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/D-Class%20Form.2.png?v=1747663717062");
    this.load.image("paperBackground", "https://cdn.glitch.global/0bcdf285-864d-4f45-9216-aad834ce9407/paperBackground.png?v=1747260041672");
    this.load.json("shapes", "./shapes.json");
    
    this.load.tilemapTiledJSON('mapData', './mapData.json');
  }
  create() {
    ctx = this;
    var shapes = this.cache.json.get('shapes');
    this.createAnims();
    
    this.UICamera = this.cameras.add();
    if(config.physics.matter.debug) {
      this.UICamera.ignore(this.matter.world.debugGraphic);
    };
    
    this.fpsCounterDOM = document.getElementById("fpsCounter");
    
    this.itemIndex = [
      {id: 0, name: "Empty", type: "noUse", data: "", dispImg: "itemSlot", droppedImg: "", state: ""},
      {id: 1, name: "D1828 Documentation", type: "docum", data: "D-1828Docum", dispImg: "paperItem", droppedImg: "paperImg", state: ""},
      {id: 2, name: "D1829 Documentation", type: "docum", data: "D-1829Docum", dispImg: "paperItem", droppedImg: "paperImg", state: ""},
      {id: 3, name: "D1830 Documentation", type: "docum", data: "", dispImg: "paperItem", droppedImg: "paperImg", state: ""},
      {id: 4, name: "D1831 Documentation", type: "docum", data: "", dispImg: "paperItem", droppedImg: "paperImg", state: ""},
      {id: 5, name: "D1832 Documentation", type: "docum", data: "", dispImg: "paperItem", droppedImg: "paperImg", state: ""},
      {id: 6, name: "D1833 Documentation", type: "docum", data: "", dispImg: "paperItem", droppedImg: "paperImg", state: ""},
      {id: 7, name: "D1834 Documentation", type: "docum", data: "", dispImg: "paperItem", droppedImg: "paperImg", state: ""},
      {id: 8, name: "D1835 Documentation", type: "docum", data: "", dispImg: "paperItem", droppedImg: "paperImg", state: ""},
      {id: 9, name: "D1836 Documentation", type: "docum", data: "", dispImg: "paperItem", droppedImg: "paperImg", state: ""},
      {id: 10, name: "Beer", type: "consumable", data: "", dispImg: "beerItem", droppedImg: "beerImg", state: ""},
      {id: 11, name: "Researcher's Note", type: "docum", data: "note1", dispImg: "paperItem", droppedImg: "paperImg", state: ""}
    ]
    
    this.player = {
      stats: {
        lateralSpeed: 0.001,
        stamina: 100,
        maxStamina: 100,
      },
      defs: {
        sprintSpeed: 0.0075,
        walkSpeed: 0.005,
        staminaDegen: 0.15,
        staminaIdleRegen: 0.065,
        staminaWalkRegen: 0.035,
        rotationSpeed: 0.15,
        headRotationSpeed: 0.23,
      },
      condition: {
        sprinting: false,
      },
      controller: {
        forward: false,
      },
      inventory: {
        maxBag: 6,
        bag: [ctx.itemIndex[0], ctx.itemIndex[0], ctx.itemIndex[0], ctx.itemIndex[0], ctx.itemIndex[0], ctx.itemIndex[0]],
        hotbar: [0,1],
      }
    };
    
    this.itemFunc = {
      checkItem: function(itemID, state) {
        var bag = ctx.player.inventory.bag;
        for(var i=0;i<bag.length;i++) {
          var item = bag[i];
          if(!state) {
            if(item.id == itemID) {
              return true;
            } else {
              return false;
            };
          } else {
            if(item.id == itemID && item.state == state) {
              return true;
            } else {
              return false;
            };
          };
        }
      },
      giveItem: function(itemID, state) {
        var bag = ctx.player.inventory.bag;
        var firstOpen = null;
        for(var i=0;i<bag.length;i++) {
          var item = bag[i];
          if(item.id == 0 && firstOpen == null) {
            firstOpen = i;
          }
        };
        if(firstOpen != null) {
          var item = ctx.itemIndex[itemID];
          item.state = state;
          bag[firstOpen] = item;
          this.updateInv();
          return;
        };
      },
      deleteItem: function(itemID, state) {
        var bag = ctx.player.inventory.bag;
        for(var i=0;i<bag.length;i++) {
          var item = bag[i];
          if(item.id == itemID && item.state == state) {
            bag[i] = ctx.itemIndex[0];
          };

        };
        this.updateInv();
      },
      updateInv: function() {
        var bag = ctx.player.inventory.bag;
        var hotBar = ctx.player.inventory.hotbar;
        var bagSlots = Object.keys(ctx.bagImgs);
        for(var i=0;i<bagSlots.length;i++) {
          var currBag = ctx.bagImgs[bagSlots[i]];
          currBag.setTexture(bag[i].dispImg);
          currBag.bagLabel.setText(bag[i].name);
        };
        var ab = [ctx.hotbarImage1,ctx.hotbarImage2];
        for(var i=0;i<ab.length;i++) {
          var hotbarItem = bag[hotBar[i]];
          ab[i].setTexture(hotbarItem.dispImg);
        }
        ctx.hotbarLabel1.setText(bag[hotBar[0]].name);
        ctx.hotbarLabel2.setText(bag[hotBar[1]].name);
      },
      checkEmptySlot: function() {
        var bag = ctx.player.inventory.bag;
        for(var i=0;i<bag.length;i++) {
          if(bag[i].id == 0) {
            return true;
          }
        }
        return false;
      },
    }
    
    this.displayDocument = function(docName) {
      if(!this.paperBackground.tweenRunning) {
        this.paperBackground.setVisible(true);
        this.paperBackground.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.paperBackground.setInteractive();
        this.paperBackground.setTexture(docName);
        this.paperBackground.rotation = (Math.random()*0.174533) - 0.0872665;
        var picHeight = this.textures.get(docName).frames.__BASE.height;
        var scale = (config.height/5*4)/(picHeight);
        this.paperBackground.floatIn.play();
        this.paperBackground.setScale(scale);
      };
    }
    
    this.itemUse = function(item) {
      if(item.type == "docum") {
        if(item.data != "") {
          this.displayDocument(item.data);
        };
      };
    }
    
    class Enemy extends Phaser.Physics.Matter.Sprite
    {
      constructor(scene, x, y) {
        super(scene.matter.world, x, y);
        this.scene = scene;
        this.setTexture("player");
        this.setBody(shapes.player);
        this.setFrictionAir(0.2);
        this.setDepth(2);
        this.setDisplaySize(25, 40);
        this.idleTime = 0;
        this.idle = true;
        this.freeWander = true;
        this.wandering = true;
        this.giveUpTime = Math.floor(Math.random()*5000)+5000;
        scene.UICamera.ignore(this);
        scene.events.on('update', (time, delta) => { this.update(time, delta, scene)} );
        scene.add.existing(this);
        this.body.maxSpeed = Math.random()*1 + 0.5;
        this.anims.play("PlayerBodyIdle", true);
      }
      update(time, delta) {
        if(this.wandering && this.freeWander) {
          this.wanderGoal = this.scene.navMesh.navMesh.navPolygons[Math.floor(Math.random()*this.scene.navMesh.navMesh.navPolygons.length)].centroid;
          this.points = this.scene.navMesh.findPath(this.body.position, this.wanderGoal);
          /*this.navMesh.debugDrawClear();
          this.navMesh.debugDrawPath(this.points, 0xffd900);*/
          this.freeWander = false;
        }
        if(this.wandering) {
          this.points = this.scene.navMesh.findPath(this.body.position, this.wanderGoal);
          /*this.navMesh.debugDrawClear();
          this.navMesh.debugDrawPath(this.points, 0xffd900);*/
          var r = false;;
          if(this.points != null) {
            r = this.scene.matter.query.ray(doorBodies, this.body.position, this.points[1], 1).length == 0;
          }
          if(this.idleTime < time) {
            var idleAddition = Math.floor(Math.random()*16000+4000);
            this.idle = !this.idle;
            if(this.idle) {
              this.setTint(0xAAFFAA);
              idleAddition = idleAddition / 2;
              this.anims.play("PlayerBodyIdle", true);
            } else {
              this.setTint(0xFFFFFF);
            }
            this.idleTime = (time+idleAddition);
          };
          if(Phaser.Math.Distance.BetweenPoints(this.body.position, this.wanderGoal) > 50 && r) {
            this.scene.rotateBodyToPoint(this.body, {x: this.points[1].x, y: this.points[1].y}, this);
            if(!this.idle) {
              this.thrust(0.0004*this.body.maxSpeed);
              this.anims.play("PlayerBodyWalk", true);
            };
          } else {
            this.freeWander = true;
          }
        }
        this.pointsToPlayer = this.scene.navMesh.findPath(this.body.position, this.scene.player.body.body.position);
        if(this.pointsToPlayer == null) {
          this.pointsToPlayer = [];
          if(this.followingPlayer) {
            this.followingPlayer = false;
            this.setTint(0xFFFFFF);
            this.wandering = true;
            this.freeWander = true;
          };
        };
        var canBeSeen = (this.pointsToPlayer.length == 2 && Phaser.Math.Distance.BetweenPoints(this.body.position, this.scene.player.body.body.position) < 400 && this.scene.matter.query.ray(doorBodies, this.body.position, this.scene.player.body.body.position, 1).length == 0);
        if(canBeSeen) {
          this.followingPlayer = true;
          this.setTint(0xFFAAAA);
          this.wandering = false;
          this.lastTimeViewed = time;
        };
        if((this.pointsToPlayer.length > 4 || time - this.lastTimeViewed > this.giveUpTime) && this.followingPlayer && !canBeSeen) {
          this.followingPlayer = false;
          this.setTint(0xFFFFFF);
          this.wandering = true;
          this.freeWander = true;
        }
        if(this.pointsToPlayer.length > 1 && this.followingPlayer) {
          this.scene.rotateBodyToPoint(this.body, {x: this.pointsToPlayer[1].x, y: this.pointsToPlayer[1].y}, this);
          this.thrust(0.0006);
          this.anims.play("PlayerBodyWalk", true);
        }
        
        //ctx.limitMaxSpeed(this.body, 0);
      }
    }
    
    this.createEnemy = function(x, y) {
      var bar = new Enemy(this, x, y);
    }
    
    var zoomScale = 1.5;
    this.cameras.main.setZoom(zoomScale);
    
    this.player.body = this.matter.add.sprite(400, 150, "player", null, {shape: shapes.player}).setDisplaySize(50,80).setDepth(1);
    this.player.body.anims.play("PlayerBodyIdle", true);
    this.UICamera.ignore(this.player.body);
    this.player.head = this.matter.add.sprite(0, 0, "playerHead", null).setDisplaySize(50,80).setCollidesWith(0).setDepth(2);
    this.player.head.anims.play("PlayerHeadIdle", true);
    this.UICamera.ignore(this.player.head);
    
    this.player.body.body.maxSpeed = 10;
    this.cameras.main.startFollow(this.player.body);
    
    this.map = this.make.tilemap({ key: "mapData"});

    const tileset1 = this.map.addTilesetImage("wallStuff", "wallStuff");
    
    this.floorLayer = this.map.createLayer("Floor", tileset1, 0, 0);
    this.floorLayer.depth = -4;
    this.UICamera.ignore(this.floorLayer);

    this.mainLayer = this.map.createLayer("Walls", tileset1, 0, 0);
    this.mainLayer.depth = -1;
    this.mainLayer.setCollisionByProperty({ collides: true });
    this.UICamera.ignore(this.mainLayer);
    
    this.extraLayer = this.map.createLayer("Extras", tileset1, 0, 0);
    this.extraLayer.depth = -3;
    this.extraLayer.setCollisionByProperty({ collides: true });
    this.UICamera.ignore(this.extraLayer);
    
    this.extraLayer2 = this.map.createLayer("Extras Top", tileset1, 0, 0);
    this.extraLayer2.depth = -2;
    this.extraLayer2.setCollisionByProperty({ collides: true });
    this.UICamera.ignore(this.extraLayer2);
    
    this.lightObjects = this.map.getObjectLayer("Lights").objects;
    
    for(var i=0;i<this.lightObjects.length;i++) {
      var light = this.lightObjects[i];
      var intensity = 0.5;
      var radius = 500;
      if(light.properties) {
        intensity = light.properties[0].value;
        radius = light.properties[1].value;
      }
      this.lights.addLight(light.x, light.y, radius, 0xFFFFFF, intensity);
    };
    
    this.lights.enable();
    this.lights.setAmbientColor(0x555555);
    //this.player.playerLight = this.lights.addLight(0,0, 100000, 0xFFFFFF, 1.2);
    
    

    //draw rays
    this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xffffff, alpha: 0.8 } }).setDepth(20);
    this.UICamera.ignore(this.graphics);
    
    this.mainLayer.setPipeline("Light2D");
    this.extraLayer.setPipeline("Light2D");
    this.extraLayer2.setPipeline("Light2D");
    this.floorLayer.setPipeline("Light2D");
    this.player.body.setPipeline("Light2D");
    this.player.head.setPipeline("Light2D");
    
    this.matter.world.convertTilemapLayer(this.mainLayer);
    this.matter.world.convertTilemapLayer(this.extraLayer);
    
    this.sectors = this.map.createFromObjects(
      'Sectors',
      {key: "door"}
    );
    this.sectors.forEach(obj => {
      obj.setVisible(false);
      this.events.on('update', (time, delta) => {
        if(obj.getBounds().contains(this.player.body.body.position.x, this.player.body.body.position.y)) {
          this.player.currentSector = obj.name;
          this.sectorLabel.setText("Location: "+obj.name);
        };
      });
    });
    
    this.droppedItems = [];
    
    this.droppedItemLayer = this.map.getObjectLayer("Pickupables").objects;
    for(var i=0;i<this.droppedItemLayer.length;i++) {
      var item = this.droppedItemLayer[i];
      var a = this.matter.add.image(item.x, item.y, this.itemIndex[item.properties[0].value].droppedImg);
      a.setScale(0.45);
      a.rotation = Math.random()*360;
      a.setStatic(true);
      a.setCollidesWith(null);
      a.itemID = item.properties[0].value;
      a.setPipeline("Light2D");
      this.UICamera.ignore(a);
      this.droppedItems.push(a);
    };
    
    
    this.sectorLabelBackground = this.add.rectangle(0, 0, 500, 45, 0x000000).setScrollFactor(0).setDepth(9).setOrigin(0,0).setAlpha(0.5);
    this.sectorLabel = this.add.text(20, 10, "Text", {fontFamily: 'Arial', fontSize: '24px', fontStyle: ''}).setScrollFactor(0).setDepth(10);
    this.cameras.main.ignore(this.sectorLabel);
    
    this.navMesh = this.navMeshPlugin.buildMeshFromTiled("mesh", this.map.getObjectLayer("navmesh"), 64);
    this.navMesh.enableDebug();
    
    this.spawnLayer = this.map.getObjectLayer("SCP Spawn").objects;
    
    for(var i=0;i<this.spawnLayer.length;i++) {
      
      this.createEnemy(this.spawnLayer[i].x, this.spawnLayer[i].y);
    };
    
    this.doorLayer = this.map.getObjectLayer("Doors").objects;
    for(var i=0;i<this.doorLayer.length;i++) {
      var doorP = this.doorLayer[i];
      var door = this.add.sprite(doorP.x+52, doorP.y-1, "door", 0);
      door.setDisplaySize(104, 35);
      door.doorFrame = this.add.rectangle(doorP.x, doorP.y-8, 104, 5, 0x000000).setOrigin(0,0);
      door.doorFrame.setDepth(3);
      this.UICamera.ignore(door.doorFrame);
      
      door.doorIndicator = this.lights.addPointLight(doorP.x, doorP.y, 0xFF2929, 20, 1, 0.05).setDepth(3);
      this.UICamera.ignore(door.doorIndicator);
      
      door = this.matter.add.gameObject(door).setInteractive();
      door.setBody({
        type: "rectangle",
        width: 128,
        height: 16,
        isStatic: true,
      });
      door.setStatic(true);
      door.body.position.y += 11;
      door.body.positionPrev.y += 11;
      door.body.collisionFilter.mask = 255;
      door.open = false;
      door.toggleCD = 0;
      door.lit = false;
      this.UICamera.ignore(door);
      door.setPipeline("Light2D");
      doors.push(door);
      doorBodies.push(door.body);
    }
    
    this.matter.world.disableGravity();
    
    this.playerAngle = 0;
    this.mouseAngle = 0;
    
    this.input.on("pointermove", function(e) {
      this.mouseAngle = Phaser.Math.Angle.Between(this.player.body.body.position.x, this.player.body.body.position.y, e.worldX, e.worldY);
    }, this);
    this.input.on("pointerdown", function(e) {
      console.log({x: e.worldX, y: e.worldY});
      this.pointerDown = true;
      //this.player.controller.forward = true;
    }, this);
    this.input.on("pointerup", function(e) {
      this.pointerDown = false;
      this.player.controller.forward = false;
    }, this);
    
    
    
    //this.matter.world.setGravity(0);
    
    this.cursors = this.input.keyboard.createCursorKeys();
    
    keys.a = this.input.keyboard.addKey("a");
    keys.d = this.input.keyboard.addKey("d");
    keys.w = this.input.keyboard.addKey("w");
    keys.s = this.input.keyboard.addKey("s");
    keys.e = this.input.keyboard.addKey("e");
      keys.eReady = true;
    keys.q = this.input.keyboard.addKey("q");
    keys.one = this.input.keyboard.addKey("one");
      keys.oneReady = true;
    keys.two = this.input.keyboard.addKey("two");
      keys.twoReady = true;
    keys.tab = this.input.keyboard.addKey("tab");
    
    //add status Bars
    
    this.createStatusBar(20,config.height-60,400, 15, "staminaBar", 0x000000,"this.player.stats.stamina","this.player.stats.maxStamina", "staminaBar");
    
    this.hotbarBackground2 = this.add.rectangle(0, 0, 168.75, 81.25, 0xAAAAAA).setAlpha(0.5).setScrollFactor(0).setDepth(10).setOrigin(0, 0.5);
    this.hotbarBackground = this.add.rectangle(3.125, 0, 162.5, 75, 0x555555).setAlpha(0.5).setScrollFactor(0).setDepth(10).setOrigin(0, 0.5);

    this.hotbar1 = false;
    this.hotbar2 = false;
    this.hotbarImage1 = this.add.image(3.125,0, "itemSlot").setDisplaySize(75, 75).setScrollFactor(0).setDepth(10).setOrigin(0, 0.5).setInteractive();
    this.hotbarImage1.on("pointerdown", function() {
      this.hotbar1 = true;
    },this);
    
    this.hotbarLabel1 = this.add.text(6.125,-43.75, "Document", {wordWrap: {width: 75, useAdvancedWrap: true},fontFamily: 'Arial', fontSize: '15px', fontStyle: '', stroke: '#000000', strokeThickness: 2}).setScrollFactor(0).setDepth(10).setOrigin(0,1);
    
    this.hotbarImage2 = this.add.image(90.625,0, "itemSlot").setDisplaySize(75, 75).setScrollFactor(0).setDepth(10).setOrigin(0, 0.5).setInteractive();
    this.hotbarImage2.on("pointerdown", function() {
      this.hotbar2 = true;
    }, this);
    
    this.hotbarLabel2 = this.add.text(93.75,-43.75, "Document", {wordWrap: {width: 75, useAdvancedWrap: true},fontFamily: 'Arial', fontSize: '15px', fontStyle: '', stroke: '#000000', strokeThickness: 2}).setScrollFactor(0).setDepth(10).setOrigin(0,1);
    
    this.hotbar = this.add.container(37.5,config.height-130, [this.hotbarBackground, this.hotbarBackground2, this.hotbarImage1, this.hotbarLabel1, this.hotbarImage2, this.hotbarLabel2]);
    var hotbarScale = window.innerHeight*0.23834745762711865;
    this.hotbar.setScale(hotbarScale/168.75);
    
    
    this.cameras.main.ignore(this.hotbar);
    
    this.bagBackground = this.add.rectangle(0,0,755, 130, 0x444444).setAlpha(0.4).setOrigin(0,0);
    
    this.bagImgs = {
    }
    
    this.bagImgs["1"] = this.add.image(5,5,"paperItem").setDisplaySize(120,120).setOrigin(0,0);
    this.bagImgs["1"].bagIndex = 0;
    this.bagImgs["1"].bagLabel = this.add.text(10, 120, "Empty", {wordWrap: {width: 115, useAdvancedWrap: true}, fontFamily: 'Arial', fontSize: '15px', fontStyle: '', stroke: '#000000', strokeThickness: 3}).setOrigin(0,1);
    this.bagImgs["1"].on("pointerdown", function() {
      if(ctx.bag.selected) {
        ctx.bag.selected.setTint(0xFFFFFF);
      };
      if(ctx.bag.selected == this) {
        this.setTint(0xFFFFFF);
        ctx.bag.selected = null;
      } else {
        this.setTint(0xFFAAAA);
        ctx.bag.selected = this;
      };  
    });
    this.bagImgs["2"] = this.add.image(130,5,"itemSlot").setDisplaySize(120,120).setOrigin(0,0);
    this.bagImgs["2"].bagIndex = 1;
    this.bagImgs["2"].bagLabel = this.add.text(135, 120, "Empty", {wordWrap: {width: 115, useAdvancedWrap: true}, fontFamily: 'Arial', fontSize: '14px', fontStyle: '', stroke: '#000000', strokeThickness: 3}).setOrigin(0,1);
    this.bagImgs["2"].on("pointerdown", function() {
      if(ctx.bag.selected) {
        ctx.bag.selected.setTint(0xFFFFFF);
      };
      if(ctx.bag.selected == this) {
        this.setTint(0xFFFFFF);
        ctx.bag.selected = null;
      } else {
        this.setTint(0xFFAAAA);
        ctx.bag.selected = this;
      };  
    });
    this.bagImgs["3"] = this.add.image(255,5,"itemSlot").setDisplaySize(120,120).setOrigin(0,0);
    this.bagImgs["3"].bagIndex = 2;
    this.bagImgs["3"].bagLabel = this.add.text(260, 120, "Empty", {wordWrap: {width: 115, useAdvancedWrap: true}, fontFamily: 'Arial', fontSize: '14px', fontStyle: '', stroke: '#000000', strokeThickness: 3}).setOrigin(0,1);
    this.bagImgs["3"].on("pointerdown", function() {
      if(ctx.bag.selected) {
        ctx.bag.selected.setTint(0xFFFFFF);
      };
      if(ctx.bag.selected == this) {
        this.setTint(0xFFFFFF);
        ctx.bag.selected = null;
      } else {
        this.setTint(0xFFAAAA);
        ctx.bag.selected = this;
      };  
    });
    this.bagImgs["4"] = this.add.image(380,5,"itemSlot").setDisplaySize(120,120).setOrigin(0,0);
    this.bagImgs["4"].bagIndex = 3;
    this.bagImgs["4"].bagLabel = this.add.text(385, 120, "Empty", {wordWrap: {width: 115, useAdvancedWrap: true}, fontFamily: 'Arial', fontSize: '14px', fontStyle: '', stroke: '#000000', strokeThickness: 3}).setOrigin(0,1);
    this.bagImgs["4"].on("pointerdown", function() {
      if(ctx.bag.selected) {
        ctx.bag.selected.setTint(0xFFFFFF);
      };
      if(ctx.bag.selected == this) {
        this.setTint(0xFFFFFF);
        ctx.bag.selected = null;
      } else {
        this.setTint(0xFFAAAA);
        ctx.bag.selected = this;
      };  
    });
    this.bagImgs["5"] = this.add.image(505,5,"itemSlot").setDisplaySize(120,120).setOrigin(0,0);
    this.bagImgs["5"].bagIndex = 4;
    this.bagImgs["5"].bagLabel = this.add.text(510, 120, "Empty", {wordWrap: {width: 115, useAdvancedWrap: true}, fontFamily: 'Arial', fontSize: '14px', fontStyle: '', stroke: '#000000', strokeThickness: 3}).setOrigin(0,1);
    this.bagImgs["5"].on("pointerdown", function() {
      if(ctx.bag.selected) {
        ctx.bag.selected.setTint(0xFFFFFF);
      };
      if(ctx.bag.selected == this) {
        this.setTint(0xFFFFFF);
        ctx.bag.selected = null;
      } else {
        this.setTint(0xFFAAAA);
        ctx.bag.selected = this;
      };  
    });
    this.bagImgs["6"] = this.add.image(630,5,"itemSlot").setDisplaySize(120,120).setOrigin(0,0);
    this.bagImgs["6"].bagIndex = 5;
    this.bagImgs["6"].bagLabel = this.add.text(635, 120, "Empty", {wordWrap: {width: 115, useAdvancedWrap: true}, fontFamily: 'Arial', fontSize: '14px', fontStyle: '', stroke: '#000000', strokeThickness: 3}).setOrigin(0,1);
    this.bagImgs["6"].on("pointerdown", function() {
      if(ctx.bag.selected) {
        ctx.bag.selected.setTint(0xFFFFFF);
      };
      if(ctx.bag.selected == this) {
        this.setTint(0xFFFFFF);
        ctx.bag.selected = null;
      } else {
        this.setTint(0xFFAAAA);
        ctx.bag.selected = this;
      };  
    });
    
    
    
    this.invCD = 0;
    this.bag = this.add.container((config.width-755)/2, 100, [this.bagBackground, this.bagImgs["1"], this.bagImgs["1"].bagLabel, this.bagImgs["2"], this.bagImgs["2"].bagLabel, this.bagImgs["3"], this.bagImgs["3"].bagLabel, this.bagImgs["4"], this.bagImgs["4"].bagLabel, this.bagImgs["5"], this.bagImgs["5"].bagLabel, this.bagImgs["6"], this.bagImgs["6"].bagLabel]);
    this.bag.iterate((child) => {
      child.setInteractive();
    });
    this.bag.avail = true;
    
    this.bag.toggleAvail = function() {
      if(ctx.bag.selected) {
        ctx.bag.selected.setTint(0xFFFFFF);
      };
      ctx.bag.selected = null;
      if(this.avail) {
        this.iterate((child) => {
          child.disableInteractive();
        });
        this.setVisible(false);
        this.avail = false;
      } else {
        this.iterate((child) => {
          child.setInteractive();
        });
        this.setVisible(true);
        this.avail = true;
      }
    };
    this.bag.toggleAvail();
    
    this.cameras.main.ignore(this.bag);
    this.paperBackground = this.add.image(config.width/2,-config.height,"paperBackground").setScrollFactor(0).setOrigin(0.5,0.5).setVisible(false);
    this.paperBackground.on("pointerdown", function() {
      if(!this.tweenRunning) {
        this.floatOut.play();
        this.disableInteractive();
      };
    });
    this.cameras.main.ignore(this.paperBackground);
    
    this.paperBackground.floatIn = this.tweens.add({
      targets: this.paperBackground,
      paused: true,
      y: config.height/2,
      ease: 'Quad.easeOut',
      duration: 650,
      repeat: 0,
      persist: true,
      onComplete: function() {
        ctx.paperBackground.tweenRunning = false;
      },
      onStart: function() {
        ctx.paperBackground.tweenRunning = true;
      },
    });
    this.paperBackground.floatOut = this.tweens.add({
      targets: this.paperBackground,
      paused: true,
      y: function() {
        return -ctx.paperBackground.height;
      },
      ease: 'Quad.easeIn',
      duration: 650,
      repeat: 0,
      persist: true,
      onComplete: function() {
        ctx.paperBackground.tweenRunning = false;
      },
      onStart: function() {
        ctx.paperBackground.tweenRunning = true;
      },
    });
    
    this.itemFunc.updateInv();
  }
  update() {
    this.fpsCounterDOM.innerHTML = "FPS: "+Math.floor(this.game.loop.actualFps*10)/10;
    this.limitMaxSpeed(this.player.body.body);
    this.updateBars();
    if(keys.tab.isDown && this.invCD <= 0) {
      this.bag.toggleAvail();
      this.invCD = 20;
      if(this.paperBackground.y > -this.paperBackground.height) {
        this.paperBackground.floatIn.stop();
        this.paperBackground.floatOut.restart();
      }
    }
    if(this.invCD > 0) {
      this.invCD -= 1;
    };
    if((keys.one.isDown || this.hotbar1) && keys.oneReady) {
      keys.oneReady = false;
      this.hotbar1 = false;
      if(this.bag.avail) {
        if(this.bag.selected) {
          this.player.inventory.hotbar[0] = this.bag.selected.bagIndex;
          this.itemFunc.updateInv();
        }
      } else {
        item = this.player.inventory.bag[this.player.inventory.hotbar[0]];
        this.itemUse(item);
      };
    };
    
    if((keys.two.isDown || this.hotbar2) && keys.twoReady) {
      keys.twoReady = false;
      this.hotbar2 = false;
      if(this.bag.avail) {
        if(this.bag.selected) {
          this.player.inventory.hotbar[1] = this.bag.selected.bagIndex;
          this.itemFunc.updateInv();
        }
      } else {
        item = this.player.inventory.bag[this.player.inventory.hotbar[1]];
        this.itemUse(item);
      };
    };
    
    if(!keys.e.isDown) {
      keys.eReady = true;
    }
    if(!keys.one.isDown) {
      keys.oneReady = true;
    }
    if(!keys.two.isDown) {
      keys.twoReady = true;
    }
    
    if(keys.q.isDown) {
      if(this.bag.avail) {
        if(this.bag.selected) {
          var itemID = this.player.inventory.bag[this.bag.selected.bagIndex].id;
          if(itemID != 0) {
            var itemID = this.player.inventory.bag[this.bag.selected.bagIndex].id;
            var a = this.matter.add.image(this.player.body.body.position.x, this.player.body.body.position.y, this.itemIndex[itemID].droppedImg);
            a.setScale(0.45);
            a.rotation = Math.random()*360;
            a.setStatic(true);
            a.setCollidesWith(null);
            a.itemID = itemID;
            a.setPipeline("Light2D");
            this.UICamera.ignore(a);
            this.droppedItems.push(a);
            this.player.inventory.bag[this.bag.selected.bagIndex] = this.itemIndex[0];
            this.itemFunc.updateInv();
          };
        };
      };
    };
    this.nearDoors = [];
    for(var i=0;i<doors.length;i++) {
      var door = doors[i];
      var doorPos = {
        x: door.body.position.x,
        y: door.body.position.y-10,
      }
      var dist = Phaser.Math.Distance.BetweenPoints(doorPos, this.player.body.body.position);
      if(door.toggleCD > 0) {
        door.toggleCD -= 1;
      };
      if(dist < 100 && dist > 30) {
        this.nearDoors.push({door: door, dist: dist});
        if(!door.lit) {
          door.doorIndicator.color.r = 50;
          door.doorIndicator.color.g = 255;
          door.doorIndicator.color.b = 50;
          door.lit = true;
        };
      } else {
        if(door.lit) {
          door.doorIndicator.color.r = 255;
          door.doorIndicator.color.g = 50;
          door.doorIndicator.color.b = 50;
          door.lit = false;
        };
      };
    }
    
    this.nearItems = [];
    for(var i=0;i<this.droppedItems.length;i++) {
      var item = this.droppedItems[i];
      item.setTint(0xFFFFFF);
      var itemPos = {
        x: item.body.position.x,
        y: item.body.position.y-10,
      }
      var dist = Phaser.Math.Distance.BetweenPoints(itemPos, this.player.body.body.position);
      if(dist < 75) {
        this.nearItems.push({item: item, dist: dist, droppedID: i});
      };
    };
    if(this.nearItems.length >= 1) {
      var pickupItem = this.nearItems[0];
      pickupItem.item.setTint(0xAAAAAA);
      if(keys.e.isDown && keys.eReady) {
        if(this.itemFunc.checkEmptySlot()) {
          this.itemFunc.giveItem(pickupItem.item.itemID, "Good");
          pickupItem.item.destroy();
          this.nearItems.splice(0,1);
          this.droppedItems.splice(pickupItem.droppedID, 1);
        };
        keys.eReady = false;
      };
    };
    
    if(this.nearDoors.length == 1) {
      var door = this.nearDoors[0];
      if(keys.e.isDown) {
        if(door.door.toggleCD <= 0) {
          if(!door.door.open) {
            door.door.setCollidesWith(null);
            doorBodies.splice(doorBodies.indexOf(door.door.body), 1);
            door.door.anims.play("doorOpen");
            door.door.toggleCD = 25;
            door.door.open = true;
          } else if (door.door.open){
            door.door.setCollidesWith(255);
            if(doorBodies.indexOf(door.door.body) == -1) {
              doorBodies.push(door.door.body);
            }
            door.door.anims.play("doorClose");
            door.door.toggleCD = 25;
            door.door.open = false;
          };
        };
      }
    }
    
    this.player.head.setPosition(this.player.body.body.position.x,this.player.body.body.position.y);
    //this.player.playerLight.setPosition(this.player.body.body.position.x,this.player.body.body.position.y);
    
    var noMove = true;
    if(this.cursors.shift.isDown && this.player.stats.stamina > 0) {
      this.player.stats.lateralSpeed = this.player.defs.sprintSpeed;
      this.player.condition.sprinting = true;
      this.player.body.anims.msPerFrame = 75;
    } else {
      this.player.stats.lateralSpeed = this.player.defs.walkSpeed;
      this.player.condition.sprinting = false;
      this.player.body.anims.msPerFrame = 100;
    }
     // this.player.body.anims.play("PlayerBodyWalk", true);
    
    if(keys.a.isDown) {
      this.player.body.thrustLeft(this.player.stats.lateralSpeed/4*3);
      this.player.condition.left = true;
      noMove = false;
    } else {
      this.player.condition.left = false;
    };
    if(keys.d.isDown) {
      this.player.body.thrustRight(this.player.stats.lateralSpeed/4*3);
      this.player.condition.right = true;
      noMove = false;
    } else {
      this.player.condition.right = false;
    };
    if(keys.w.isDown || this.player.controller.forward) {
      this.player.body.thrust(this.player.stats.lateralSpeed);
      this.player.condition.forward = true;
      noMove = false;
    } else {
      this.player.condition.forward = false;
    };
    if(keys.s.isDown) {
      this.player.body.thrustBack(this.player.stats.lateralSpeed);
      this.player.condition.backward = true;
      noMove = false;
    } else {
      this.player.condition.backward = false;
    };
    if(this.player.condition.forward || this.player.condition.backward) {
      this.player.body.anims.play("PlayerBodyWalk", true);
      this.player.head.anims.play("PlayerHeadWalk", true);
    } else {
      if(!this.player.body.anims.isPlaying && this.player.body.anims.currentAnim.key == "PlayerBodyWalk") {
        this.player.body.anims.play("PlayerBodyIdle", true);
        this.player.head.anims.play("PlayerHeadIdle", true);
      } else if(this.player.body.anims.currentAnim.key == "PlayerBodyWalk") {
        this.player.body.anims.msPerFrame = 25;
        if(this.player.body.anims.currentFrame.index == 7 || this.player.body.anims.currentFrame.index == 1) {
          this.player.body.anims.stop();
        };
      };
    }
    if(noMove) {
      this.player.body.setFrictionAir(1);
    } else {
      this.player.body.setFrictionAir(0.4);
    }
    
    if(noMove) {
      if(this.player.stats.stamina < this.player.stats.maxStamina) {
        this.player.stats.stamina += this.player.defs.staminaIdleRegen;
      } else {
        this.player.stats.stamina = this.player.stats.maxStamina;
      };
    } else if(this.player.condition.sprinting) {
      this.player.stats.stamina -= this.player.defs.staminaDegen;
    } else {
      if(this.player.stats.stamina < this.player.stats.maxStamina) {
        this.player.stats.stamina += this.player.defs.staminaWalkRegen;
      } else {
        this.player.stats.stamina = this.player.stats.maxStamina;
      };
    };
    
    if((this.pointerDown || !noMove) && (this.player.condition.forward || this.player.condition.backward)) {
      this.rotateBodyToMouse(this.player.body, 0)
    } else {
      this.player.body.setAngularVelocity(0);
    };
    this.rotateBodyToMouse(this.player.head, 1);
  }
  
  
  
  
  
  
  limitMaxSpeed(body) {
    var Body = this.matter.body;
    let maxSpeed = body.maxSpeed;
    
    if (body.velocity.x > maxSpeed) {
        Body.setVelocity(body, { x: maxSpeed, y: body.velocity.y });
    }

    if (body.velocity.x < -maxSpeed) {
        Body.setVelocity(body, { x: -maxSpeed, y: body.velocity.y });
    }

    if (body.velocity.y > maxSpeed) {
        Body.setVelocity(body, { x: body.velocity.x, y: maxSpeed });
    }

    if (body.velocity.y < -maxSpeed) {
        Body.setVelocity(body, { x: -body.velocity.x, y: -maxSpeed });
    }
  };
  createAnims() {
     this.anims.create({
      key: 'PlayerBodyIdle',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
     this.anims.create({
      key: 'PlayerHeadIdle',
      frames: this.anims.generateFrameNumbers('playerHead', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
    
    
     this.anims.create({
      key: 'PlayerBodyWalk',
      frames: this.anims.generateFrameNumbers('player', { frames: [0,1,2,3,2,1,0,4,5,6,5,4] }),
      frameRate: 10,
      repeat: -1
    });
     this.anims.create({
      key: 'PlayerHeadWalk',
      frames: this.anims.generateFrameNumbers('playerHead', { frames: [0,1,2,3,2,1,0,4,5,6,5,4] }),
      frameRate: 10,
      repeat: -1
    });
     this.anims.create({
        key: "doorOpen",
        frames: this.anims.generateFrameNumbers('door', {start: 0, end: 8}),
        frameRate: 20,
    });
     this.anims.create({
        key: "doorClose",
        frames: this.anims.generateFrameNumbers('door', {frames: [8,7,6,5,4,3,2,1,0]}),
        frameRate: 20,
    });
  }
  rotateBodyToMouse(body, id) {
    this.playerAngle = Phaser.Math.Angle.Wrap(this.mouseAngle - body.rotation);
    this.mouseAngle = Phaser.Math.Angle.Wrap(this.mouseAngle);
    body.rotation = Phaser.Math.Angle.Wrap(body.rotation);
    if (Phaser.Math.Fuzzy.Equal(this.playerAngle, body.rotation, 0.0001)) {
      body.rotation = this.playerAngle;
      body.setAngularVelocity(0);
    } else {
      if(id == 1) {
        body.setAngularVelocity(Math.sin(this.playerAngle) * this.player.defs.headRotationSpeed);
      } else {
        body.setAngularVelocity(Math.sin(this.playerAngle) * this.player.defs.rotationSpeed);
      };
    }
  };
  rotateBodyToPoint(body, point, body2) {
    var bodyAngle = Math.atan2(point.y - body.position.y, point.x - body.position.x);
    bodyAngle = Phaser.Math.Angle.Wrap(bodyAngle - body2.rotation);
    var basisAngle = Phaser.Math.Angle.Wrap(bodyAngle);
    body.rotation = Phaser.Math.Angle.Wrap(body2.rotation);
    if (Phaser.Math.Fuzzy.Equal(basisAngle, body2.rotation, 0.0001)) {
      body.rotation = basisAngle;
      if(body2) {
        body2.setAngularVelocity(0)
      } else {
        body.setAngularVelocity(0);
      };
    } else if(body2) {
      body2.setAngularVelocity(Math.sin(basisAngle) * 0.1);
    } else {
      body.setAngularVelocity(Math.sin(basisAngle) * 0.1);
    };
  }
  createStatusBar(x, y, width, height, color, backColor, val, maxVal, id) {
    statusBars[id] = {};
    var currBar = statusBars[id];
    currBar.back = this.add.rectangle(x, y, width+5, height+5, backColor).setScrollFactor(0).setOrigin(0,0).setDepth(2);
    if(typeof(color) === "string") {
      currBar.bar = this.add.image(x+2.5, y+2.5, color).setScrollFactor(0).setOrigin(0,0).setDepth(4).setDisplaySize(width, height);
      currBar.coverBar = this.add.rectangle(x+2.5+width, y+2.5, width, height, backColor).setScrollFactor(0).setOrigin(1,0).setDepth(5);
      this.cameras.main.ignore(currBar.coverBar);
      currBar.width = width;
      currBar.height = height;
      currBar.image = true;
    } else {
      currBar.bar = this.add.rectangle(x+2.5, y+2.5, width, height, color).setScrollFactor(0).setOrigin(0,0).setDepth(4);
      currBar.image = false;
    };
    this.cameras.main.ignore(currBar.bar);
    this.cameras.main.ignore(currBar.back);
    currBar.val = val;
    currBar.maxVal = maxVal;
    currBar.id = id;
  };
  updateBars() {
    var jj = Object.keys(statusBars);
    for(var i=0;i<jj.length;i++) {
      var currBar = statusBars[jj[i]];
      if(!currBar.image) {
        currBar.bar.setScale(eval(currBar.val)/eval(currBar.maxVal), 1);
      } else {
        currBar.coverBar.setScale(1 - eval(currBar.val)/eval(currBar.maxVal), 1);
      }
    }
  };
};
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
            debug: false
        },
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