// For about section
let cursors;
let texts = [
    "So you wanna know about me, huh? Well, okay. My name is Matthew Forget, I'm from Mississauga, Ontario",
    "I'm a computer science graduate, from York University!",
    "I specialize in machine learning, with a TensorFlow Developer certificate from DeepLearning AI",
    "I built this website using Phaser, an open source javascript project for 2D game development, and the help of chat GPT.",
    "I love chess, and chess bots, and bots. I plan to make a chess bot to rule all chess bots!",
    "Beyond chess, I've worked on AI-powered mutation testing, comparing LLM-generated code mutations with PIT.",
    "I've built multiple AU audio/midi plugins like an arpeggiator, reverb, and delay—combining my love for music and programming.",
    "I also developed a parking booking system, showcasing my skills in software engineering and design patterns.",
    "My experience includes real world machine learning applications, from heart failure prediction models to computer vision.",
    "Check out my github using the github link below for more info on my projects!"
];
let currentPos = 0;
let text;
let isTyping = false;
let typingTimer;
let aboutMe = false;
let bubble;

class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });  // Unique key for the scene
    }

    preload() {
        this.load.image('bg', './assets/battle.png'); // Load a battle background
        this.load.spritesheet('ash', './assets/boss.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('me', './assets/ACharDown.png', { frameWidth: 24, frameHeight: 24});
        this.load.image('menu_box', './assets/menu_box.png');
        this.load.image('speech', './assets/speech_bubble.png');
        // this.load.audio('battleMusic', './assets/audio/battleMusic.mp3');
    }

    create() {
        const bg = this.add.image(0, 0, 'bg');
        bg.setDisplaySize(window.innerWidth, window.innerHeight);
        bg.setOrigin(0, 0); 

        // Play intro music
        this.battleIntroMusic = this.sound.add('battleIntroMusic', { loop: false, volume: 0.5 });
        this.battleIntroMusic.play();

        // Set up enter sound
        this.enterSound = this.sound.add('enter', { loop: false, volume: 0.5 });

        // After 3 seconds, play battle music
        this.time.delayedCall(2580, () => {
            this.battleMusic = this.sound.add('battleMusic', { loop: true, volume: 0.7 });
            this.battleMusic.play();
        });

        const ash = this.add.sprite(window.innerWidth - 100, window.innerHeight / 1.3, 'ash').setScale(9,9);
        const me = this.add.sprite(window.innerWidth + 100, window.innerHeight / 2.1, 'me').setScale(9,9);

        // Animations
        this.anims.create({
            key: 'battleMode',
            frames: this.anims.generateFrameNumbers('ash', { start: 5 , end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'meBattle',
            frames: [
                { key: 'me', frame: 0 },
                { key: 'me', frame: 1 }
            ],
            frameRate: 1, // Adjust speed (frames per second)
            repeat: -1 // Loop forever
        });

        me.anims.play('meBattle');
        ash.anims.play('battleMode');

        // Create a tween to move it to the desired position
        this.tweens.add({
            targets: ash,           // The object to animate
            x: window.innerWidth / 3.7, // Destination X position (adjust as needed)
            duration: 2000,           // Animation time in milliseconds (2 seconds)
            ease: 'Power2',           // Smoother easing effect
        });

        this.tweens.add({
            targets: me,           // The object to animate
            x: window.innerWidth / 1.34, // Destination X position (adjust as needed)
            duration: 2000,           // Animation time in milliseconds (2 seconds)
            ease: 'Power2',           // Smoother easing effect
        });

        // Menu 

        // Create the menu box (bottom right corner)
        const boxX = this.cameras.main.width - 650 - 20;  // Adjust based on your image size
        const boxY = this.cameras.main.height - 170 - 55; 

        this.menuBox = this.add.image(boxX, boxY, 'menu_box').setOrigin(0, 0).setScale(0.9, 0.6);  // Adjust scale if necessary

        // Menu options
        this.options = [
            this.createMenuOption("LinkedIn", boxX + 90, boxY + 50, this.linkedinAction),
            this.createMenuOption("Github", boxX + 370, boxY + 50, this.githubAction),
            this.createMenuOption("Resume", boxX + 90, boxY + 150, this.resumeAction),
            this.createMenuOption("About me", boxX + 370, boxY + 150, this.aboutmeAction),
            this.createMenuOption("RUN", boxX + 280, boxY + 100, this.runAction)
        ];

        // Speech bubble
        bubble = this.add.image(window.innerWidth / 2 - 450, window.innerHeight / 2 - 400, 'speech')
            .setOrigin(0, 0)
            .setScale(1.5, 1.7);
        bubble.setDepth(2);
        bubble.setVisible(false);

        // Adjust text position to be inside the bubble
        const textPaddingX = 120; // Padding from the left of the bubble
        const textPaddingY = 140; // Padding from the top of the bubble

        text = this.add.text(bubble.x + textPaddingX, bubble.y + textPaddingY, "", {
            fontSize: '18px',
            fontFamily: '"Press Start 2P"',
            fill: '#000000',
            wordWrap: { width: bubble.displayWidth - textPaddingX * 2 } // Ensure text wraps inside the bubble
        });
        text.setOrigin(0, 0);
        text.setDepth(3);


        // Keyboard controls
        cursors = this.input.keyboard.createCursorKeys();
        // Add Enter key detection
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    }

    // Methods to deal with box options

    createMenuOption(text, x, y, callback) {
        let option = this.add.text(x, y, text, {
            fontSize: '25px',
            fontFamily: '"Press Start 2P"',
            fill: '#000000'
        }).setInteractive();

        // Change color on hover
        option.on('pointerover', () => option.setFill('#ffff00'));
        option.on('pointerout', () => option.setFill('#000000'));

        // Trigger function when clicked
        option.on('pointerdown', callback.bind(this));

        return option;
    }

    // Empty functions for actions
    linkedinAction() {
        window.open('https://www.linkedin.com/in/matthew-forget-14684a346/', '_blank');
    }

    githubAction() {
        window.open('https://www.github.com/matthewmforget', '_blank');
    }

    resumeAction() {
        window.open('./assets/ML_resume.pdf', '_blank');
    }

    aboutmeAction() {
        aboutMe = true;
        bubble.setVisible(true);
        text.setVisible(true);
        this.typeText();
    }

    runAction() {
        this.scene.start('PokemonScene');
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
        if (Phaser.Input.Keyboard.JustDown(this.enterKey) && aboutMe) {
            this.enterSound.play();
            if (currentPos >= texts.length - 1) {
                bubble.setVisible(false);
                currentPos = 0;
                text.setVisible(false);
                aboutMe = false;
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

export default BattleScene;