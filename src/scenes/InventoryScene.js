import { GameState } from "../GameState.js";

export default class InventoryScene extends Phaser.Scene {
    constructor() { super('InventoryScene'); }

    init() {
        this.selectedIndex = 0;
        this.scrollOffset = 0;
        this.maxVisible = 5;
        this.itemSlots = [];
        this.isInspecting = false;
    }

    create() {
        const { width, height } = this.cameras.main;

        // 1. Background
        this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);

        this.add.text(width / 2, 60, "INVENTORY", {
            fontSize: '40px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // 2. Create the Fixed Item Slots
        for (let i = 0; i < this.maxVisible; i++) {
            const slot = this.add.text(100, 100 + (i * 40), "", { fontSize: '24px' });
            this.itemSlots.push(slot);
        }

        // 3. Create the "Inspect" Bubble (Hidden by default)
        this.inspectBubble = this.add.container(width / 2, height - 100).setAlpha(0);
        const bg = this.add.rectangle(0, 0, 600, 100, 0x333333).setStrokeStyle(2, 0xffffff);
        this.inspectText = this.add.text(0, 0, "", {
            fontSize: '18px',
            wordWrap: { width: 550 },
            align: 'center'
        }).setOrigin(0.5);
        this.inspectBubble.add([bg, this.inspectText]);

        // Initial Refresh
        this.updateList();

        // 4. Navigation Controls
        this.input.keyboard.on('keydown-UP', () => this.changeSelection(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.changeSelection(1));

        // 5. Inspect Logic
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.isInspecting) {
                this.closeInspectBubble();
            } else {
                this.showInspectBubble();
            }
        });

        // 6. Close Logic
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.isInspecting) {
                this.closeInspectBubble();
            } else {
                this.closeInventory();
            }
        });
    }

    showInspectBubble() {
        // 1. Get the list of unique item names (Keys)
        const itemKeys = Object.keys(GameState.inventory);

        // 2. Stop if the bag is empty
        if (itemKeys.length === 0) return;

        // 3. Get the specific name Bubu is pointing at
        const itemName = itemKeys[this.selectedIndex];

        // 4. Look up that name in your itemData
        const description = GameState.itemData[itemName] || "A mysterious item.";

        // 5. Update the UI
        this.isInspecting = true;
        this.inspectText.setText(description);
        this.inspectBubble.setAlpha(1);
    }

    closeInspectBubble() {
        this.isInspecting = false;
        this.inspectBubble.setAlpha(0);
    }

    changeSelection(change) {
        const itemKeys = Object.keys(GameState.inventory);
        const totalUniqueItems = itemKeys.length;

        if (this.isInspecting || totalUniqueItems === 0) return;

        this.selectedIndex += change;

        // Wrap around using the count of unique keys
        if (this.selectedIndex < 0) {
            this.selectedIndex = totalUniqueItems - 1;
        } else if (this.selectedIndex >= totalUniqueItems) {
            this.selectedIndex = 0;
        }

        // Scrolling Logic: Keep the selectedIndex within the visible window
        if (this.selectedIndex >= this.scrollOffset + this.maxVisible) {
            this.scrollOffset = this.selectedIndex - this.maxVisible + 1;
        } else if (this.selectedIndex < this.scrollOffset) {
            this.scrollOffset = this.selectedIndex;
        }

        this.updateList();
    }

    updateList() {
        // 1. Convert the Object { "Yellow Flower": 2 } into an Array ["Yellow Flower", "Blue Flower"]
        // This allows our scrolling logic to keep working exactly as it did before!
        const itemKeys = Object.keys(GameState.inventory);

        this.itemSlots.forEach((slot, i) => {
            const itemIndex = this.scrollOffset + i;
            const itemName = itemKeys[itemIndex];

            if (itemName) {
                const quantity = GameState.inventory[itemName];
                slot.setVisible(true);

                // 2. Format the string to show "2x Yellow Flower"
                const displayText = `${quantity}x ${itemName}`;

                if (itemIndex === this.selectedIndex) {
                    slot.setFill('#ffff00');
                    slot.setText(`> ${displayText}`);
                } else {
                    slot.setFill('#888');
                    slot.setText(displayText);
                }
            } else {
                slot.setVisible(false);
            }
        });
    }

    closeInventory() {
        // Resume background scenes
        this.scene.manager.scenes.forEach(s => {
            if (s.scene.isPaused()) s.scene.resume();
        });
        this.scene.stop();
    }
}