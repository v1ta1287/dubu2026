export default class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    create() {
        // This logic now lives in one place!
        this.input.keyboard.on('keydown-I', () => {
            if (this.scene.isActive('InventoryScene')) return;

            this.scene.pause();
            this.scene.launch('InventoryScene');
        });
    }
}