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
