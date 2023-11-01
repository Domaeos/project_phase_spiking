const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: window.innerWidth,
    heigth: window.innerHeight,
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

    this.cameras.main.setZoom(3, 3);
    this.load.atlas('player', 'sprites/Ninja/ninja.png', 'sprites/Ninja/ninja.json');
    this.load.atlas('enemy_test', 'sprites/Skeleton_Archer/skeleton_archer.png', 'sprites/Skeleton_Archer/skeleton_archer.json')


    this.load.atlas('skeleton_spearman', 'sprites/Skeleton_Spearman/spearman_atlas.png', 'sprites/Skeleton_Spearman/spearman_atlas.json')
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

    // enemy archer
    this.enemy_test = this.physics.add.sprite(5, 90, 'enemy_test', '')
    this.physics.add.collider(this.enemy_test, platforms);
    this.enemy_test.setCollideWorldBounds(true);
    this.enemy_test.body.setSize(35, 65);
    this.enemy_test.setScale(0.4)
    this.enemy_test.body.setOffset(50, 60);

    // // spearman:
    // this.skeleton_spearman = this.physics.add.sprite(5, 90, 'skeleton_spearman', 'skeleton_spearman_idle-1.png')
    // this.physics.add.collider(this.skeleton_spearman, platforms);
    // this.skeleton_spearman.setCollideWorldBounds(true);


    //enemy eyesight
    this.graphics = this.add.graphics();

    this.line = new Phaser.Geom.Line(this.enemy_test.x,
        this.enemy_test.y,
        this.player.x,
        this.player.y);


    // game keys
    this.cursors = cursors = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
        'melee': Phaser.Input.Keyboard.KeyCodes.M
    });

    // player anims
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
    // skeleton archer anims
    this.anims.create({
        key: 'skeleton-archer-attack',
        frames: this.anims.generateFrameNames('enemy_test', {
            prefix: 'skeleton_archer_attack_shoot_1-',
            suffix: '.png',
            start: 1,
            end: 15,
        }),
        frameRate: 15,
        repeat: 0
    });
    this.anims.create({
        key: 'skeleton-archer-idle',
        frames: this.anims.generateFrameNames('enemy_test', {
            prefix: 'skeleton_archer_idle-',
            suffix: '.png',
            start: 1,
            end: 7,
        }),
        frameRate: 10,
        repeat: 0
    });

    // skeleton spearman anims
    this.anims.create({
        key: 'skeleton-spearman-idle',
        frames: this.anims.generateFrameNames('skeleton_spearman', {
            prefix: 'skeleton_spearman_idle-',
            suffix: '.png',
            start: 1,
            end: 7,
        }),
        frameRate: 10,
        repeat: 0
    })

}

function update() {
    //debug 
    // console.log(this.line)
    this.line.x1 = this.enemy_test.x,
    this.line.y1 = this.enemy_test.y,
    this.line.x2 = this.player.x,
    this.line.y2 = this.player.y
    this.graphics.lineStyle(2, 0xffff00);
    this.graphics.strokeLineShape(this.line)

    // check enemy radius and attack
    if (Phaser.Geom.Line.Length(this.line) < 150) {
        this.enemy_test.play('skeleton-archer-attack', true)
    } else {
        this.enemy_test.play('skeleton-archer-idle', true)
    }


    if (this.cursors.left.isDown) {
        if (this.player.body.onFloor()) {
            this.player.play('walk', true);
        }
        this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
        if (this.player.body.onFloor()) {
            this.player.play('walk', true);
        }
        this.player.setVelocityX(200);
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
    this.graphics.clear();
}