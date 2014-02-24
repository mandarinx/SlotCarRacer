SlotCar = {};

SlotCar.Boot = function(game) {
    this.game = game;
};

SlotCar.Boot.prototype = {

    preload: function() {
        // this.load.atlasJSONHash('preloader',
        //                         'assets/atlas/atlas_preloader.png',
        //                         'assets/atlas/atlas_preloader.json');
    },

    create: function () {
        var game = this.game;
        var scale = game.stage.scale;

        game.input.maxPointers = 1;

        Phaser.Canvas.setSmoothingEnabled(game.context, false);
        game.stage.scaleMode = Phaser.StageScaleMode.NO_SCALE;
        scale.maxWidth = 800;
        scale.maxHeight = 576;
        scale.forceLandscape = true;
        scale.pageAlignHorizontally = true;
        scale.pageAlignVertically = true;
        scale.setScreenSize(true);

        game.state.start('Preloader');
    }
};

SlotCar.Game = function(game) {
    this.game = game;
    this.player = null;
    this.startData = {
        x: 0,
        y: 0,
        dir: 0
    };
    this.layer = null;
};

SlotCar.Game.prototype = {

    create: function() {
        var game = this.game;

        game.stage.backgroundColor = '#000000';
        var map = game.add.tilemap('test01');
        var tileset = game.add.tileset('tiles');
        this.layer = game.add.tilemapLayer(0, 0, 800, 576, tileset, map, 0);

        // dont use pixels in forEach. Use tiles!
        map.forEach(this.lookForStart, this, 0, 0, 800, 576);
        this.player = new SlotCar.Player(game, this.startData);
    },

    lookForStart: function(tile) {
        if (tile.index != null) {
            switch (tile.index) {
                case 2: // up
                    this.updateStartData(0, tile);
                break;
                case 13: // right
                    this.updateStartData(1, tile);
                break;
                case 5: // down
                    this.updateStartData(2, tile);
                break;
                case 9: // left
                    this.updateStartData(3, tile);
                break;
            }
        }
    },

    updateStartData: function(index, tile) {
        this.startData = {
            dir: index,
            angle: index * 90,
            x: tile.x,
            y: tile.y,
            layer: this.layer
        };
    },

    update: function() {

    },

    render: function() {

    },

    loadLevel: function(c) {

    }
};

SlotCar.Player = function(game, startData) {

    Phaser.Sprite.call(this, game, 0,
                       startData.y,
                       'entities', 'RaceCar.png');

    this.layer = startData.layer;

    this.current = {
        index: 0,
        x: startData.x,
        y: startData.y,
        isTurn: false,
        isChecked: false
    };
    this.crashAngle = 0;
    this.crash = false;

    this.anchor.setTo(0.5, 0.5);
    this.angle = startData.angle;
    var tw = this.layer.tileWidth;
    var th = this.layer.tileHeight;
    this.x = (startData.x * tw) + (tw * 0.5);
    this.y = (startData.y * th) + (th * 0.5);

    game.add.existing(this);

    this.throttle = game.input.keyboard.addKey(Phaser.Keyboard.UP);

    this.friction = 2;
    this.velocity = 0;
    this.maxVelocity = 5;

    this.updateCurrentTile();
};

SlotCar.Player.prototype = Object.create(Phaser.Sprite.prototype);
SlotCar.Player.prototype.constructor = SlotCar.Player;

