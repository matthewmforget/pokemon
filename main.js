
import BattleScene from './battle.js';
import PokemonScene from './pokemon2.js';
import HomeScene from './home.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [HomeScene, PokemonScene, BattleScene]  // Add both scenes here
};

const game = new Phaser.Game(config);