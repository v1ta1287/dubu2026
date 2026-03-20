import Bubu from "../sprites/bubu.js";

export default class ForestScene extends Phaser.Scene {
    constructor() {
        super('ForestScene');
    }

    init(data) {
        // Use the passed X/Y, or a default if starting fresh
        this.startPos = {
            x: data.x || 64 * 2 + 32,
            y: data.y || 64 * 2 + 32
        };
    }

    preload() {
        // NPCs
        this.load.spritesheet('player', 'assets/lilbubu.png', { frameWidth: 212, frameHeight: 315 });
        // Tilesets
        this.load.spritesheet('forest', 'assets/forest.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('forest2', 'assets/forest2.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        // Scene containers
        this.walls = [];
        this.exits = [];

        // Constants
        const mapLayout = [
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 2, 0, 1, 0, 5, 0, 0],
            [0, 0, 0, 0, 1, 0, 5, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 3, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 6, 0, 4, 0, 0],
        ];
        const obstacleTileIndices = [2, 3, 4, 5];
        const exitTiles = [6];


        mapLayout.forEach((row, y) => {
            row.forEach((value, x) => {
                const posX = x * 64;
                const posY = y * 64;
                const tileIndex = Math.abs(value);

                if (tileIndex === 1 || tileIndex === 6) {
                    this.add.image(posX, posY, 'forest', tileIndex).setOrigin(0);
                    if (exitTiles.includes(tileIndex)) {
                        this.exits.push({
                            x: posX + 32, y: posY + 32,
                            target: 'HomeScene', direction: 'down',
                            spawnX: 64 * 4 + 32, spawnY: 64 * 0 + 32
                        });
                    }
                } else {
                    // Everything else (Grass, Flowers, Tree) gets a base layer of Green Grass (0)
                    this.add.image(posX, posY, 'forest', 0).setOrigin(0);

                    // If it is NOT just a basic grass tile, draw the transparent object on top
                    if (tileIndex !== 0) {
                        this.add.image(posX, posY, 'forest2', tileIndex).setOrigin(0);
                        // If the stacked object (like a tree) is solid, add it to the walls array
                        if (obstacleTileIndices.includes(tileIndex)) {
                            this.walls.push({ x: posX + 32, y: posY + 32 });
                        }
                    }
                }

            });
        });

        // Characters
        this.player = new Bubu(this, this.startPos.x, this.startPos.y);
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        // Tell Bubu to run her own update logic
        if (this.player) {
            this.player.update(this.dudu);
        }
    }
}