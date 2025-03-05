let ash;
let cursors;
let me;
let walkSoundIsPlaying = false;
let lastMove = 0;

class PokemonScene extends Phaser.Scene {


    constructor() {
        super({ key: 'PokemonScene' });
    }

    preload() {
        this.load.tilemapTiledJSON('map', './assets/poke_map.json');  // Load the TMX file
        this.load.image('tiles', './assets/First Asset pack.png');  // Load the tileset image
        this.load.image('collision', './assets/collision.png');  // Load the collision image
        this.load.spritesheet('ash', './assets/boss.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('me', './assets/ACharDown.png', { frameWidth: 24, frameHeight: 24});
        this.load.audio('townMusic', './assets/audio/town.wav');
        this.load.audio('path_walk', './assets/audio/path_walk.wav');
        this.load.audio('battleMusic', './assets/audio/battleMusic.mp3');
        this.load.audio('battleIntroMusic', './assets/audio/battleIntroMusic.mp3');
    }

    create() {

        // Create Ash
        ash = this.physics.add.sprite(336, 270, 'ash').setScale(0.5, 0.5);
        ash.setCollideWorldBounds(true);
        ash.setBounce(0.2); 
        ash.setDepth(10);

        // Create me
        me = this.physics.add.sprite(336, 60, 'me').setScale(1, 1);
        me.setDepth(10);

        // In your create method, after loading the map:
        const map = this.make.tilemap({ key: 'map', tileWidth: 12, tileHeight: 12});
        const tileset = map.addTilesetImage('pokemap', 'tiles');
        const tilesetCollision = map.addTilesetImage('collision', 'collision');

        // Add layers in order
        const collisionLayer = map.createLayer('collision', tilesetCollision);
        const waterLayer = map.createLayer('water', tileset);
        const grassLayer = map.createLayer('grass', tileset);
        const bridgeLayer = map.createLayer('bridge', tileset);
        const treesLayer = map.createLayer('trees', tileset);
        const housesLayer = map.createLayer('houses', tileset);
        const pathLayer = map.createLayer('path', tileset);
        const plateauLayer = map.createLayer('plateau', tileset);

        // Set the camera to follow the player
        this.cameras.main.startFollow(ash); // This follows the 'ash' sprite
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // Set camera bounds to match the map size
        this.cameras.main.setZoom(3);  // Zoom out to show more of the map
        collisionLayer.setCollisionByExclusion([-1]);
        this.physics.add.collider(ash, collisionLayer);
        me.setImmovable(true);
        this.physics.add.collider(ash, me);

        // Start music
        this.townMusic = this.sound.add('townMusic', { loop: true, volume: 0.5 });
        this.townMusic.play();

        this.walkSound = this.sound.add('path_walk', { loop: true, volume: 1 });
        this.walkSound.setRate(2);


        // Set ash's animations

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('ash', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'normalDown',
            frames: this.anims.generateFrameNumbers('ash', { start: 1 , end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'normalUp',
            frames: this.anims.generateFrameNumbers('ash', { start: 5 , end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'normalLeft',
            frames: this.anims.generateFrameNumbers('ash', { start: 9 , end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'normalRight',
            frames: this.anims.generateFrameNumbers('ash', { start: 13 , end: 13 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('ash', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('ash', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('ash', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'blink',
            frames: [
                { key: 'me', frame: 0 },
                { key: 'me', frame: 1 }
            ],
            frameRate: 1, // Adjust speed (frames per second)
            repeat: -1 // Loop forever
        });

        me.play('blink');

        // Enable collisions
        
        // Keyboard controls
        cursors = this.input.keyboard.createCursorKeys();
        // Add Enter key detection
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        // Movement
        if (cursors.left.isDown) {
            ash.setVelocityX(-80);
            lastMove = 1;
            ash.anims.play('left', true);
            if (!walkSoundIsPlaying) {
                this.walkSound.play();
                walkSoundIsPlaying = true;
            }
        } 
        else if (cursors.right.isDown) {
            ash.setVelocityX(80);
            lastMove = 3;
            ash.anims.play('right', true);
            if (!walkSoundIsPlaying) {
                this.walkSound.play();
                walkSoundIsPlaying = true;
            }
        } 
        else if (cursors.up.isDown) {
            ash.setVelocityY(-80);
            lastMove = 2;
            ash.anims.play('up', true);
            if (!walkSoundIsPlaying) {
                this.walkSound.play();
                walkSoundIsPlaying = true;
            }
        }
        else if (cursors.down.isDown) {
            ash.setVelocityY(80);
            lastMove = 0;
            ash.anims.play('down', true);
            if (!walkSoundIsPlaying) {
                this.walkSound.play();
                walkSoundIsPlaying = true;
            }
        }
        else if (this.enterKey.isDown) {
            const distance = Phaser.Math.Distance.Between(ash.x, ash.y, me.x, me.y);
            console.log("distance: " + distance);
            if (distance <= 30) {
                this.scene.start('BattleScene');
                ash.anims.play('down', true);
                this.townMusic.stop();
                if (walkSoundIsPlaying) {
                    this.walkSound.stop();
                    walkSoundIsPlaying = false;
                }
            }
        }
        else {
            ash.setVelocityX(0);
            ash.setVelocityY(0);
            if (lastMove == 0) {
                ash.anims.play('normalDown', true);
            }
            else if (lastMove == 1) {
                ash.anims.play('normalLeft', true);
            }
            else if (lastMove == 2) {
                ash.anims.play('normalUp', true);
            }
            else if (lastMove == 3) {
                ash.anims.play('normalRight', true);
            }
            if (walkSoundIsPlaying) {
                this.walkSound.stop();
                walkSoundIsPlaying = false;
            }
        }
    }
}

export default PokemonScene;