'use strict';

var colormap = require('./modules/colormap'),
    mosaic = require('./modules/mosaic'),
    shuffle = require('./modules/shuffle'),
    Rx = require('rx');

/* Step 1: initialize the canvas and colormap as we did before */
colormap.init('1600')
  /* Step 2: initialize the img container */
  .then(mosaic.init)
  .then(tiles => {
    /* Step 3: Animate the tiles */
    // tiles.forEach(function(tile) {
    //   mosaic.drawTile(tile);
    // })

    /* Step 5: Animate the tiles one at a time */
    // Rx.Observable.zip(
    //   Rx.Observable.from(tiles).bufferWithCount(2),
    //   Rx.Observable.interval(4),
    //   (tiles, index) => tiles
    // )
    // .flatMap(tiles => tiles)
    // .subscribe(tile => mosaic.drawTile(tile));

    /* Step 6: shuffle the tiles */
    // shuffle(tiles);

    /* Step 7: Turn pn FPS meter! */
  })
  .catch(function(err) {
    console.error(err.stack);
  })
