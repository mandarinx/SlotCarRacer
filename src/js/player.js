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
