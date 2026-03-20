import Bubu from "../sprites/bubu.js";
import Dudu from "../sprites/Dudu.js";
import { GameState } from "../GameState.js";
import BaseScene from "./BaseScene.js";

export default class HomeScene extends BaseScene {
    constructor() {
        super('HomeScene');
    }

    init(data) {
        // Use the passed X/Y, or a default if starting fresh
        this.startPos = {
            x: data.x || 64 * 4 + 32,
            y: data.y || 64 * 4 + 32
        };
    }


    preload() {
        // NPCs
        this.load.spritesheet('player', 'assets/lilbubu.png', { frameWidth: 212, frameHeight: 315 });
        this.load.spritesheet('dudu', 'assets/lildudu.png', { frameWidth: 212, frameHeight: 315 })
        // Tilesets
        this.load.spritesheet('house', 'assets/house.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        super.create();

        // Scene containers
        this.walls = [];
        this.exits = [];

        // Constants
        const mapLayout = [
            [0, 0, 0, 0, 6, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 3, 4, -3, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        const obstacleTileIndices = [3, 4];
        const exitTiles = [6];

        mapLayout.forEach((row, y) => {
            row.forEach((value, x) => {
                const posX = x * 64;
                const posY = y * 64;

                // Use Math.abs() to get the actual frame index (e.g., -3 becomes 3)
                const tileIndex = Math.abs(value);

                // Draw the tile
                const tile = this.add.image(posX, posY, 'house', tileIndex).setOrigin(0);

                // If the original value was negative, flip it!
                if (value < 0) {
                    tile.setFlipX(true);

                    // Note: Flipping an image with origin(0) moves it out of the tile.
                    // We must adjust the origin to the center to flip in place.
                    tile.setOrigin(0.5);
                    tile.setPosition(posX + 32, posY + 32);
                }

                // Add to walls if it's a wall tile (frame 1)
                if (obstacleTileIndices.includes(tileIndex)) {
                    this.walls.push({ x: posX + 32, y: posY + 32 });
                }

                if (exitTiles.includes(tileIndex)) {
                    this.exits.push({
                        x: posX + 32, y: posY + 32,
                        target: 'ForestScene', direction: 'up',
                        spawnX: 64 * 4 + 32, spawnY: 64 * 6 + 32
                    });
                }

            });
        });

        // Characters
        this.player = new Bubu(this, this.startPos.x, this.startPos.y);
        this.dudu = new Dudu(this, 64 * 6 + 32, 64 + 32);

        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        // Tell Bubu to run her own update logic
        if (this.player) {
            this.player.update(this.dudu);
        }

        // Check for interaction
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.handleDuduInteraction()
        }
    }

    // Inside your Scene where Dudu lives (e.g., HomeScene.js)
    handleDuduInteraction() {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.dudu.x, this.dudu.y);
        if (dist > 80) return;

        const bubuDir = this.player.anims.currentAnim ? this.player.anims.currentAnim.key : '';
        const isFacingDudu = this.checkIfFacing(this.player, this.dudu, bubuDir);
        if (!isFacingDudu) return;

        let lines = [];
        let onCompleteAction = null;

        if (GameState.questStatus === 'NOT_STARTED') {
            lines = [
                "Hi Bubu! Happy birthday 🎂",
                "I'm trying to decorate for your birthday party, but I'm short on flowers. 🌸",
                "Could you find 3 Yellow Flowers, 3 Blue Flowers and 3 Pink Flowers for me? 💐",
                "Once you get the flowers, I'll hand over your birthday present 🎁"
            ];
            onCompleteAction = () => { GameState.questStatus = 'ACTIVE'; };

        } else if (GameState.questStatus === 'ACTIVE') {
            const yellowCount = GameState.inventory["Yellow Flower"] || 0;
            const blueCount = GameState.inventory["Blue Flower"] || 0;
            const pinkCount = GameState.inventory["Pink Flower"] || 0;

            if (yellowCount >= 3 && blueCount >= 3 && pinkCount >= 3) {
                lines = [
                    "Oh! You found them!",
                    "These are perfect. Thank you so much, Bubu.",
                    "Here is your birthday present! Open it whenever you like."
                ];
                onCompleteAction = () => {
                    // Remove flowers, add present
                    GameState.inventory["Yellow Flower"] -= 3;
                    if (GameState.inventory["Yellow Flower"] === 0) delete GameState.inventory["Yellow Flower"];
                    GameState.inventory["Blue Flower"] -= 3;
                    if (GameState.inventory["Blue Flower"] === 0) delete GameState.inventory["Blue Flower"];
                    GameState.inventory["Pink Flower"] -= 3;
                    if (GameState.inventory["Pink Flower"] === 0) delete GameState.inventory["Pink Flower"];

                    GameState.inventory["Birthday Present"] = 1;
                    GameState.questStatus = 'COMPLETED';
                };
            } else {
                lines = [`I still need 3 Yellow, Blue and Pink Flowers. You currently have ${yellowCount} Yellow, ${blueCount} Blue and ${pinkCount} Pink .`];
            }

        } else {
            lines = ["Thanks again for the flowers! I hope you like the gift."];
        }

        // Launch the dialogue
        this.scene.pause();
        this.scene.launch('DialogueScene', { lines: lines, onComplete: onCompleteAction });
    }

    checkIfFacing(player, target, animKey) {
        // Determine if the target is above, below, left, or right of the player
        const dx = target.x - player.x;
        const dy = target.y - player.y;

        // We use a small buffer (20px) to determine the primary direction
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal is the primary difference
            if (dx > 0 && animKey.includes('right')) return true;
            if (dx < 0 && animKey.includes('left')) return true;
        } else {
            // Vertical is the primary difference
            if (dy > 0 && animKey.includes('down')) return true;
            if (dy < 0 && animKey.includes('up')) return true;
        }

        return false;
    }
}