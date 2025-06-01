var Phaser;
var PhaserNavMeshPlugin;
var ctx;
console.log("jar")

class Main extends Phaser.Scene {
    constructor() {
        super("Main");
    }
    preload() {

    }
    create() {
        ctx = this;
        this.floor = this.matter.add.rectangle(100,100,1000, 20, 0xFFFFFF, {
            isStatic: true,
        });
    }
    update() {

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