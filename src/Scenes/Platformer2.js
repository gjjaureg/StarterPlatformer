class Platformer2 extends Phaser.Scene {
    constructor() {
        super("platformerScene2");
        this.end = 0;
    }

    init() {
        // variables and settings
        this.ACCELERATION = 500;
        this.DRAG = 700;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -900;
    }

    create() {

        let count = 0
        let end = 0
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-2", 18, 18, 80, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed_food", "tilemap_tiles_food");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.groundLayer.setScale(2.0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.Fglass = this.map.createFromObjects("Objects", {
            name: "Fglass",
            key: "tilemap_sheet_food",
            frame: 82
        });

        this.Eglass = this.map.createFromObjects("Objects", {
            name: "Eglass",
            key: "tilemap_sheet_food",
            frame: 98
        });

        for (let i = 0; i < this.Fglass.length; i++){
            this.Fglass[i].x = this.Fglass[i].x * 2
            this.Fglass[i].y = this.Fglass[i].y * 2
        }

        for (let i = 0; i < this.Eglass.length; i++){
            this.Eglass[i].x = this.Eglass[i].x * 2
            this.Eglass[i].y = this.Eglass[i].y * 2
        }

        this.physics.world.enable(this.Fglass, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.Eglass, Phaser.Physics.Arcade.STATIC_BODY);

        this.FglassGroup = this.add.group(this.Fglass);
        this.EglassGroup = this.add.group(this.Eglass);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(game.config.width/11, game.config.height/2, "platformer_characters", "tile_0000.png").setScale(SCALE)
        //my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        this.physics.add.overlap(my.sprite.player, this.FglassGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            count += 1
        });

       
        this.physics.add.overlap(my.sprite.player, this.EglassGroup, (obj1, obj3) => {
            if (count >= 1){
            obj3.destroy(); // remove coin on overlap
            this.end += 1;
            };
       });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

       
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

    }

    update() {
        if(cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

        } else if(cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);

            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

        } else {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

        }
        if(this.end >= 1){
            this.scene.start("TheEnd")
        }
    }
}