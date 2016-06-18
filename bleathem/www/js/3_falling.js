'use strict';

var canvas = require('./modules/canvas'),
    mosaic = require('./modules/mosaic'),
    shuffle = require('./modules/shuffle');

canvas.init('1800')
  .then(mosaic.init)
  .then(tiles => {
    shuffle(tiles);
    console.log(tiles.length);
    tiles.forEach(tile => {
      setTimeout(
        () => mosaic.drawTile(tile),
        Math.floor(Math.random() * 5000)
      );
    })
  })
  .catch(function(err) {
    console.error(err.stack);
  })
