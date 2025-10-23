var startLevel = "Level1";

var socket = null;

const scaling = 2.3;

const levels = {
  'level1': {name: "Level 1"},
  'level2': {name: "Level 2"},
  'level3': {name: "Level 3"},
  'level4': {name: "Level 4"},
  'level5': {name: "Level 5"},
  'level6': {name: "Level 6"},
  'level7': {name: "Level 7"},
}

const hatIndex = ["defHat", "topHat", "hardHat", "baseballHat", "policeHat", "safariHat"];
var cHatIndex = 0;

const gameState = {
  jumping: false,
  deaths: 0,
  platforms: null,
  finalPlat: null,
  horizSpeed: 300,
  velX: 0,
  menuScene: null,
  dash: false,
  dashImg: null,
  jumpMulti: 1,
  touchingJump: false,
  playerSpawn: {x: 0, y: 0},
  checkSpawn: {x: 0, y: 0, active: false},
  normalTouch: false,
  secret111: false,
  currLevel: "level1",
  jumpable: true,
  nextLevel: null,
  mobileChecked: false,
  followingEnemies: {
    active: false,
    x: 0,
    y: 0,
  },
  hatI: 'defHat',
};

const imgVars = {};

let keys = {};

var touching = false;

var yourRoom = null;

var userName = null;

var sceneControllerExternal;

