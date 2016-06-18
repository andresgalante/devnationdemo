'use strict';

var mosaic = require('./mosaic'),
    shuffle = require('./shuffle'),
    Rx = require('rx');

function animate(tiles) {
  shuffle(tiles);
  Rx.Observable.zip(
    Rx.Observable.from(tiles).bufferWithCount(2),
    Rx.Observable.interval(4),
    (tiles, index) => tiles
  )
  .flatMap(tiles => tiles)
  .subscribe(tile => mosaic.drawTile(tile));
}

module.exports = {
  animate: animate
}
