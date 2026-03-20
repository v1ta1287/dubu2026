export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load all spritesheets once
        this.load.spritesheet('player', 'assets/lilbubu.png', { frameWidth: 212, frameHeight: 315 });
        this.load.spritesheet('dudu', 'assets/lildudu.png', { frameWidth: 212, frameHeight: 315 })
        this.load.spritesheet('house', 'assets/house.png', { frameWidth: 64, frameHeight: 64 });

        // Load audios
        this.load.audio('enter', 'assets/audio/enter.mp3');
    }

    create() {
        // Define animations once here
        this.anims.create({
            key: 'bubu-walk-down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.createAnimations();
        this.scene.start('HomeScene');
    }

    createAnimations() {
        this.anims.create({
            key: 'walk-left',
            frames: [
                { key: 'player', frame: 13 },
                { key: 'player', frame: 8 },
                { key: 'player', frame: 9 },
                { key: 'player', frame: 10 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: [
                { key: 'player', frame: 13 },
                { key: 'player', frame: 8 },
                { key: 'player', frame: 9 },
                { key: 'player', frame: 10 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    }
}