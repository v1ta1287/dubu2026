// DialogueScene.js
export default class DialogueScene extends Phaser.Scene {
    constructor() { super('DialogueScene'); }

    init(data) {
        this.lines = data.lines;
        this.onComplete = data.onComplete;
        this.currentLine = 0;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Dialogue Box at the bottom
        const box = this.add.rectangle(width / 2, height - 100, 500, 100, 0x000000, 0.9).setStrokeStyle(2, 0xffffff);
        this.textDisplay = this.add.text(width / 2, height - 100, "", {
            fontSize: '20px',
            fontFamily: 'Arial',
            wordWrap: { width: 450 },
            align: 'center'
        }).setOrigin(0.5);

        this.displayNextLine();

        this.input.keyboard.on('keydown-SPACE', () => {
            this.currentLine++;
            if (this.currentLine < this.lines.length) {
                this.displayNextLine();
            } else {
                this.finishDialogue();
            }
        });
    }

    displayNextLine() {
        this.textDisplay.setText(this.lines[this.currentLine]);
    }

    finishDialogue() {
        if (this.onComplete) this.onComplete();
        this.scene.manager.scenes.forEach(s => { if (s.scene.isPaused()) s.scene.resume(); });
        this.scene.stop();
    }
}