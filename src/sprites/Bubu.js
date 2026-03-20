export default class Bubu extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // 'player' matches the key you used in preload
        super(scene, x, y, 'player', 4);

        // Add this object to the scene and its physics world
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Setup base properties
        this.setScale(0.25);
        this.setCollideWorldBounds(true);
        this.isMoving = false;

        // This tells the physics engine the 'real' height is 275
        // We use the unscaled numbers here
        this.body.setSize(252, 265);

        // This 'shaves' 20px off the top by moving the hitbox down 
        // relative to the top of the image
        this.body.setOffset(-20, 25);

        // Setup controls specifically for this player
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update(npc) {
        if (this.isMoving) return;

        // Grid-based movement logic moved here
        if (this.cursors.left.isDown) this.move(-64, 0, 'walk-left', true, npc);
        else if (this.cursors.right.isDown) this.move(64, 0, 'walk-right', false, npc);
        else if (this.cursors.up.isDown) this.move(0, -64, 'walk-up', false, npc);
        else if (this.cursors.down.isDown) this.move(0, 64, 'walk-down', false, npc);
    }

    // Update your move function to accept the NPC (or an array of NPCs)
    move(xOffset, yOffset, animKey, flipX, npc) {
        if (this.isMoving) return;

        // 1. Determine the current intended direction based on offsets
        let intendedDir = '';
        if (yOffset < 0) intendedDir = 'up';
        else if (yOffset > 0) intendedDir = 'down';
        else if (xOffset < 0) intendedDir = 'left';
        else if (xOffset > 0) intendedDir = 'right';

        const currentExit = this.scene.exits.find(e => {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
            // Only return true if she's on the tile AND pushing the right way
            return dist < 20 && intendedDir === e.direction;
        });


        if (currentExit) {
            console.log("Intentional exit detected! Fading out...");

            // 1. Disable Bubu's movement so the player can't walk away during the fade
            this.isMoving = true;
            this.stop();

            this.scene.sound.play('enter', { volume: 0.2, detune: Phaser.Math.Between(-100, 100) });
            // 2. Start the fade out (duration in milliseconds, R, G, B)
            this.scene.cameras.main.fadeOut(500, 0, 0, 0);

            // 3. Wait for the fade to complete before switching
            this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.scene.start(currentExit.target, {
                    x: currentExit.spawnX,
                    y: currentExit.spawnY
                });
            });

            return;
        }

        // Calculate where Bubu WANTS to go
        const targetX = this.x + xOffset;
        const targetY = this.y + yOffset;

        const isOutOfBounds = (
            targetX < 0 ||
            targetX > 576 ||
            targetY < 0 ||
            targetY > 448
        );

        const isWall = this.scene.walls.some(wall => {
            const dist = Phaser.Math.Distance.Between(targetX, targetY, wall.x, wall.y);
            return dist < 32; // If within 10 pixels of the wall's center, consider it a collision
        });

        const isNPC = npc && Phaser.Math.Distance.Between(targetX, targetY, npc.x, npc.y) < 32;

        if (isWall || isNPC || isOutOfBounds) {
            this.setFlipX(flipX);
            this.play(animKey, true);
            this.stop();
            return;
        }

        // If path is clear, proceed with the Tween
        this.isMoving = true;
        this.setFlipX(flipX);
        this.play(animKey, true);

        this.scene.tweens.add({
            targets: this,
            x: targetX,
            y: targetY,
            duration: 300,
            onComplete: () => {
                this.isMoving = false;
                this.stop();
            }
        });
    }
}