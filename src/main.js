import HomeScene from './scenes/HomeScene.js';
import BootScene from './scenes/BootScene.js'
import ForestScene from './scenes/ForestScene.js';
import InventoryScene from './scenes/InventoryScene.js';
import DialogueScene from './scenes/DialogueScene.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 576,
        height: 448,
    },
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [BootScene, HomeScene, ForestScene, InventoryScene, DialogueScene]
};

const game = new Phaser.Game(config);