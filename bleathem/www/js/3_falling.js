'use strict';

var colormap = require('./modules/colormap'),
    mosaic = require('./modules/mosaic'),
    shuffle = require('./modules/shuffle'),
    Rx = require('rx');

colormap.init('1800')
  .then(mosaic.init)
  .then(tiles => {
    shuffle(tiles);
    Rx.Observable.zip(
      Rx.Observable.from(tiles).bufferWithCount(2),
      Rx.Observable.interval(4),
      (tiles, index) => tiles
    )
    .flatMap(tiles => tiles)
    .subscribe(tile => mosaic.drawTile(tile));
  })
  .catch(function(err) {
    console.error(err.stack);
  })
