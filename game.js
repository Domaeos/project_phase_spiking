const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1000,
    heigth: 800,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true,
        },
    }
};

const game = new Phaser.Game(config);

function preload() {

    this.load.image('tiles', "/tilesets/dungeon_tileset.png");
    this.load.tilemapTiledJSON('map', 'tilemaps/dungeon_level.json');

    this.cameras.main.setZoom(2.5, 2.5);
    this.load.atlas('player', 'sprites/Ninja/ninja.png', 'sprites/Ninja/ninja.json');
}

function create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('dungeon_tileset', 'tiles');

    const platforms = map.createStaticLayer('platforms', tileset, 0, 0);
    platforms.setCollisionByExclusion(-1, true);

    // add player
    this.player = this.physics.add.sprite(5, 90, 'player', 'idle-1.png');
    this.player.body.setSize(40, 55)
    this.player.setScale(0.5)
    this.player.body.setOffset(80, 68);
    this.player.setBounce(0.1);
    this.physics.add.collider(this.player, platforms);
    this.player.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player);


    this.cursors = cursors = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
        'melee': Phaser.Input.Keyboard.KeyCodes.M
    });
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', {
            prefix: 'run-',
            start: 1,
            suffix: '.png',
            end: 8,
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNames('player', {
            prefix: 'idle-',
            suffix: '.png',
            start: 1,
            end: 8,
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNames('player', {
            prefix: 'jump-',
            suffix: '.png',
            start: 1,
            end: 2,
        }),
        frameRate: 5,
        repeat: 1
    });
    this.anims.create({
        key: 'fall',
        frames: this.anims.generateFrameNames('player', {
            prefix: 'fall-',
            suffix: '.png',
            start: 1,
            end: 2,
        }),
        frameRate: 10,
        repeat: 0
    });
    this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNames('player', {
            prefix: 'attack-',
            suffix: '.png',
            start: 1,
            end: 6,
        }),
        frameRate: 20,
        repeat: 0
    });
}

function update() {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-200);
        this.player.play('walk', true);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(200);
        this.player.play('walk', true);
    } else {
        if (this.player.body.onFloor() && this.player.anims.getCurrentKey() !== 'attack') {
            this.player.setVelocityX(0)
            this.player.setVelocityY(0)
            this.player.play('idle', true);
        }
    }
    if (this.player.body.velocity.x > 0) {
        this.player.setFlipX(false);
    } else if (this.player.body.velocity.x < 0) {
        this.player.setFlipX(true);
    }

    if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
        this.player.setVelocityY(-200);
        this.player.play('jump', true);
    }
    if (this.cursors.melee.isDown) {
        this.player.play('attack', false);
    }
}