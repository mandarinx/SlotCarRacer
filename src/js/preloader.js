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
