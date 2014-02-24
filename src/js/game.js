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
