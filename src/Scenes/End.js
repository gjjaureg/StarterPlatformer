class End extends Phaser.Scene {
    constructor() {
        super("TheEnd");

    }

    create(){
        let my = this.my;
        this.nextScene = this.input.keyboard.addKey("S");

        this.add.text(200, 200, "The End", {
            fontFamily: 'Times, serif',
            fontSize: 40,
            wordWrap: {
                width: 60
            }
        });

        this.add.text(400, 200, "Press-S To Go To The First Level", {
            fontFamily: 'Times, serif',
            fontSize: 40,
            wordWrap: {
                width: 60
            }
        });

    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("loadScene");
        }
    }
}