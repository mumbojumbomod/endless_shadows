class preScene extends Phaser.Scene {
  constructor() {
    super({ key: 'preScene' });
  }
  preload() {
    this.load.spritesheet('codey', 'codey.png', { frameWidth: 72, frameHeight: 90 });
    this.load.image('Z', 'Z.png');
    this.load.image('circle', '33*33circle.png');
    this.load.audio('music', ['composition.mp3', 'composition.ogg'])

  }//\n
  createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('codey', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
  }
  create() {
    this.createAnimations();
    this.add.text(20, 150, 'Endless Shadows', { fontSize: '50px', fill: '#ff00fb' });
    this.add.text(150, 200, 'By Talus', { fontSize: '30px', fill: '#ff00fb' });
    this.add.text(60, 250, 'Can you defeat the darkness?', { fontSize: '20px', fill: '#ff00fb' });
    this.add.text(160, 300, 'Click to start.', { fontSize: '15px', fill: '#ff00fb' });
    gameState.circle = this.add.sprite(230, 350, 'circle').setScale()//20, 100
    gameState.z = this.add.sprite(285, 217, 'Z').setScale(2.5).setAlpha(5)//20, 100
    gameState.player = this.add.sprite(230, 340, 'codey').setScale(.5)//20, 100
    gameState.player.anims.play('run', true);
    this.input.on('pointerup', () => {
      // Add your code below:
      this.scene.stop('preScene')
      this.scene.start('Level')
      gameState.player.anims.play('run', false);
    });
    const musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }
    gameState.music = this.sound.add('music', musicConfig);
    gameState.music.play();
  }
  update() {
  }
}
class dead extends Phaser.Scene {
  constructor() {
    super({ key: 'dead' });
  }
  preload() {
  }//\n

  create() {
    function chooseDeathString() {
      let bingo = Math.floor(Math.random() * 5)
      let stringArray = ['After failing so miserably, and with\n your soul ripped from your chest,\n you have nothing left do but to wander\n around and turn into nothing more than\n a shadow.', 'As the light was sucked from your body,\n the darkness, with nothing to hold it\n back, fully took hold over the world.', 'As you died, your bright soul turned\n a shade of black, and dissolved\n into nothing.', 'The darkness, freed from its eternal\n prison, has now comlpetely eradicated\n happiness and light from the world.', 'As your eternal light is finally\n extinguished, you realize one important\n fact: That your life was meaningless,\n because you accomplished nothing.\n                            -b00kNerd']
      return stringArray[bingo]
    }
    this.add.text(20, 150, chooseDeathString(), { fontSize: '20px', fill: '#ff00fb' });
    this.add.text(120, 300, 'Click to try again', { fontSize: '20px', fill: '#ff00fb' });
    this.input.on('pointerup', () => {
      this.scene.stop('dead')
      this.scene.start('Level')

    });
  }
  update() {
  }
}
class win extends Phaser.Scene {
  constructor() {
    super({ key: 'win' });
  }
  preload() {
  }//\n
  create() {
    this.add.text(20, 150, 'As you raise the final relic, your soul\n combines with its power, the darkness\n dissolves away.\n The souls who have been drained revert\n to their original state.\n The world is once again full of color.', { fontSize: '20px', fill: '#ff00fb' });
    this.add.text(20, 300, 'If you managed to get this far,\n than you are smart and resiliant!\n Good job!\n Take a screenshot, and you have full bragging\n rights!', { fontSize: '17px', fill: '#ff00fb' });
    this.add.text(20, 400, 'Click to play again', { fontSize: '12px', fill: '#ff00fb' });
    this.input.on('pointerup', () => {
      this.scene.stop('win')
      this.scene.start('Level')
      gameState.spawnPointX = 20
      gameState.spawnPointY = 100
    });
  }
  update() {
  }
}
class Level extends Phaser.Scene {

  constructor(key) {
    super({ key: 'Level' });
    this.levelKey = key
    this.nextLevel = {
      'Level1': 'Level2',
      'Level2': 'Level3',
      'Level3': 'Level4',
    }
  }

