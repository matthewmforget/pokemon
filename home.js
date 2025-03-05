let cursors;
let texts = [
    "Welcome to my page.",
    "This is a fun little Pokemon style game I made.",
    "To move around, use the arrow keys on your keyboard.",
    "Follow the dirt path upward, and approach me, then press Enter to talk to me!",
    "See you then!"
];
let currentPos = 0;
let text;
let isTyping = false;
let typingTimer;

class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });  
    }

    preload() {
        this.load.image('background', './assets/main_screen.png');
        this.load.image('oak', './assets/me_still.png');
        this.load.image('menuBox', './assets/menu_box.png');
        this.load.audio('enter', './assets/audio/enter.mp3');
        this.load.audio('intro', './assets/audio/intro_song.mp3');
    }

    create() {
        //this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);

        const oak = this.add.image(-200, this.cameras.main.height / 3, 'oak').setScale(7);

        this.tweens.add({
            targets: oak,
            x: this.cameras.main.width / 2, 
            duration: 2000, 
            ease: 'Power2'
        });

        // Set up audio objects
        this.enterSound = this.sound.add('enter', { loop: false, volume: 0.5 });
        this.introSong = this.sound.add('intro', { loop: true, volume: 0.5 });
        this.introSong.play();

        const menuBox = this.add.image(this.cameras.main.width / 2, this.cameras.main.height - 150, 'menuBox')
            .setScale(1.2, 0.7)
            .setOrigin(0.5, 0.5);

        text = this.add.text(menuBox.x, menuBox.y - 10, "", {
            fontSize: '18px',
            fontFamily: '"Press Start 2P"',
            fill: '#000000',
            wordWrap: { width: 400 }
        });

        text.setOrigin(0.5, 0.5);

        // Keyboard controls
        cursors = this.input.keyboard.createCursorKeys();
        // Add Enter key detection
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.typeText();
    }

    typeText() {
        if (currentPos >= texts.length) return;
        
        isTyping = true;
        let fullText = texts[currentPos];
        let displayText = "";
        let index = 0;

        if (typingTimer) typingTimer.remove();

        typingTimer = this.time.addEvent({
            delay: 50, // Typing speed
            callback: () => {
                if (index < fullText.length) {
                    displayText += fullText[index];
                    text.setText(displayText);
                    index++;
                } else {
                    isTyping = false;
                    typingTimer.remove();
                }
            },
            loop: true
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.enterSound.play();
            if (currentPos >= 4) {
                this.introSong.stop();
                this.scene.start('PokemonScene');
            }
            if (isTyping) {
                text.setText(texts[currentPos]); 
                isTyping = false;
                typingTimer.remove();
            } else {
                currentPos++;
                if (currentPos < texts.length) {
                    this.typeText();
                }
            }
        }
    }
}

export default HomeScene;