SlotCar.Player.prototype.update = function() {

    if (this.velocity > 0) {
        this.updateCurrentTile();
        if (this.current.isTurn &&
            !this.current.isChecked) {

            var th = this.layer.tileHeight;
            var tw = this.layer.tileWidth;
            var cy = this.current.y;
            var cx = this.current.x;
            this.crashAngle = this.angle;

            switch (this.angle) {
                case 0:
                if (this.y <= (cy * th) + (th / 2)) {
                    this.y = cy * th + (th / 2);
                    this.updateAngle();
                    // if (this.velocity > 3) {
                    //     this.crash = true;
                    // }
                    this.current.isChecked = true;
                }
                break;
                case -180:
                if (this.y >= (cy * th) + (th / 2)) {
                    this.y = cy * th + (th / 2);
                    this.updateAngle();
                    // if (this.velocity > 3) {
                    //     this.crash = true;
                    // }
                    this.current.isChecked = true;
                }
                break;
                case 90:
                if (this.x >= (cx * tw) + (tw / 2)) {
                    this.x = cx * tw + (tw / 2);
                    this.updateAngle();
                    // if (this.velocity > 3) {
                    //     this.crash = true;
                    // }
                    this.current.isChecked = true;
                }
                break;
                case -90:
                if (this.x <= (cx * tw) + (tw / 2)) {
                    this.x = cx * tw + (tw / 2);
                    this.updateAngle();
                    // if (this.velocity > 3) {
                    //     this.crash = true;
                    // }
                    this.current.isChecked = true;
                }
                break;
            }
        }
    }

    if (this.crash) {
        // use crash angle to roll the car along the correct axis
        // land belly up
        // move car back to the tile before the turn

    } else {

        if (this.throttle.isDown) {
            this.velocity += 0.5;
            if (this.velocity > this.maxVelocity) {
                this.velocity = this.maxVelocity;
            }
        }

        if (this.angle == 0) {
            this.y -= this.velocity;
        }
        if (this.angle == -180) {
            this.y += this.velocity;
        }
        if (this.angle == 90) {
            this.x += this.velocity;
        }
        if (this.angle == -90) {
            this.x -= this.velocity;
        }

        if (this.throttle.isUp) {
            this.velocity -= this.friction;
            if (this.velocity < 0) {
                this.velocity = 0;
            }
        }
    }
};

SlotCar.Player.prototype.updateCurrentTile = function() {
    var tile = {};
    this.layer.getTileXY(this.x, this.y, tile);
    if (tile.x != this.current.x ||
        tile.y != this.current.y) {
        this.current.x = tile.x;
        this.current.y = tile.y;
        this.current.index = this.layer.tilemap.getTile(this.current.x,
                                                        this.current.y);
        this.current.isChecked = false;
        var i = this.current.index;
        if (i == 14 ||  // left down >v
            i == 10 ||  // left up ^<
            i == 7 ||   // up right ^>
            i == 6) {   // right up >^
            this.current.isTurn = true;
        } else {
            this.current.isTurn = false;
        }
    }
};

SlotCar.Player.prototype.updateAngle = function() {
    switch (this.current.index) {
        case 14:
            if (this.angle == 90) {
                this.angle = -180;
            }
            if (this.angle == 0) {
                this.angle = -90;
            }
            break;
        case 10:
            if (this.angle == -90) {
                this.angle = 0;
            }
            if (this.angle == -180) {
                this.angle = 90;
            }
            break;
        case 7:
            if (this.angle == 0) {
                this.angle = 90;
            }
            if (this.angle == -90) {
                this.angle = -180;
            }
            break;
        case 6:
            if (this.angle == 90) {
                this.angle = 0;
            }
            if (this.angle == -180) {
                this.angle = -90;
            }
            break;
    }
};

SlotCar.Player.prototype.crash = function(previousAngle) {

};

SlotCar.Preloader = function(game) {
    this.game = game;
    this.background = null;
    this.progressBar = null;
    this.preloadBg = null;
};

SlotCar.Preloader.prototype = {

    preload: function() {
        var game = this.game;

        game.load.atlasJSONHash('entities',
                                'assets/atlas/entities0.png',
                                'assets/atlas/entities0.json');
        game.load.tilemap('test01',
                          'assets/maps/test01.json', null,
                          Phaser.Tilemap.TILED_JSON);
        game.load.tileset('tiles', 'assets/atlas/tileset0.png', 32, 32);
    },

    update: function() {
        if (this.game.load.hasLoaded) {
            this.game.state.start('Game');
        }
    }

};