  preload() {
    this.load.audio('jump', 'noise/death.mp3');
    this.load.spritesheet('campfire', 'campfire.png',
      { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('codey', 'codey.png', { frameWidth: 72, frameHeight: 90 });
    this.load.image('blaad', 'blaad.png');
    this.load.image('bg1', 'trees.png');
    this.load.image('bg2', 'mountain.png');
    this.load.image('bg3', 'snowdunes.png');
    this.load.image('DABG', 'background.png');
    this.load.image('lantern', 'lantern.png');
    this.load.image('spikes', 'spikes.png');
    this.load.image('lightlessSoul', 'lightlessSoul.png');//light
    this.load.image('light', 'light.png');//light
    this.load.image('tiles', ['16x16_Tile_pack_no_background.png', 'NormalMap.png']);
    this.load.tilemapTiledJSON('map', 'shadow1.json');
  }
  create() {
    this.createParallaxBackgrounds();
    gameState.jump = this.sound.add('jump');
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('16x16_Tile_pack_no_background', 'tiles');
    const ambient = map.createLayer('ambient', tileset).setPipeline('Light2D')

    this.lights.enable()//.setAmbientColor(0xffffff);
    gameState.active = true
    gameState.player = this.physics.add.sprite(gameState.spawnPointX, gameState.spawnPointY, 'codey').setScale(.5)//20, 100

    gameState.player.anims.play('run', false);
    gameState.player.body.setSize(gameState.player.width - 40, gameState.player.height - 50).setOffset(20, 50);
    gameState.player.setBounce(.2)
    gameState.playerLight = this.lights.addLight(0, 0, 100, 0xff00e6, 3.3)
    gameState.platforms = map.createLayer('platforms', tileset, 0, 0).setPipeline('Light2D')//.setScale(0.9);
    gameState.platforms.setCollisionByExclusion(-1, true);
    this.physics.add.collider(gameState.player, gameState.platforms);
    this.createAnimations();
    this.levelSetup();
    const game_height = parseFloat(gameState.bg3.getBounds().height)//da height of BG3
    this.cameras.main.setBounds(0, 0, gameState.bg3.width, game_height);
    this.physics.world.setBounds(0, 0, gameState.width, gameState.bg3.height + gameState.player.height);

    this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)
    gameState.player.setCollideWorldBounds(true);
    gameState.cursors = this.input.keyboard.createCursorKeys();


    ////spikes
    this.spikes = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    const spikeObjects = map.getObjectLayer('spikes')['objects'];
    spikeObjects.forEach(spikeObject => {
      const spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spikes').setOrigin(0, 0).setPipeline('Light2D');
    });
    this.physics.add.overlap(gameState.player, this.spikes, () => {
      gameState.player.body.destroy();
      this.anims.pauseAll();
      trapblood()
      let timer = this.time.addEvent({
        delay: 500,
        callback: () => {
          this.physics.pause();
          this.anims.resumeAll();
          //gameState.jump.play();
          this.cameras.main.shake(300, .05, false, function (camera, progress) {
            if (progress > .9) {
              this.scene.stop('Level')
              this.scene.start('dead')
            } else if (progress >= 1) {
              gameState.player.x = gameState.spawnPointX
              gameState.player.y = gameState.spawnPointY
            }
          })
        }
      })
    });
    gameState.particles = this.add.particles('blaad')
    /////spikes
    function trapblood() {
      gameState.emitter = gameState.particles.createEmitter({

        x: gameState.player.x,
        y: gameState.player.y + 10,
        speedX: { min: -30, max: 30 },
        speedY: { min: 50, max: 200 },
        scale: { start: 1, end: 0 },
        lifespan: 600,
        frequency: 25,
        quantity: 0.5,
        gravityY: 200,
      })
    }
    gameState.pain = function (x, y) {
      gameState.pained = gameState.particles.createEmitter({

        x: x,
        y: y,
        speedX: { min: -30, max: 30 },
        speedY: { min: 50, max: 200 },
        scale: { start: 1, end: 0 },
        lifespan: 600,
        frequency: 25,
        quantity: 0.5,
        gravityY: 200,
      })
    }
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#000000");
    ///theshadow
    gameState.shadow = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    gameState.shadowobject = map.getObjectLayer('shadow')['objects'];
    gameState.shadowobject.forEach(shadowject => {
      let shadowconst = gameState.shadow.create(shadowject.x, shadowject.y - shadowject.height, 'lightlessSoul').setOrigin(0, 0).setPipeline('Light2D')
      shadowconst.y -= 15;
    });
    this.physics.add.overlap(gameState.player, gameState.shadow, () => {
      gameState.player.body.destroy();
      this.anims.pauseAll();
      trapblood()
      let timer = this.time.addEvent({
        delay: 500,
        callback: () => {
          this.physics.pause();
          this.anims.resumeAll();
          //gameState.jump.play();
          this.cameras.main.shake(300, .05, false, function (camera, progress) {
            if (progress > .9) {
              this.scene.stop('Level')
              this.scene.start('dead')
            } else if (progress >= 1) {
              gameState.player.x = gameState.spawnPointX
              gameState.player.y = gameState.spawnPointY
            }
          })
        }
      })
    });
    gameState.shadows = [];//array of enemies
    gameState.shadow.children.iterate(function (child) {
      gameState.shadows.push(child)
    });
    gameState.moveTween = this.tweens.add({
      targets: gameState.shadows,
      x: '-=60',
      ease: 'Linear',
      flipX: true,
      duration: 1000,
      repeat: -1,
      yoyo: true
    });
    //theshadow  
    //Relics
    this.relics = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    const relicObjects = map.getObjectLayer('relics')['objects'];
    relicObjects.forEach(relicject => {
      const spike = this.relics.create(relicject.x, relicject.y - relicject.height, 'lantern').setOrigin(0, 0)
      this.lights.addLight(relicject.x, relicject.y, 200, 0xff00e6, 6.3)
    });
    this.physics.add.overlap(gameState.player, this.relics, function (body1, body2) {
      //gameState.lightSpray()
      /*this.cameras.main.fade(800, 255, 107, 233, false, function (camera, progress) {
        if (progress >= 1) {
          this.scene.stop('Level')
          this.scene.start('win')
          //this.scene.start(this.nextLevel[this.levelKey]);
        }
      });*/
      gameState.spawnPointX = body2.x;
      gameState.spawnPointY = body2.y;
    }, null, this);

    //relics
    //Relics2
    this.relics2 = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    const relicObjects2 = map.getObjectLayer('relics2')['objects'];
    relicObjects2.forEach(relicject2 => {
      const spike2 = this.relics2.create(relicject2.x, relicject2.y - relicject2.height, 'lantern').setOrigin(0, 0)
      this.lights.addLight(relicject2.x, relicject2.y, 200, 0xff00e6, 6.3)
    });
    this.physics.add.overlap(gameState.player, this.relics2, function (body1, body2) {
      this.anims.pauseAll();
      gameState.lightSpray()
      let timer = this.time.addEvent({
        delay: 500,
        callback: () => {
          this.physics.pause();
          this.anims.resumeAll();
          this.cameras.main.fade(800, 255, 107, 233, false, function (camera, progress) {
            if (progress >= 1) {
              this.scene.stop('Level')
              this.scene.start('win')
            }
          });
        }
      })
    }, null, this);

    //relics2
    gameState.fpstext = this.add.text(20, 100, ``, { fontSize: '20px', fill: '#ff00fb' });
    gameState.fpstext.setScrollFactor(0)
  }

  createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('codey', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'attak',
      frames: this.anims.generateFrameNumbers('codey', { start: 3, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('codey', { start: 4, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('codey', { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'fire',
      frames: this.anims.generateFrameNumbers('campfire'),
      frameRate: 10,
      repeat: -1
    })
  }

  createParallaxBackgrounds() {
    gameState.bg = this.add.image(0, 0, 'DABG').setPipeline('Light2D').setScale(2);
    //gameState.bg1 = this.add.image(0, 0, 'bg1');
    //gameState.bg2 = this.add.image(0, 0, 'bg2');
    gameState.bg3 = this.add.image(0, 0, 'bg3').setPipeline('Light2D');

    //gameState.bg1.setOrigin(0, 0);
    //gameState.bg2.setOrigin(0, 0);
    gameState.bg3.setOrigin(0, 0);
    gameState.bg.setOrigin(0, 0);

    const game_width = parseFloat(gameState.bg3.getBounds().width)
    gameState.width = game_width;
    const window_width = config.width

    //const bg1_width = gameState.bg1.getBounds().width
    //const bg2_width = gameState.bg2.getBounds().width
    const bg3_width = gameState.bg3.getBounds().width
    const bg_width = gameState.bg.getBounds().width

    //gameState.bg1.setScrollFactor((bg1_width - window_width) / (game_width - window_width));
    //gameState.bg2.setScrollFactor((bg2_width - window_width) / (game_width - window_width));
    gameState.bg.setScrollFactor((bg_width - window_width) / (game_width - window_width));
  }

  levelSetup() {
    // Create the campfire at the end of the level
    gameState.hallowed_light = this.add.particles('light')
    /////spikes
    gameState.thing = this
    gameState.lightSpray = function () {
      gameState.emitter = gameState.hallowed_light.createEmitter({
        x: gameState.player.x,
        y: gameState.player.y + 10,
        speedX: { min: -200, max: 200 },
        speedY: { min: -200, max: 200 },
        scale: { start: 1, end: 0 },
        lifespan: 600,
        frequency: 25,
        quantity: 0.5,

      })
    }
    /*gameState.goal = this.lights.addLight(gameState.width - 40 + 10, 110, 200, 0xff00e6, 6.3)
    gameState.lantern = this.physics.add.sprite(gameState.width - 40 + 16, 9.9, 'lantern')//.setScale(1);
    this.physics.add.collider(gameState.lantern, gameState.platforms);
    this.physics.add.overlap(gameState.player, gameState.lantern, function () {
      //gameState.lightSpray()
      /*this.cameras.main.fade(800, 255, 107, 233, false, function (camera, progress) {
        if (progress >= 1) {
          this.scene.stop('Level')
          this.scene.start('win')
          //this.scene.start(this.nextLevel[this.levelKey]);
        }
      });*/
    /*gameState.spawnPointX = 1950;
    gameState.spawnPointY = 100;
  }, null, this);*/

  }

  update() {
    gameState.fps = this.sys.game.loop.actualFps
    gameState.fps = Math.floor(gameState.fps)
    //gameState.fpstext.setText(gameState.fps)
    if (gameState.active) {
      if (gameState.cursors.right.isDown) {
        gameState.player.flipX = false;
        gameState.player.setVelocityX(gameState.speed);
        gameState.player.anims.play('run', true);
      } else if (gameState.cursors.left.isDown) {
        gameState.player.flipX = true;
        gameState.player.setVelocityX(-gameState.speed);
        gameState.player.anims.play('run', true);
      } else {
        gameState.player.setVelocityX(0);
        gameState.player.anims.play('idle', true);
      }

      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.up) && gameState.player.body.onFloor()) {
        gameState.player.anims.play('jump', true);
        gameState.player.setVelocityY(-500);
      } else {
        //this.sound.stopAll();
      }

      if (!gameState.player.body.onFloor()) {
        gameState.player.anims.play('jump', true);
        //this.cameras.main.shake(100, .01, false, function(camera, progress){})
      }

      if (gameState.player.y > gameState.bg3.height) {
        this.physics.pause();
        //gameState.jump.play();
        this.cameras.main.shake(1000, .01, false, function (camera, progress) {
          if (progress > .9) {
            this.scene.stop('Level')
            this.scene.start('dead')
          } else if (progress >= 1) {
            gameState.player.x = gameState.spawnPointX
            gameState.player.y = gameState.spawnPointY
          }
        });
      }
    }
    gameState.playerLight.x = gameState.player.x;
    gameState.playerLight.y = gameState.player.y;
  }
}
const gameState = {
  speed: 240
};
gameState.spawnPointX = 20;
gameState.spawnPointY = 100;
const config = {
  type: Phaser.WEBGL,
  width: 500,
  height: 600,
  scale: { mode: Phaser.Scale.FIT },
  fps: { target: 60 },
  backgroundColor: "#000000",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      enableBody: true,
      debug: false,

    }
  },
  scene: [preScene, Level, dead, win]
};

const game = new Phaser.Game(config);