class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }
  preload() {
    imgVars.logo = this.load.spritesheet('logo', 'https://cdn.glitch.global/d330f292-4635-4d3c-a075-245caf1e456b/weirdTacoSpriteSheet.png?v=1715193893256', { frameWidth: 144, frameHeight: 180});
    imgVars.tortila = this.load.spritesheet('tortila', 'https://cdn.glitch.global/d330f292-4635-4d3c-a075-245caf1e456b/evilTortilla.png?v=1715190132163', {frameWidth: 115, frameHeight: 115});
    imgVars.hats = this.load.spritesheet('hats', 'https://cdn.glitch.global/da457fbd-19c6-422a-863f-6fe780ba1e42/htas.png?v=1738254821048', {frameWidth: 43, frameHeight: 30})
    imgVars.white = this.load.image('white', 'https://labs.phaser.io/assets/particles/white.png');
    imgVars.jump = this.load.image('jump', 'https://cdn.glitch.global/d330f292-4635-4d3c-a075-245caf1e456b/jump.png?v=1715281936309');
    imgVars.left = this.load.image('left', 'https://cdn.glitch.global/d330f292-4635-4d3c-a075-245caf1e456b/left.png?v=1715281936718');
    imgVars.right = this.load.image('right', 'https://cdn.glitch.global/d330f292-4635-4d3c-a075-245caf1e456b/right.png?v=1715281937146');
    imgVars.dashing = this.load.image('dashButt', 'https://cdn.glitch.global/d330f292-4635-4d3c-a075-245caf1e456b/dash.png?v=1715281937594');
    imgVars.red = this.load.image('red', 'https://cdn.glitch.global/858db69c-3fe7-4e63-b52d-9c6a074110bd/0ef1ae9e-640e-4d80-8f09-dc01adb03384.image.png?v=1711050928809');
    imgVars.taco = this.load.image('taco', 'https://cdn.glitch.global/858db69c-3fe7-4e63-b52d-9c6a074110bd/703fb1c0-2bad-43b4-89ab-0124e5740d7b.image.png?v=1711081923349');
    
    imgVars.salsa = this.load.image('salsa', 'https://cdn.glitch.global/da457fbd-19c6-422a-863f-6fe780ba1e42/salsa.png?v=1737666565901');
    imgVars.cheese = this.load.image('cheese', 'https://cdn.glitch.global/da457fbd-19c6-422a-863f-6fe780ba1e42/cheese.png?v=1737675731025');
    imgVars.beans = this.load.image('beans', 'https://cdn.glitch.global/da457fbd-19c6-422a-863f-6fe780ba1e42/beans.png?v=1737676175066');
    
    imgVars.bricks = this.load.image('bricks', 'https://cdn.glitch.global/858db69c-3fe7-4e63-b52d-9c6a074110bd/2baf4e0e-c320-4ace-b0cf-70b2d8836012.image.png?v=1712692347075');
    imgVars.dash = this.load.image('dash', 'https://cdn.glitch.global/858db69c-3fe7-4e63-b52d-9c6a074110bd/9ea0e513-d298-4964-ba71-7fcfe344dc8a.image.png?v=1712065474048');
    imgVars.pepper = this.load.image('pepper', 'https://cdn.glitch.global/858db69c-3fe7-4e63-b52d-9c6a074110bd/BeFunky-design%20(14).png?v=1712070984107');
    imgVars.smoke = this.load.image('smoke', 'https://cdn.glitch.global/858db69c-3fe7-4e63-b52d-9c6a074110bd/ea84c167-a334-4bfc-84c9-802ffb358a4f.image.png?v=1712071348834');
    imgVars.menuButt = this.load.image('menuButt', 'https://cdn.glitch.global/94a99e8b-0f5f-45b4-869d-757542429668/BeFunky-design%20(8).png?v=1728915234756');

    imgVars.bricks = this.load.image("bricksSet", "https://cdn.glitch.global/da457fbd-19c6-422a-863f-6fe780ba1e42/bricks_Padded.png?v=1737730525170");

    this.load.tilemapTiledJSON('level1', './js/levels/level1.json');
    this.load.tilemapTiledJSON('level2', './js/levels/level2.json');
    this.load.tilemapTiledJSON('level3', './js/levels/level3.json');
    this.load.tilemapTiledJSON('level4', './js/levels/level4.json');
    this.load.tilemapTiledJSON('level5', './js/levels/level5.json');
    this.load.tilemapTiledJSON('level6', './js/levels/level6.json');
    this.load.tilemapTiledJSON('level7', './js/levels/level7.json');

    this.load.audio('music', 'https://cdn.glitch.global/858db69c-3fe7-4e63-b52d-9c6a074110bd/latin-reggaeton-hip-hop-mexican-background-music-caliente-flow-146085.mp3?v=1712160266663');
    this.load.audio('dashSFX', 'https://cdn.glitch.global/858db69c-3fe7-4e63-b52d-9c6a074110bd/quick-swhooshing-noise-80898.mp3?v=1712179809498');
    this.load.audio('jumpSFX', 'https://cdn.glitch.global/858db69c-3fe7-4e63-b52d-9c6a074110bd/arcade-game-jump-epic-stock-media-1-00-00.mp3?v=1712181503146');
  }
  create() {
    sceneControllerExternal = this.scene;
    if(document.getElementById("Login")) {
      document.getElementById("Login").style.display = "none";
      document.getElementById("Login").style.zIndex = 10;
      document.getElementById("enter").onclick = function() {
        if(document.getElementById("Inputs").style.display == "none") {
          alert("Please Input Your Username and RoomKey In The Appropriate Boxes, Then Hit \"Multiplayer\" Again!");
          document.getElementById("Inputs").style.display = "";
        } else {
          if(document.getElementById("mobile").checked) {
            gameState.mobileChecked = true;
          }
          if(document.getElementById("roomNum").value.length > 0 && document.getElementById("username").value.length > 0) {
            console.log(document.getElementById("mobile").value);
            yourRoom = document.getElementById("roomNum").value;
            userName = document.getElementById("username").value;
            document.getElementById("Login").remove();
            gameState.multiplayer = true;
            socket = io();
            document.getElementById("levelSelect").style.zIndex = 1000;
            var gg = "";
            for (var o=1;o<(Object.keys(levels).length+1);o++) {
              if(true) {
                gg += "<li class='levelB' onclick='selectLevel(\"level"+o+"\")'>Level "+o+"</li>";
              } else {
                gg += "<li class='locked levelB'>Level "+o+"</li>";
              };
            };
            document.getElementById("levelList").innerHTML = gg;
          } else {
            alert("Either Username or Room Name not inputted!");
          };
        }
      }
      document.getElementById("noMulti").onclick = function() {
        gameState.multiplayer = false;
        if(document.getElementById("mobile").checked) {
          gameState.mobileChecked = true;
        }
        document.getElementById("Login").remove();
        document.getElementById("levelSelect").style.zIndex = 1000;
        var gg = "";
        for (var o=1;o<(Object.keys(levels).length+1);o++) {
            if(true) {
              gg += "<li class='levelB' onclick='selectLevel(\"level"+o+"\")'>Level "+o+"</li>";
            } else { 
              gg += "<li class='locked levelB'>Level "+o+"</li>";
            };
        };
        document.getElementById("levelList").innerHTML = gg;
        const animatedElements = document.querySelectorAll('.levelB');
        animatedElements.forEach(element => {
          const randomDelay = Math.random() * -4; // Generate random delay between 0 and 2 seconds

          element.style.animationDelay = randomDelay + 's'; 

        });
      }
       
      
      
      document.getElementById("enter").onmouseover = function() {
        document.getElementById("singleplayerIcon").style.opacity = "1";
      }
      document.getElementById("enter").onmouseleave = function() {
        document.getElementById("singleplayerIcon").style.opacity = "0.25";
      }
      document.getElementById("noMulti").onmouseover = function() {
        document.getElementById("multiplayerIcon").style.opacity = "1";
      }
      document.getElementById("noMulti").onmouseleave = function() {
        document.getElementById("multiplayerIcon").style.opacity = "0.25";
      }
    };
    const backgroundParticles2 = this.add.particles(0, 0, 'taco', {
      x: {min: 0, max: config.width * 2 },
      y: -5,
      lifespan: 3500,
      speedX: { min:-5, max: -100 },
      speedY: { min: 100, max: 300 },
      scale: { start: 0.6, end: 0 },
      quantity: 1,
      frequency: 50,
    rotate: {min: -30, max: 30},
    });
    
    const bftext = this.add.text(config.width/2, config.height*0.25, 'Salsa\nJumper', { align: 'center' });

    bftext.setOrigin(0.5, 0.5);
    bftext.setResolution(window.devicePixelRatio);
    bftext.setFontFamily('Arial');
    bftext.setFontStyle('bold');
    bftext.setTint(0x000000);
    bftext.setFontSize(75);

    const text = this.add.text(config.width/2, config.height*0.25, 'Salsa\nJumper', { align: 'center' });

    text.setOrigin(0.5, 0.5);
    text.setResolution(window.devicePixelRatio);
    text.setFontFamily('Arial');
    text.setFontStyle('bold');
    text.setFontSize(80);

    text.preFX.setPadding(32);
    
    this.tweens.add({
      targets: bftext,
      scale: 1.5,
      yoyo: true,
      duration: 2000,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    this.tweens.add({
      targets: text,
      scale: 1.3,
      yoyo: true,
      duration: 2000,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    
    const startButton = this.add.image(config.width/2, config.height*0.65, 'taco').setScale(0.8);
    
    const btext = this.add.text(config.width/2, config.height*0.68, 'Start', { align: 'center' });

    btext.setOrigin(0.5, 0.5);
    btext.setResolution(window.devicePixelRatio);
    btext.setFontFamily('Arial');
    btext.setFontStyle('bold');
    btext.setTint(0x000000);
    btext.setFontSize(70);

    text.preFX.setPadding(32);
    
    const b2text = this.add.text(config.width/2, config.height*0.68, 'Start', { align: 'center' });

    b2text.setOrigin(0.5, 0.5);
    b2text.setResolution(window.devicePixelRatio);
    b2text.setFontFamily('Arial');
    b2text.setFontStyle('bold');
    b2text.setFontSize(80);

    text.preFX.setPadding(32);
    
    this.tweens.add({
      targets: btext,
      scale: 1.25,
      yoyo: true,
      duration: 1000,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    this.tweens.add({
      targets: b2text,
      scale: 1.25,
      yoyo: true,
      duration: 1000,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    
    
    startButton.setInteractive();
    
    startButton.on('pointerover', () => {
      startButton.setScale(0.9);
    });
    
    startButton.on('pointerout', () => {
      startButton.setScale(0.8);
    });
    
    startButton.on('pointerdown', () => {
      unlockAll();
      this.scene.stop("Start");
      if(document.getElementById("Login")) {
        document.getElementById("Login").style.display = "";
      } else {
        gameState.currLevel = "level1";
        this.scene.start("Level");
      };
    });
    
    const backgroundParticles = this.add.particles(0, 0, 'pepper', {
      x: {min: 0, max: config.width * 2 },
      y: -5,
      lifespan: 2000,
      speedX: { min:-5, max: -200 },
      speedY: { min: 200, max: 400 },
      scale: { start: 0.6, end: 0 },
      quantity: 1,
      frequency: 100,
      scale: {start: 0.1, end: 0},
      rotate: {min: -90, max: 30},
    });
    if(document.getElementById("loadingIndicator")) {
      document.getElementById("loadingIndicator").remove();
    };
    
  }
}

class hatMenu extends Phaser.Scene {
  constructor() {
    super("hatMenu");
  }
  preload() {
    this.load.image('arrowLeft', 'https://cdn.glitch.global/da457fbd-19c6-422a-863f-6fe780ba1e42/arrow-left.png?v=1738075257599');
    this.load.image('arrowRight', 'https://cdn.glitch.global/da457fbd-19c6-422a-863f-6fe780ba1e42/arrow-right.png?v=1738075201827');
  }
  create() {
    this.add.rectangle(0, 0, config.width, config.height, 0x000000, 90).setOrigin(0, 0);
    
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('logo', { start: 4, end: 5 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'defHat',
      frames: this.anims.generateFrameNumbers('hats', {start: 0, end: 1}),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'topHat',
      frames: this.anims.generateFrameNumbers('hats', {start: 2, end: 3}),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'hardHat',
      frames: this.anims.generateFrameNumbers('hats', {start: 4, end: 5}),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'baseballHat',
      frames: this.anims.generateFrameNumbers('hats', {start: 6, end: 7}),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'policeHat',
      frames: this.anims.generateFrameNumbers('hats', {start: 8, end: 9}),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'safariHat',
      frames: this.anims.generateFrameNumbers('hats', {start: 10, end: 11}),
      frameRate: 5,
      repeat: -1,
    });
    
    const playerAvatar = this.add.sprite(config.width/2, config.height*0.5, 'logo').anims.play("idle");
    const hatAvatar = this.add.sprite(config.width/2, config.height*0.5, 'hats').setOrigin(0.55,1.20).setScale(2.4).anims.play(hatIndex[cHatIndex]);
    
    const leftButton = this.add.image(config.width/2, config.height*0.48, 'arrowLeft').setScale(5).setOrigin(2,0.5);
    
    this.leftButtonTween = this.tweens.add({
      targets: leftButton,
      scale: 5.5,
      yoyo: true,
      duration: 600,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    this.leftButtonTween2 = this.tweens.add({
        targets: leftButton,
        y: config.height*0.48 - 10,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'ease-in-out',
        persist: true,
      }).pause();
    
    leftButton.setInteractive();
    
    leftButton.on('pointerover', () => {
      this.leftButtonTween.pause();
      this.leftButtonTween2.resume();
    });
    
    leftButton.on('pointerout', () => {
      this.leftButtonTween.resume();
      this.leftButtonTween2.pause();
    });
    
    leftButton.on('pointerdown', () => {
      cHatIndex -= 1;
      if(cHatIndex < 0) {
        cHatIndex = hatIndex.length-1;
      }
      hatAvatar.anims.play(hatIndex[cHatIndex]);
    });
    
    const rightButton = this.add.image(config.width/2, config.height*0.48, 'arrowRight').setScale(5).setOrigin(-1,0.5);
    
    this.rightButtonTween = this.tweens.add({
      targets: rightButton,
      scale: 5.5,
      yoyo: true,
      duration: 600,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    this.rightButtonTween2 = this.tweens.add({
        targets: rightButton,
        y: config.height*0.48 - 10,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'ease-in-out',
        persist: true,
      }).pause();
    
    rightButton.setInteractive();
    
    rightButton.on('pointerover', () => {
      this.rightButtonTween.pause();
      this.rightButtonTween2.resume();
    });
    
    rightButton.on('pointerout', () => {
      this.rightButtonTween.resume();
      this.rightButtonTween2.pause();
    });
    
    rightButton.on('pointerdown', () => {
      cHatIndex += 1;
      if(cHatIndex > hatIndex.length-1) {
        cHatIndex = 0;
      }
      hatAvatar.anims.play(hatIndex[cHatIndex]);
    });
    
    
    const doneButton = this.add.image(config.width/2, config.height*0.80, 'taco').setScale(0.4);
    
    this.doneButtonTween = this.tweens.add({
      targets: doneButton,
      scale: 0.5,
      yoyo: true,
      duration: 600,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    this.doneButtonTween2 = this.tweens.add({
        targets: doneButton,
        y: config.height*0.80 - 10,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'ease-in-out',
        persist: true,
      }).pause();
    
    doneButton.setInteractive();
    
    doneButton.on('pointerover', () => {
      this.doneButtonTween.pause();
      this.doneButtonTween2.resume();
    });
    
    doneButton.on('pointerout', () => {
      this.doneButtonTween.resume();
      this.doneButtonTween2.pause();
    });
    
    doneButton.on('pointerdown', () => {
      this.scene.stop();
      this.scene.resume("Menu");
    });
    
      
    const btext = this.add.text(config.width/2, config.height*0.80, 'Done', { align: 'center' });

    btext.setOrigin(0.5, 0.5);
    btext.setResolution(window.devicePixelRatio);
    btext.setFontFamily('Arial');
    btext.setFontStyle('bold');
    btext.setTint(0x000000);
    btext.setFontSize(45);

    btext.preFX.setPadding(32);
    
    const b2text = this.add.text(config.width/2, config.height*0.80, 'Done', { align: 'center' });

    b2text.setOrigin(0.5, 0.5);
    b2text.setResolution(window.devicePixelRatio);
    b2text.setFontFamily('Arial');
    b2text.setFontStyle('bold');
    b2text.setFontSize(50);

    b2text.preFX.setPadding(32);
    
  }
}

class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }
  preload() {
    this.load.image('taco', 'https://cdn.glitch.global/858db69c-3fe7-4e63-b52d-9c6a074110bd/703fb1c0-2bad-43b4-89ab-0124e5740d7b.image.png?v=1711081923349');
  }
  create() {
    this.add.rectangle(0, 0, config.width, config.height, 0x000000, 50).setOrigin(0, 0);
    
    const backgroundParticles2 = this.add.particles(0, 0, 'taco', {
      x: {min: 0, max: config.width * 2 },
      y: -5,
      lifespan: 3500,
      speedX: { min:-5, max: -100 },
      speedY: { min: 100, max: 300 },
      scale: { start: 0.6, end: 0 },
      quantity: 1,
      frequency: 50,
      tint: 0x888888,
      rotate: {min: -30, max: 30},
    });
    const text = this.add.text(config.width/2, config.height*0.18, 'Salsa\nJumper', { align: 'center' });

    text.setOrigin(0.5, 0.5);
    text.setResolution(window.devicePixelRatio);
    text.setFontFamily('Arial');
    text.setFontStyle('bold');
    text.setFontSize(80);

    text.preFX.setPadding(32);
    
    this.tweens.add({
      targets: text,
      scale: 1.1,
      yoyo: true,
      duration: 1000,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    
    const startButton = this.add.image(config.width/2, config.height*0.48, 'taco').setScale(0.5);
    
    this.startButtonTween = this.tweens.add({
      targets: startButton,
      scale: 0.6,
      yoyo: true,
      duration: 400,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    this.startButtonTween2 = this.tweens.add({
        targets: startButton,
        y: config.height*0.48 - 10,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'ease-in-out',
        persist: true,
      }).pause();
    
    const restartButton = this.add.image((config.width/4)*3, config.height*0.55, 'taco').setScale(0.35);
    
    this.restartButtonTween = this.tweens.add({
      targets: restartButton,
      scale: 0.40,
      yoyo: true,
      duration: 400,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    this.restartButtonTween2 = this.tweens.add({
        targets: restartButton,
        y: config.height*0.55 - 10,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'ease-in-out',
        persist: true,
      }).pause();
    
    const hatButton = this.add.image((config.width/4), config.height*0.55, 'taco').setScale(0.35);
    
    this.hatButtonTween = this.tweens.add({
      targets: hatButton,
      scale: 0.40,
      yoyo: true,
      duration: 400,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    this.hatButtonTween2 = this.tweens.add({
        targets: hatButton,
        y: config.height*0.55 - 10,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'ease-in-out',
        persist: true,
      }).pause();
    
    
    var toTitle;
    var skipButton;
    if(gameState.currLevel != "Lobby") {
      toTitle = this.add.image((config.width/4), config.height*0.75, 'taco').setScale(0.35);
      skipButton = this.add.image((config.width/4*3), config.height*0.75, 'taco').setScale(0.35);
      
      this.toTitleButtonTween = this.tweens.add({
      targets: toTitle,
      scale: 0.45,
      yoyo: true,
      duration: 400,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    this.toTitleButtonTween2 = this.tweens.add({
        targets: toTitle,
        y: config.height*0.75 - 10,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'ease-in-out',
        persist: true,
      }).pause();
      
      this.skipButtonTween = this.tweens.add({
      targets: skipButton,
      scale: 0.45,
      yoyo: true,
      duration: 400,
      ease: 'ease-in-out',
      persist: true,
      repeat: -1,
    });
    this.skipButtonTween2 = this.tweens.add({
        targets: skipButton,
        y: config.height*0.75 - 10,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'ease-in-out',
        persist: true,
      }).pause();
    };
    
      
    const btext = this.add.text(config.width/2, config.height*0.48, 'Continue', { align: 'center' });

    btext.setOrigin(0.5, 0.5);
    btext.setResolution(window.devicePixelRatio);
    btext.setFontFamily('Arial');
    btext.setFontStyle('bold');
    btext.setTint(0x000000);
    btext.setFontSize(45);

    btext.preFX.setPadding(32);
    
    const b2text = this.add.text(config.width/2, config.height*0.48, 'Continue', { align: 'center' });

    b2text.setOrigin(0.5, 0.5);
    b2text.setResolution(window.devicePixelRatio);
    b2text.setFontFamily('Arial');
    b2text.setFontStyle('bold');
    b2text.setFontSize(50);

    b2text.preFX.setPadding(32);
    
    const b3text = this.add.text(config.width/4*3, config.height*0.55, 'Level Select', { align: 'center' });

    b3text.setOrigin(0.5, 0.5);
    b3text.setResolution(window.devicePixelRatio);
    b3text.setFontFamily('Arial');
    b3text.setFontStyle('bold');
    b3text.setTint(0x000000);
    b3text.setFontSize(25);

    b3text.preFX.setPadding(32);
    
    const b4text = this.add.text(config.width/4*3, config.height*0.55, 'Level Select', { align: 'center' });

    b4text.setOrigin(0.5, 0.5);
    b4text.setResolution(window.devicePixelRatio);
    b4text.setFontFamily('Arial');
    b4text.setFontStyle('bold');
    b4text.setFontSize(30);

    b4text.preFX.setPadding(32);
    
    
    if(gameState.currLevel != "Lobby") {
      const b5text = this.add.text(config.width/4*3, config.height*0.76, 'Skip', { align: 'center' });

      b5text.setOrigin(0.5, 0.5);
      b5text.setResolution(window.devicePixelRatio);
      b5text.setFontFamily('Arial');
      b5text.setFontStyle('bold');
      b5text.setTint(0x000000);
      b5text.setFontSize(25);

      b5text.preFX.setPadding(32);

      const b6text = this.add.text(config.width/4*3, config.height*0.76, 'Skip', { align: 'center' });

      b6text.setOrigin(0.5, 0.5);
      b6text.setResolution(window.devicePixelRatio);
      b6text.setFontFamily('Arial');
      b6text.setFontStyle('bold');
      b6text.setFontSize(30);

      b6text.preFX.setPadding(32);

       const b7text = this.add.text(config.width/4, config.height*0.76, 'To Title', { align: 'center' });

      b7text.setOrigin(0.5, 0.5);
      b7text.setResolution(window.devicePixelRatio);
      b7text.setFontFamily('Arial');
      b7text.setFontStyle('bold');
      b7text.setTint(0x000000);
      b7text.setFontSize(25);

      b7text.preFX.setPadding(32);

      const b8text = this.add.text(config.width/4, config.height*0.76, 'To Title', { align: 'center' });

      b8text.setOrigin(0.5, 0.5);
      b8text.setResolution(window.devicePixelRatio);
      b8text.setFontFamily('Arial');
      b8text.setFontStyle('bold');
      b8text.setFontSize(30);

      b8text.preFX.setPadding(32);
      
      const b9text = this.add.text(config.width/4, config.height*0.55, 'Hats', { align: 'center' });

      b9text.setOrigin(0.5, 0.5);
      b9text.setResolution(window.devicePixelRatio);
      b9text.setFontFamily('Arial');
      b9text.setFontStyle('bold');
      b9text.setTint(0x000000);
      b9text.setFontSize(25);

      b9text.preFX.setPadding(32);

      const b10text = this.add.text(config.width/4, config.height*0.55, 'Hats', { align: 'center' });

      b10text.setOrigin(0.5, 0.5);
      b10text.setResolution(window.devicePixelRatio);
      b10text.setFontFamily('Arial');
      b10text.setFontStyle('bold');
      b10text.setFontSize(30);

      b10text.preFX.setPadding(32);
    };
    
    
    startButton.setInteractive();
    
    startButton.on('pointerover', () => {
      this.startButtonTween.pause();
      this.startButtonTween2.resume();
    });
    
    startButton.on('pointerout', () => {
      this.startButtonTween.resume();
      this.startButtonTween2.pause();
    });
    
    startButton.on('pointerdown', () => {
      this.scene.stop("Menu");
      //console.log("Level");
      this.scene.resume("Level");
      gameState.hatChange(hatIndex[cHatIndex]);
    });
    
    
    
    if(gameState.currLevel != "Lobby") {
      skipButton.setInteractive();
    
      skipButton.on('pointerover', () => {
      this.skipButtonTween.pause();
      this.skipButtonTween2.resume();
      });

      skipButton.on('pointerout', () => {
      this.skipButtonTween.resume();
      this.skipButtonTween2.pause();
      });

      skipButton.on('pointerdown', () => {
        this.scene.stop("Menu");
        this.scene.stop("Level");
        gameState.checkSpawn.active = false;
        gameState.currLevel = gameState.nextLevel;
        this.scene.start("Level");
      });
      
      toTitle.setInteractive();

      toTitle.on('pointerover', () => {
        this.toTitleButtonTween.pause();
        this.toTitleButtonTween2.resume();
      });

      toTitle.on('pointerout', () => {
        this.toTitleButtonTween.resume();
        this.toTitleButtonTween2.pause();
      });

      toTitle.on('pointerdown', () => {
        window.location.reload();
      });
    };
    
    hatButton.setInteractive();
    
    hatButton.on('pointerover', () => {
      this.hatButtonTween.pause();
      this.hatButtonTween2.resume();
    });
    
    hatButton.on('pointerout', () => {
      this.hatButtonTween.resume();
      this.hatButtonTween2.pause();
    });
    
    hatButton.on('pointerdown', () => {
      this.scene.pause();
      //console.log("Level");
      this.scene.launch("hatMenu");
    });
    
    restartButton.setInteractive();
    
    restartButton.on('pointerover', () => {
      this.restartButtonTween.pause();
      this.restartButtonTween2.resume();
    });
    
    restartButton.on('pointerout', () => {
      this.restartButtonTween.resume();
      this.restartButtonTween2.pause();
    });
    
    restartButton.on('pointerdown', () => {
      this.scene.stop("Menu");
      this.scene.stop("Level");
      var gg = "";
        for (var o=1;o<(Object.keys(levels).length+1);o++) {
            if(true) {
              gg += "<li class='levelB' onclick='selectLevel(\"level"+o+"\")'>Level "+o+"</li>";
            } else {
              gg += "<li class='locked levelB'>Level "+o+"</li>";
            };
        };
      document.getElementById("levelList").innerHTML = gg;
      document.getElementById("levelSelect").style.zIndex = 1000;
      const animatedElements = document.querySelectorAll('.levelB');
        animatedElements.forEach(element => {
          const randomDelay = Math.random() * -4; // Generate random delay between 0 and 2 seconds

          element.style.animationDelay = randomDelay + 's'; 

        });
    });
  }
}

class ResultL extends Phaser.Scene {
  constructor() {
    super("ResultL");
  }
  preload() {
    this.load.image('taco', 'https://cdn.glitch.global/858db69c-3fe7-4e63-b52d-9c6a074110bd/703fb1c0-2bad-43b4-89ab-0124e5740d7b.image.png?v=1711081923349');
    this.load.image('pepper', 'https://cdn.glitch.global/858db69c-3fe7-4e63-b52d-9c6a074110bd/BeFunky-design%20(14).png?v=1712070984107');
  }
  create() {
    const backgroundParticles2 = this.add.particles(0, 0, 'taco', {
      x: {min: 0, max: config.width * 2 },
      y: -5,
      lifespan: 3500,
      speedX: { min:-5, max: -100 },
      speedY: { min: 100, max: 300 },
      scale: { start: 0.6, end: 0 },
      quantity: 1,
      frequency: 50,
    rotate: {min: -30, max: 30},
    });

    const text = this.add.text(config.width/2, config.height*0.25, levels[gameState.currLevel].name+' Completed!\n\nYou Died '+gameState.deaths+' Time(s)!', { align: 'center' });
    gameState.deaths = 0;

    text.setOrigin(0.5, 0.5);
    text.setResolution(window.devicePixelRatio);
    text.setFontFamily('Arial');
    text.setFontStyle('bold');
    text.setFontSize(60);

    text.preFX.setPadding(32);
    
    const startButton = this.add.image(config.width/2, config.height*0.65, 'taco');
    
    const btext = this.add.text(config.width/2, config.height*0.68, 'Next', { align: 'center' });

    btext.setOrigin(0.5, 0.5);
    btext.setResolution(window.devicePixelRatio);
    btext.setFontFamily('Arial');
    btext.setFontStyle('bold');
    btext.setTint(0x000000);
    btext.setFontSize(80);

    text.preFX.setPadding(32);
    
    const b2text = this.add.text(config.width/2, config.height*0.68, 'Next', { align: 'center' });

    b2text.setOrigin(0.5, 0.5);
    b2text.setResolution(window.devicePixelRatio);
    b2text.setFontFamily('Arial');
    b2text.setFontStyle('bold');
    b2text.setFontSize(90);

    text.preFX.setPadding(32);
    
    
    startButton.setInteractive();
    
    startButton.on('pointerover', () => {
      startButton.setScale(1.1);
    });
    
    startButton.on('pointerout', () => {
      startButton.setScale(1);
    });
    
    startButton.on('pointerdown', () => {
      this.scene.stop("ResultL");
      gameState.currLevel = gameState.nextLevel;
      //gameState.levels[gameState.currLevel].locked = false;
      this.scene.start("Level");
    });
    
    const backgroundParticles = this.add.particles(0, 0, 'pepper', {
                x: {min: 0, max: config.width * 2 },
                y: -5,
                lifespan: 2000,
                speedX: { min:-5, max: -200 },
                speedY: { min: 200, max: 400 },
                scale: { start: 0.6, end: 0 },
                quantity: 1,
                frequency: 100,
              scale: {start: 0.1, end: 0},
                rotate: {min: -90, max: 30},
            });
    
  }
}
var otherPlayerss;

var createdPlayers;

var socketsMade = false;

class Level extends Phaser.Scene
    {
        constructor() {
			super("Level");
			this.nextLevel = {
				'level1': 'level2',
				'level2': 'level3',
				'level3': 'level4',
        'level4': 'level5',
        'level5': 'level6',
        'level6': 'level7',
        'level7': 'level8',
        'level8': 'level9',
        'level9': 'level10',
        'level10': 'level11',
        'level11': 'level12',
        'level12': 'level13',
        'level13': 'level14',
			}
        }
        
        preload ()
        {
          
        }

        create ()
        {
          gameState.physicsVars = this.physics;
          gameState.phaser = this;
          //console.log(yourRoom);
          this.map2 = this.make.tilemap({ key: gameState.currLevel});
    
          const tileset1 = this.map2.addTilesetImage("bricksv1", "bricksSet");
          
          this.mainLayer = this.map2.createLayer("MainLayer", tileset1, 0, 0).setScale(scaling);
          this.mainLayer.depth = 2;
          this.mainLayer.setCollisionByProperty({ collide: true });
          
          this.jumpLayer = this.map2.createLayer("JumpLayer", tileset1, 0, 0).setScale(scaling);
          this.jumpLayer.depth = 2;
          this.jumpLayer.setCollisionByProperty({collide: true});
          
          this.killLayer = this.map2.createLayer("KillLayer", tileset1, 0, 0).setScale(scaling);
          this.killLayer.depth = 2;
          this.killLayer.setCollisionByProperty({collide: true});
          
          this.bgLayer = this.map2.createLayer("bg", tileset1, 0, 0).setScale(scaling);
          this.bgLayer.depth = 1;

          this.objectLayer = this.map2.getObjectLayer("SpawnPoint");
          this.finalLayer = this.map2.getObjectLayer("FinalPoint");
          
          this.doorLocked = false;
          this.toppingsLayer = false;
          
          if(this.map2.getObjectLayer("Toppings")) {
            this.toppingsLayer = this.map2.getObjectLayer("Toppings");
            this.doorLocked = true;
            this.totalToppingsCount = this.toppingsLayer.objects.length;
          };
          gameState.playerSpawn.x = this.objectLayer.objects[0].x*scaling;
          gameState.playerSpawn.y = this.objectLayer.objects[0].y*scaling;
          

          
          this.physics.world.TILE_BIAS = 64;
          
          if(gameState.multiplayer == true) {
            this.sendDatacd = 0;
            this.otherPlayers = this.add.group();
            let self = this;
            socket.emit('joiningRoom', [yourRoom, gameState.currLevel, userName]);
            createdPlayers = false;
            if(socketsMade == false) {
              socket.on('currentPlayers', function (players) {
                if(createdPlayers == false) {
                  Object.keys(players).forEach(function (id) {
                    if (players[id].playerId === socket.id) {
                      //addPlayer(self, players[id]);
                    } else if(players[id].room === yourRoom && players[id].levelR === gameState.currLevel){
                      //console.log("Spawing Plaers");
                      self.addOtherPlayers(self, players[id]);
                    }
                  });
                  //createdPlayers = true;
                }
              });
              //console.log(self);
              socket.on('newPlayer', function (playerInfo) {
                if(playerInfo.room == yourRoom && playerInfo.levelR == gameState.currLevel){
                  self.addOtherPlayers(self, playerInfo);
                };
              });
              socket.on('disconnectR', function (playerIdR) {
                self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                  if (playerIdR === otherPlayer.playerId) {
                    otherPlayer.userLabel.destroy();
                    otherPlayer.destroy();
                  }
                });
              });
              socket.on('playerMoved', function (playerInfo) {
                self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                  if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.setPosition(playerInfo.x+20, playerInfo.y+15);
                    //console.log(playerInfo.anim);
                    //otherPlayer.getByName("animSprite").anims.play();
                    otherPlayer.animSpriteLL.flipX = playerInfo.flipX;
                    console.log(playerInfo.flipX);
                    otherPlayer.userLabel.x = playerInfo.x;
                    otherPlayer.userLabel.y = playerInfo.y-50;
                    otherPlayer.animSpriteLL.anims.play(playerInfo.anim, true);
                    otherPlayer.animSpriteHH.anims.play(hatIndex[playerInfo.hatAnim], true);
                    otherPlayer.animSpriteHH.flipX = playerInfo.flipX;
                    if(otherPlayer.playerId === socket.id || playerInfo.levelR != gameState.currLevel) {
                      otherPlayer.destroy();
                    };
                  };
                });
              });
              socketsMade = true;
            };
        };
          if(gameState.currLevel != "Lobby") {
            gameState.nextLevel = this.nextLevel[gameState.currLevel];
          };
            this.createAnimations();
            this.music =  this.sound.add('music', {
		          volume: 0.2,
		          loop: true
	          })
            
            this.dashSFX =  this.sound.add('dashSFX', {
		          volume: 1,
	          })
          
            this.jumpSFX =  this.sound.add('jumpSFX', {
		          volume: 0.5,
	          })

	          if (!this.sound.locked)
	          {
		          // already unlocked so play
              if(this.music.isPlaying == false) {
		            this.music.play();
              };
	          }
	          else
	          {
		          // wait for 'unlocked' to fire and then play
		          this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
			          this.music.play();
		          });
	          }
            const backgroundParticles2 = this.add.particles(0, 0, 'taco', {
                x: {min: 0, max: config.width * 2 },
                y: -5,
                lifespan: 3500,
                speedX: { min:-5, max: -100 },
                speedY: { min: 100, max: 300 },
                scale: { start: 0.6, end: 0 },
                quantity: 1,
                frequency: 90,
                rotate: {min: -30, max: 30},
            });
          
            gameState.platforms = this.physics.add.staticGroup();
            gameState.scaleWall = this.physics.add.staticGroup();
            gameState.finalPlat = this.physics.add.staticGroup();
            gameState.killBlocks = this.physics.add.staticGroup();
            gameState.jumpBlocks = this.physics.add.staticGroup();
            gameState.background = this.physics.add.staticGroup();
            gameState.checkPoints = this.physics.add.staticGroup();
            gameState.collectibles = this.physics.add.staticGroup();          
            
              class Follower extends Phaser.GameObjects.Sprite {
                constructor (scene)
                  {
                    super(scene, 0, 0, 'tortila');
                    this.speed = Phaser.Math.GetSpeed(100, 1);
                  }
                spawn ()
                  {
                    this.setPosition(gameState.followingEnemies.x, gameState.followingEnemies.y);
                    this.setDisplaySize(150,150);
                    this.depth = 100
                    this.body.setAllowGravity(false);
                    this.body.setSize(75, 75);
                    //this.body.setOffset();
                    this.setActive(true);
                    this.setVisible(true);
                  }
                update (time, delta)
                {
                  gameState.physicsVars.moveToObject(this, gameState.logo, 200);
                  gameState.physicsVars.add.overlap(gameState.logo, this, () => {
                    gameState.phaser.cameras.main.shake(500, 1, false, function(camera, progress) {
                      if(progress > 0.9) {
                        gameState.deaths += 1;
                        gameState.phaser.music.stop();
                        if(gameState.multiplayer) {
                          socket.emit('deleteOldPlayer', socket.id);
                          if(self.otherPlayers) {
                            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                              otherPlayer.userLabel.destroy();
                              otherPlayer.destroy();
                            });
                          };
                        };
                        gameState.phaser.scene.restart();
                        gameState.deathCounter.setText(gameState.deaths+' Death(s)');
                      }
                    });
                    gameState.normalTouch = true;
                  })
                  if(this.body.velocity.x < 0) {this.flipX = true;} else {this.flipX = false;};
                }
              }
              gameState.followers = this.physics.add.group({
                classType: Follower,
                maxSize: 1000,
                runChildUpdate: true
              });
          
            this.levelSetup();
          
          
            gameState.playerTrail = this.add.particles(0, 0, 'red', {
              scale: {start: 0.02, end: 0},
              speed: 10,
              lifespan: 1000,
              gravityY: 25,
              quantity: 1,
              frequency: 25,
              blendMode: 'ADD',
            })
            .setDepth(2);
          
            gameState.smokeTrail = this.add.particles(0,0, 'smoke', {
              scale: {start: 0.5, end: 0},
              speed: 10,
              lifespan: 2000,
              gravityY: 25,
              quantity: 1,
              rotate: { min: -90, max: 90 },
            })
            .setDepth(2);
          
          
             gameState.deathParticle1 = this.add.particles(0,0, 'white', {
              scale: {start: 0.7, end: 0},
              speedX: {min: -200, max: 200},
              speedY: {min: -200, max: 200},
               alpha: {start: 1, end: 0},
               lifespan: {min: 100, max: 1000},
              quantity: 0,
               maxAliveParticles: 100,
               hold: 1,
              rotate: { min: -90, max: 90 },
             })
            .setDepth(2);
          
            gameState.body = this.add.sprite(0, 0, 'logo').setDisplaySize(72, 90).setDepth(2);
          
            gameState.hat = this.add.sprite(0,-28,'hats').setScale(1.40).anims.play(gameState.hatI).setDepth(2);
          
            gameState.hatChange = function(hat) {
              gameState.hatI = hat;
              gameState.hat.anims.play(hat);
            }
          
            gameState.logo = this.add.container(0, 0, [gameState.body,gameState.hat]).setDepth(2);
          
            gameState.logo = this.physics.add.existing(gameState.logo);
            gameState.logo.body.setSize(45, 60);
            gameState.logo.body.setOffset(-22, -14);
          
            gameState.logo.setPosition(gameState.playerSpawn.x, gameState.playerSpawn.y)
            
            if(gameState.mobileChecked == true) {
              this.moveForward = this.add.image(
                config.width-180,
                config.height-100,
                "right",
              ).setScrollFactor(0);
              this.moveForward.depth = 100;
              this.moveForward.setDisplaySize(250,125);
              //this.input.addPointer();
              this.moveForward.setInteractive();
              this.moveForward.on('pointerdown',function() {gameState.mobileMoveR = true}, this);
              this.moveForward.on('pointerup',function() {gameState.mobileMoveR = false}, this);
              this.moveForward.on('pointerout', function() {gameState.mobileMoveR = false}, this);
              this.moveForward.on('pointerover', function() {gameState.mobileMoveR = true}, this);

              this.moveLeft = this.add.image(
                config.width-430,
                config.height-100,
                "left",
              ).setScrollFactor(0);
              this.moveLeft.depth = 100;
              this.moveLeft.setDisplaySize(250,125);
              //this.input.addPointer();
              this.moveLeft.setInteractive();
              this.moveLeft.on('pointerdown',function() {gameState.mobileMoveL = true}, this);
              this.moveLeft.on('pointerup',function() {gameState.mobileMoveL = false}, this);
              this.moveLeft.on('pointerout', function() {gameState.mobileMoveL = false}, this);
              this.moveLeft.on('pointerover', function() {gameState.mobileMoveL = true}, this);

              this.moveDash = this.add.image(
                180,
                config.height-75,
                "dashButt",
              ).setScrollFactor(0);
              this.moveDash.depth = 100;
              this.moveDash.setDisplaySize(200,100);
              //this.input.addPointer();
              this.moveDash.setInteractive();
              this.moveDash.on('pointerdown',function() {gameState.mobileMoveD = true}, this);
              this.moveDash.on('pointerup',function() {gameState.mobileMoveD = false}, this);
              this.moveDash.on('pointerout', function() {gameState.mobileMoveD = false}, this);
              this.moveDash.on('pointerover', function() {gameState.mobileMoveD = true}, this);

              this.moveJump = this.add.image(
                180,
                config.height-155,
                "jump",
              ).setScrollFactor(0);
              this.moveJump.depth = 100;
              this.moveJump.setDisplaySize(200,100);
              //this.input.addPointer();
              this.moveJump.setInteractive();
              this.moveJump.on('pointerdown',function() {gameState.mobileMoveU = true}, this);
              this.moveJump.on('pointerup',function() {gameState.mobileMoveU = false}, this);
              this.moveJump.on('pointerout', function() {gameState.mobileMoveU = false}, this);
              this.moveJump.on('pointerover', function() {gameState.mobileMoveU = true}, this);
              
              this.menuButt = this.add.image(
                config.width-100,
                50,
                "menuButt"
              ).setScrollFactor(0);
              this.menuButt.depth = 100;
              this.menuButt.setDisplaySize(100,75);
              this.menuButt.setInteractive();
              this.menuButt.on('pointerdown',function() {
                this.scene.pause();
                this.music.stop();
                this.scene.launch("Menu");
              }, this);
            };
          
            const backgroundParticles = this.add.particles(0, 0, 'pepper', {
                x: {min: 0, max: config.width * 2 },
                y: -5,
                lifespan: 2000,
                speedX: { min:-5, max: -200 },
                speedY: { min: 200, max: 400 },
                scale: { start: 0.6, end: 0 },
                quantity: 1,
                frequency: 200,
              scale: {start: 0.1, end: 0},
              rotate: { min: -90, max: 90 },
              alpha: 0.75,
            });
            if(gameState.multiplayer == true) {
              this.add.rectangle(0, 0, 270, 105, 0xFFFFFF).setOrigin(0,0).setScrollFactor(0).setDepth(2);
              this.add.rectangle(0, 0, 265, 100, 0x000000).setOrigin(0,0).setScrollFactor(0).setDepth(2);
            } else {
              this.add.rectangle(0, 0, 205, 55, 0xFFFFFF).setOrigin(0,0).setScrollFactor(0).setDepth(2);
              this.add.rectangle(0, 0, 200, 50, 0x000000).setOrigin(0,0).setScrollFactor(0).setDepth(2);
            };
            gameState.deathCounter = this.add.text(30,15, gameState.deaths+' Death(s)').setScrollFactor(0).setFontSize(20).setFontFamily('Arial').setDepth(2);
            if(gameState.multiplayer == true) {
              this.add.text(10,55, "Room Name: \""+yourRoom+"\"", {align: 'center'}).setScrollFactor(0).setFontSize(20).setFontFamily('Arial').setDepth(2);
            };
            backgroundParticles.setScrollFactor(0);
            backgroundParticles2.setScrollFactor(0);
          
            
            gameState.cursors = this.input.keyboard.createCursorKeys();
            this.input.addPointer(1);

            gameState.logo.body.setCollideWorldBounds(false);
            
            this.physics.world.setBounds(0, 0, 8000, config.height*3 + gameState.logo.height);
          
            this.cameras.main.startFollow(gameState.logo);
            this.cameras.main.setBounds(0, 0, this.map2.width*48*scaling, this.map2.height*48*scaling);
          
            this.physics.add.collider(gameState.logo, this.mainLayer, function() {
              gameState.touchingJump = false;
              gameState.normalTouch = true;
              gameState.jumpable = true;
            });
            this.physics.add.collider(gameState.logo, this.jumpLayer, function() {
              gameState.touchingJump = true;
              gameState.normalTouch = true;
              gameState.jumpable = true; 
            });
            this.physics.add.overlap(gameState.logo, gameState.finalPlat, function() {
              if(!this.doorLocked) {
                this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress) {
                  if (progress > .9) {
                    this.scene.stop("Level");
                    gameState.checkSpawn.active = false;
                    this.music.stop();
                    if(gameState.multiplayer) {
                      socket.emit('deleteOldPlayer', socket.id);
                    };
                    this.scene.start("ResultL");
                    //this.scene.start(this.nextLevel[this.levelC]);
                  }
                });
              };
            }, null, this);
          
          this.currLevelText = this.add.text(config.width/2, 20, levels[gameState.currLevel].name, {fontSize: 20, color: "white"}).setFontFamily("Arial").setScrollFactor(0).setOrigin(0.5, 0.5);
          this.currLevelText.depth = 100;
          this.add.rectangle(config.width/2, 20, 300, 40, 0x000000).setScrollFactor(0).depth = 99;
          this.add.rectangle(config.width/2, 20, 310, 50, 0xFFFFFF).setScrollFactor(0).depth = 98;

          this.physics.add.overlap(gameState.logo, gameState.checkPoints, function() {
            gameState.checkSpawn.x = gameState.logo.x;
            gameState.checkSpawn.y = gameState.logo.y;
            gameState.checkSpawn.active = true;
            gameState.normalTouch = false;
          });
          
          this.physics.add.overlap(gameState.logo, gameState.scaleWall, function() {
            gameState.jumpable = false;
            gameState.touchingJump = false;
          });
          
          this.physics.add.overlap(gameState.logo, gameState.collectibles, function(e, k) {
            k.destroy();
            gameState.phaser.totalToppingsCount -= 1;
            if(gameState.phaser.totalToppingsCount == 0) {
              gameState.phaser.doorLocked = false;
              gameState.phaser.endGate.setTint("0x000000");
            }
          })
          
            this.physics.add.collider(gameState.logo, this.killLayer, () => {
              this.cameras.main.shake(500, 1, false, function(camera, progress) {
                if(progress > 0.9) {
                  gameState.deaths += 1;
                  this.music.stop();
                  if(gameState.multiplayer) {
                    socket.emit('deleteOldPlayer', socket.id);
                    if(self.otherPlayers) {
                      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                        otherPlayer.userLabel.destroy();
                        otherPlayer.destroy();
                      });
                    };
                  };
                  this.scene.restart();
                  gameState.deathCounter.setText(gameState.deaths+' Death(s)');
                }
              });
              gameState.normalTouch = true;
            });
            gameState.smokeTrail.stop();
            gameState.smokeTrail.startFollow(gameState.logo.body, 20, 40);
            gameState.playerTrail.startFollow(gameState.logo.body, 23, 50);
            gameState.deathParticle1.startFollow(gameState.logo.body, 20, 40);
            gameState.deathParticle1.stop();
          
            keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            keys.Shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
            keys.Space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            keys.Escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
            keys.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        }
        createPlatform(objEct, collideNext) {
			if(collideNext == true) {
				gameState.finalPlat.create((objEct.x),  objEct.y, objEct.t).setScale(0.5).setOrigin(0, 0.5).setTint("0xfdfbd3").refreshBody();
			} else {
				gameState.platforms.create((objEct.x),  objEct.y, objEct.t).setScale(0.5).setOrigin(0, 0.5).setTint("0xfdfbd3").refreshBody();
			}
        }
      createAnimations() {
        this.anims.create({
          key: 'run',
          frames: this.anims.generateFrameNumbers('logo', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'idle',
          frames: this.anims.generateFrameNumbers('logo', { start: 4, end: 5 }),
          frameRate: 5,
          repeat: -1
        });

        this.anims.create({
          key: 'jump',
          frames: this.anims.generateFrameNumbers('logo', { start: 2, end: 3 }),
          frameRate: 10,
          repeat: -1
        });
        
        this.anims.create({
          key: 'secret',
          frames: this.anims.generateFrameNumbers('logo', {start: 6, end: 10}),
          frameRate: 6,
        });
    
        this.anims.create({
          key: 'tortilar',
          frames: this.anims.generateFrameNumbers('tortila', {start: 0, end: 1}),
          frameRate: 10,
          repeat: -1,
        });
        
        this.anims.create({
          key: 'defHat',
          frames: this.anims.generateFrameNumbers('hats', {start: 0, end: 1}),
          frameRate: 5,
          repeat: -1,
        });
        
        this.anims.create({
          key: 'topHat',
          frames: this.anims.generateFrameNumbers('hats', {start: 2, end: 3}),
          frameRate: 5,
          repeat: -1,
        });
        
        this.anims.create({
          key: 'hardHat',
          frames: this.anims.generateFrameNumbers('hats', {start: 4, end: 5}),
          frameRate: 5,
          repeat: -1,
        });
        
        this.anims.create({
          key: 'baseballHat',
          frames: this.anims.generateFrameNumbers('hats', {start: 6, end: 7}),
          frameRate: 5,
          repeat: -1,
        });
        
        this.anims.create({
          key: 'policeHat',
          frames: this.anims.generateFrameNumbers('hats', {start: 8, end: 9}),
          frameRate: 5,
          repeat: -1,
        });
        
        this.anims.create({
          key: 'safariHat',
          frames: this.anims.generateFrameNumbers('hats', {start: 10, end: 11}),
          frameRate: 5,
          repeat: -1,
        });
      }
      
      summonWave() {
        const baddie = gameState.followers.get();
        if (baddie)
        {
          baddie.spawn();
          baddie.anims.play('tortilar');
        }
      }
        levelSetup() {
          /*for (var i=0;i<this.heights.length;i++) {
            // call createPlatform here with xIndex and yIndex
			if(i+1 === this.heights.length) {
				this.createPlatform(this.heights[i], true);
			} else {
				this.createPlatform(this.heights[i], false);
			}
          }*/
          
          /*
          for(var i=0;i<this.map.length;i++) {
            for(var o=0;o<this.map[0].length;o++) {
              var wallTypes = [];
              if(this.mapState == "adobe") {
                wallTypes = ['bricks', 'wallBricks', 'halfBricks'];
              } else if (this.mapState == "blackBrick") {
                wallTypes = ['blackBrick', 'blackBrickWall', 'blackHalfBricks'];
              }
              if(this.map[i][o] == 0) {
                gameState.background.create((o*250), i*250, wallTypes[1]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0x666666").refreshBody(); 
              } else if(this.map[i][o] == 1) {
				        gameState.platforms.create((o*250),  i*250, wallTypes[0]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0xfdfbd3").refreshBody();
              } else if(this.map[i][o] == 2) {
                //gameState.playerSpawn.x = (o*250)+125;
                //gameState.playerSpawn.y = (i*250);
                gameState.background.create((o*250), i*250, wallTypes[1]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0x666666").refreshBody(); 
              } else if(this.map[i][o] == 3) {
                gameState.background.create((o*250), i*250, wallTypes[1]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0x666666").refreshBody(); 
                gameState.finalPlat.create((o*250)+100, i*250, wallTypes[0]).setDisplaySize(50,100).setOrigin(0, -0.25).setTint("0xAAAAFF").refreshBody();
              } else if(this.map[i][o] == 4) {
                gameState.background.create((o*250), i*250, wallTypes[1]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0x666666").refreshBody(); 
                gameState.platforms.create((o*250), i*250, wallTypes[2]).setDisplaySize(250, 125).setOrigin(0, 0).setTint("0xfdfbd3").refreshBody();
              } else if(this.map[i][o] == 5) {
                gameState.background.create((o*250), i*250, wallTypes[1]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0x666666").refreshBody(); 
                gameState.platforms.create((o*250), i*250, wallTypes[2]).setDisplaySize(250, 125).setOrigin(0, 1).setTint("0xfdfbd3").refreshBody();
              } else if(this.map[i][o] == 6) {
                gameState.killBlocks.create((o*250),  i*250, wallTypes[0]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0xff2020").refreshBody();
              } else if(this.map[i][o] == 7) {
                gameState.background.create((o*250), i*250, wallTypes[1]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0x666666").refreshBody(); 
                gameState.killBlocks.create((o*250)+87.5, i*250, 'burber').setDisplaySize(75,100).setOrigin(0, -0.25).setTint("0xfdfbd3").refreshBody().anims.play('idleBurger', true);
              } else if(this.map[i][o] == 8) {
				        gameState.jumpBlocks.create((o*250),  i*250, wallTypes[0]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0x50FF50").refreshBody();
              } else if (this.map[i][o] == 9) {
                gameState.background.create((o*250), i*250, wallTypes[1]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0x666666").refreshBody();
                gameState.checkPoints.create((o*250)+125, i*250, 'taco').setDisplaySize(150, 100).setOrigin(0.5, -0.5).refreshBody();
              } else if (this.map[i][o] == 100) {
                gameState.platforms.create((o*250),  i*250, 'secret11').setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0xfdfbd3").refreshBody();
              } else if (this.map[i][o] == 10) {
                gameState.scaleWall.create((o*250), i*250, wallTypes[1]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0x235442").refreshBody();                
              }else if (this.map[i][o] == 11) {
                gameState.background.create((o*250), i*250, wallTypes[1]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0x666666").refreshBody();
                gameState.followingEnemies.active = true;
                gameState.followingEnemies.x = o*250;
                gameState.followingEnemies.y = i*250;
                this.summonWave();
              }else {
                gameState.background.create((o*250), i*250, wallTypes[1]).setDisplaySize(250, 250).setOrigin(0, 0.5).setTint("0x666666").refreshBody();   
                this.add.text(o*250, i*250-50, this.map[i][o]).setFontFamily('Arial');
              }
            }
          }*/
          for(var i=0;i<this.finalLayer.objects.length;i++) {
            this.add.rectangle(this.finalLayer.objects[i].x*scaling, this.finalLayer.objects[i].y*scaling, 75, 110, "0xA0A0A0").setDepth(2).setOrigin(-0.2,0);
            this.endGate = gameState.finalPlat.create(this.finalLayer.objects[i].x*scaling, this.finalLayer.objects[i].y*scaling, "bricks").setDisplaySize(50,100).setOrigin(-0.55, -0.1).setDepth(2).setTint("0xAAAAFF").refreshBody();
            if(!this.doorLocked) {
              this.endGate.setTint("0x000000");
            }
          };
          if(this.toppingsLayer) {
            for(var i=0;i<this.toppingsLayer.objects.length;i++) {
              gameState.collectibles.create(this.toppingsLayer.objects[i].x*scaling, this.toppingsLayer.objects[i].y*scaling, this.toppingsLayer.objects[i].name).setDisplaySize(75,80).setOrigin(-0.25, -0.35).setDepth(2).refreshBody();
            }
          }
          if(gameState.checkSpawn.active == true) {
            gameState.playerSpawn.x = gameState.checkSpawn.x;
            gameState.playerSpawn.y = gameState.checkSpawn.y;
          }
          //this.cameras.main.setBounds(0, 0, this.map[0].length*250, this.map.length*250);
          this.add.rectangle(37.5, config.height-37.5, 75, 75, 0xFFFFFF).setScrollFactor(0).setDepth(2);
          gameState.dashImg = this.add.image(37.5, config.height-37.5, 'dash').setDisplaySize(50,50).setDepth(2);
          gameState.dashImg.setScrollFactor(0);
          gameState.dash = false;
        }
      
      update(time, delta) {
        if(gameState.dash == true) {
          gameState.dashImg.setAlpha(0);
        } else {
          gameState.dashImg.setAlpha(1);
        };
        if(gameState.velX > 0) {
          gameState.body.flipX = false;
          gameState.hat.flipX = false;
          gameState.body.anims.play('run', true);
          gameState.body.CURRENTANIM = 'run';
          gameState.body.CURRENTFLIPX = false;
          gameState.logo.body.setVelocityX(gameState.velX);
          gameState.playerTrail.start();
        }
        if(gameState.velX < 0) {
          gameState.body.flipX = true;
          gameState.hat.flipX = true;
          gameState.body.anims.play('run', true);
          gameState.body.CURRENTANIM = 'run';
          gameState.body.CURRENTFLIPX = true;
          gameState.logo.body.setVelocityX(gameState.velX);
          gameState.playerTrail.start();
        }
        if(gameState.velX == 0) {
          if(gameState.secret111 == true) {
            gameState.body.anims.play('secret', true);
          } else {
            gameState.body.anims.play('idle', true);
            gameState.body.CURRENTANIM = 'idle';
          }
          gameState.playerTrail.stop();
          gameState.logo.body.setVelocityX(gameState.velX);
        }
        if(Math.abs(gameState.velX) > 600) {
          gameState.smokeTrail.start();
        } else if(gameState.logo.body.velocity.y < -700) {
          gameState.smokeTrail.start();
        } else {
          gameState.smokeTrail.stop();
        }
        if ((gameState.cursors.left.isDown || keys.A.isDown || gameState.mobileMoveL == true) && gameState.velX > -500) {
          if(gameState.velX > 10) {
            gameState.velX += -(gameState.velX/4);
          } else {
            gameState.velX -= 10;
          }
          if((keys.Shift.isDown || gameState.mobileMoveD == true) && gameState.dash == false) {
            gameState.dash = true;
            this.dashSFX.play();
            gameState.velX = -3500;
            this.time.delayedCall(1000, () => {gameState.dash = false; gameState.deathParticle1.explode(40, gameState.logo.x+42.5, gameState.logo.y+45);});
          };
        } else if ((gameState.cursors.right.isDown || keys.D.isDown || gameState.mobileMoveR == true) && gameState.velX < 500) {
          if(gameState.velX < -10) {
            gameState.velX += -(gameState.velX/4);
          } else {
            gameState.velX += 10;
          }
          if((keys.Shift.isDown || gameState.mobileMoveD == true) && gameState.dash == false) {
            gameState.dash = true;
            gameState.velX = 3500;
            this.dashSFX.play();
            this.time.delayedCall(1000, () => {gameState.dash = false; gameState.deathParticle1.explode(40, gameState.logo.x+42.5, gameState.logo.y+45);});
          };
        } else {
          if(Math.abs(gameState.velX) > 500) {
            	gameState.velX += -(gameState.velX/10);
          } else {
            	gameState.velX += -(gameState.velX/4);
          }
          if(gameState.velX < 10 && gameState.velX > -10) {
            gameState.velX = 0;
          }
        };
        if((gameState.cursors.up.isDown || keys.Space.isDown || keys.W.isDown || gameState.mobileMoveU == true) && (gameState.logo.body.blocked.down)) {
          if(gameState.touchingJump == true) {
            gameState.logo.body.setVelocityY(-1400);
          } else {
            gameState.logo.body.setVelocityY(-800);
          };
          this.jumpSFX.play();
          gameState.playerTrail.start();
        } else if(gameState.logo.body.blocked.left && gameState.normalTouch == true && gameState.jumpable == true) {
          gameState.logo.body.setVelocityY(10);
          if((gameState.cursors.up.isDown || keys.Space.isDown || keys.W.isDown || gameState.mobileMoveU == true) && gameState.normalTouch == true && gameState.jumpable == true) {
            gameState.velX = 1000;
            gameState.logo.body.setVelocityY(-625);
            this.jumpSFX.play();
          } else {
            //gameState.velX = 0;
          };
          gameState.playerTrail.start();
        } else if(gameState.logo.body.blocked.right && gameState.normalTouch == true && gameState.jumpable == true) {
          gameState.logo.body.setVelocityY(10);
          if((gameState.cursors.up.isDown || keys.Space.isDown || keys.W.isDown || gameState.mobileMoveU == true) && gameState.normalTouch == true && gameState.jumpable == true) {
            gameState.velX = -1000;
            gameState.logo.body.setVelocityY(-625);
            this.jumpSFX.play();
          } else {
            //gameState.velX = 0;
          };
          gameState.playerTrail.start();
        };
        if(gameState.logo.body.blocked.down == false) {
          gameState.body.anims.play('jump', true);
          gameState.body.CURRENTANIM = 'jump';
        }
        
        if(keys.R.isDown) {
          gameState.secret111 = true;
        };
        
        gameState.body.on('animationcomplete', function(animation, frame) {
          if(animation.key === 'secret') {
            gameState.deathParticle1.explode(1, gameState.logo.x, gameState.logo.y);
            gameState.secret111 = false;
            this.cameras.main.shake(500, 0.01, false, function(camera, progress) {
              if(progress > 0.9) {
                gameState.deaths += 1;
                this.music.stop();
                this.scene.restart("Level");
              }
            });
          }
        }, this);
        
        if(gameState.logo.y > (this.map2.height+20)*scaling*48) {  
        this.cameras.main.shake(500, 1, false, function(camera, progress) {
          if(progress > 0.9) {
            gameState.deaths += 1;
            this.music.stop();
            if(gameState.multiplayer) {
              socket.emit('deleteOldPlayer', socket.id);
            };
            this.scene.restart("Level");
          }
        });
      };
        if(keys.Escape.isDown) {
          console.log("Escaping")
          this.scene.pause();
          this.music.stop();
          this.scene.launch("Menu");
        };
        if(gameState.multiplayer) {
          if(this.sendDatacd < time) {
            var x = Math.floor(gameState.logo.body.x);
            var y = Math.floor(gameState.logo.body.y);
            if (gameState.logo.body.oldPosition && (x !== gameState.logo.body.oldPosition.x || y !== gameState.logo.body.oldPosition.y)) {
              var dataN = { x: gameState.logo.body.x, y: gameState.logo.body.y, room: yourRoom, anim: gameState.logo.getFirst().CURRENTANIM, flipX: gameState.body.CURRENTFLIPX, levelR: gameState.currLevel, hatAnim: cHatIndex};
              console.log(dataN.flipX);
              socket.emit('playerMovement', dataN);
            };
            // save old position data
            gameState.logo.body.oldPosition = {
              x: gameState.logo.body.x,
              y: gameState.logo.body.y,
            };
            this.sendDatacd = time+35;
          };
        };
      };
      addOtherPlayers(self, playerInfo) {
        //console.log(this);
        var otherPlayerS = this.add.sprite(0, 0, 'logo').setDisplaySize(72, 90);
        otherPlayerS.name = "animSprite";
        otherPlayerS.setTint("0x878787");
        var otherPlayerH = this.add.sprite(0,-28,'hats').setTint("0x878787").setScale(1.4).anims.play('defHat');
        var otherPlayer = this.add.container(0,0, [otherPlayerS,otherPlayerH]).setDepth(2);
        otherPlayer.userLabel = this.add.text(0, 0, playerInfo.userNamer, { align: "center", font: "16px Arial", fill: "#FFFF00" }).setDepth(2);
        otherPlayer.animSpriteLL = otherPlayerS;
        otherPlayer.animSpriteLL.anims.play("idle");
        otherPlayer.animSpriteHH = otherPlayerH;
        otherPlayer.playerId = playerInfo.playerId;
        this.otherPlayers.add(otherPlayer);
      }
    };

/*class Level1 extends Level {
	constructor() {
		super("Level1");
    this.mapState = "blackBrick";
	  this.map = [
      [0,0,0,0,0,0,0,0,0,0,6,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,1,3,0,0],
      [6,6,6,6,6,0,"Might Need To Be...\n\n 'Dashing'",1,1,0,6,1,0,0],
      [0,0,4,4,"Sometimes, Timing And Placement Are Key",7,0,6,1,0,6,6,0,0],
      [1,0,6,1,6,1,8,6,1,0,6,6,0,8],
      [1,9,"Tacos Are Checkpoints!\nAll Death Returns To Taco....",7,"\tThese Guys Won't Move\nTowards You, But They REALLY Hurt\nIf You Touch em'\nOh Also, Don't Touch Anything Red!\n(It's Ketchup... I Swear)",0,6,0,1,0,6,0,0,"Make Some Space Before Dashing To Land Some Jumps!"],
      [2,8,5,6,5,0,1,0,1,0,6,5,0,8],
      ["READ ALL NOTES OR ELSE","\tPress Shift to Dash In The Direction\nYou Are Running!\nFor Example, Holding Shift Alone Does\nNothing, But If You Are Pressing\nShift And Left, Then You Dash To The Left!",0,0,"Green Blocks Give You\na Jump Boost!",0,1,0,1,0,7,9,0,1],
      [1,3,0,1,8,"\tHolding Jump While\nRunning Into a Wall\nWill Make You Jump\nOff of it!",1,0,1,1,6,1,8,1],
    ];
	}
}

class Level2 extends Level {
  constructor() {
    super("Level2");
    this.mapState = "adobe";
    this.map = [
      [1,2,"Sliding Down Walls Slows\nYou Down While Holding\nThe Respective Directional\nKey...",1,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,"And Only If You Actively\nRun Into A Red Block\nWill It Restart You!\n\nThat Means You Can Fall\nAlongside It!",1,0,0,0,0,0,0,6,0,0,0,0],
      [0,6,7,6,0,0,0,0,0,0,6,0,0,0,3],
      [0,6,0,6,0,0,0,0,0,0,6,0,1,0,1],
      [0,6,0,6,1,1,1,1,1,1,6,0,0,7,1],
      [0,6,0,6,0,0,0,0,0,0,0,0,1,1,1],
      [0,1,0,1,1,0,6,0,0,0,0,0,6,1,1],
      [0,1,0,7,0,0,6,0,0,4,1,8,1,1,1],
      [0,1,6,1,1,8,6,6,1,1,1,1,1,1,1],
    ]
  }
}

class Level3 extends Level {
	constructor() {
		super("Level3");
    this.mapState = "adobe";
	  this.map = [
      [1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [3,0,0,6,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [5,0,4,6,1,0,1,1,6,0,1,0,0,1,0,0,0,0,0,0,0],
      [0,4,0,6,1,0,1,5,0,7,6,0,0,1,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,1,4,0,8,1,0,0,1,0,0,0,0,0,0,0],
      [0,8,4,0,1,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,1,6,0,9,0,1,1,6,4,1,0,0,1,0,0,0,0,0,0,0],
      [0,1,1,1,8,1,5,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,0,0,9,0,0,4,1,1,1,1,8,1,1,0,0,0,0,0,0,0],
      [0,0,1,1,1,1,1,6,0,0,0,0,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,8,1,0,6,1,0,6,0,1,4,0,0,0,0,0,0,0,0,0,0],
      [0,1,0,0,0,1,0,0,0,0,1,1,4,9,0,0,0,0,0,0,0],
      [0,1,1,8,1,1,8,1,6,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,1,0,1,1,1,0,6,0,0,0,0,1,1,8,1,1,6,1,0,0],
      [0,1,0,0,0,1,0,1,0,0,0,0,1,1,6,1,1,1,1,8,0],
      [0,0,0,1,1,1,0,1,0,0,1,0,1,1,0,7,0,0,0,0,0],
      [0,1,0,4,5,1,0,1,0,0,0,0,1,0,0,1,1,0,0,1,8],
      [0,2,7,1,0,1,0,0,0,1,1,0,6,1,0,0,0,0,0,0,0],
      [0,1,1,1,0,1,0,1,0,1,0,0,0,9,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,1,1,0,0,1,8,0,0,0,0,0,100],
    ];
  }
}

class Level4 extends Level {
	constructor() {
		super("Level4");
    this.mapState = "adobe";
	  this.map = [
      [0,0,6,6,6,6,6,6,6,0,0,0,0],
      [6,3,0,6,6,0,0,10,6,0,0,0,0],
      [1,1,0,0,0,0,6,10,6,0,0,0,0],
      [0,1,8,4,4,4,6,10,6,0,0,0,0],
      [6,6,6,6,6,6,6,10,6,0,0,0,0],
      [0,10,10,10,10,10,10,10,6,0,0,0,0],
      [10,6,6,6,6,6,6,6,6,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0],
      [8,1,6,10,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,2,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,0,8,0,0,0,0,0,0,0,0,0],
    ];
	}
}

class Level5 extends Level {
	constructor() {
		super("Level5");
    this.mapState = "adobe";
	  this.map = [
      [10,0,0,0,0],
      [10,0,0,0,0],
      [0,0,0,6,0],
      [2,0,0,6,3],
      [8,0,0,6,1],
    ];
	}
}

class Level6 extends Level {
	constructor() {
		super("Level6");
    this.mapState = "adobe";
	  this.map = [
      [2,0,0,0,0],
      [1,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [6,6,0,6,6],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [6,0,6,6,6],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [6,6,6,0,6],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,6,6,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,6,0,6],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,6,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,7,0],
      [0,0,0,6,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,6,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [6,0,6,6,6],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,3,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
    ];
	}
}*/

    const config = {
        type: Phaser.AUTO,
        width: 500*(window.innerWidth/window.innerHeight),
        height: 500,
        backgroundColor: "#87CEEB",
        scene: [Start, Level, ResultL, Menu, hatMenu],
        stableSort: true,
        physics: {
          default: 'arcade',
          arcade: {
           enableBody: true,
            gravity: { y: 2000 },
            //debug: true,
          }
        },
      render: {
        pixelArt: true
      },
        fps: {
          target: 70,
          forceSetTimeOut: true
        },
    };

function selectLevel(level) {
  gameState.currLevel = level;
  sceneControllerExternal.start("Level");
  document.getElementById("levelSelect").style.zIndex = -1000;
}

function unlockAll() {
        
}

const game = new Phaser.Game(config);

function addOtherPlayers(self, playerInfo) {
  //console.log(self);
  var otherPlayer = self.add.sprite(0, 0, 'logo').setDisplaySize(72, 90);
  otherPlayer.playerId = playerInfo.playerId;
  otherPlayer.userLabel = this.add.text(0, 0, playerInfo.userNamer, { font: "16px Arial", fill: "#FFFF00" });
  //otherPlayer.setTint("0x111111");
  self.otherPlayers.add(otherPlayer);
}