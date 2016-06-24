'use strict';

var mosaic = require('./mosaic'),
    shuffle = require('./shuffle'),
    Rx = require('rx');

function animate(tiles) {
  shuffle(tiles);
  return Rx.Observable.zip(
    Rx.Observable.from(tiles).bufferWithCount(2),
    Rx.Observable.interval(4),
    (tiles, index) => tiles
  )
  .flatMap(tiles => tiles);
}

module.exports = {
  animate: animate
}
