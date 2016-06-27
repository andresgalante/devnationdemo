'use strict';

var colormap = require('./modules/colormap'),
    mosaic = require('./modules/mosaic'),
    falling = require('./modules/falling'),
    canvas = require('./modules/canvas'),
    Rx = require('rx');

colormap.init('1600')
  .then(canvas.init)
  /* Step 3: initialize the img container (squares or diamonds) */
  // .then(mosaic.init)
  .then(mosaic.generateDiamondTiles)
  .then(tiles => {
    /* Step 1: Use the clip path to get diamonds */
    document.querySelector('.mosaic').classList.add('clip')

    // /* Step 4: animate with pre-clipped and pre-colored images */
    // falling.animate(tiles)
    // .subscribe(tile => mos?aic.drawTile(tile))
    falling.animate(tiles)
    .subscribe(tile => mosaic.drawDiamond(tile))

  })
  .catch(function(err) {
    console.error(err.stack);
  })

document.querySelector('.mosaic').addEventListener('animationend', event => {
  var node = event.target;
  // ignore non-node events
  if (!node.classList.contains('node')) {
    return;
  }
  // Retreive the "tile" data from the element's data attribute
  let tile = JSON.parse(node.dataset.tile);
  // Load an image with an already-colored image
  var img = new Image();
  /* Step 2: place diamond shapes in the canvas */
  // img.src = `/assets/tile/square/small/${tile.colorname}/${tile.filename}.png`;
  img.src = `/assets/tile/diamond/small/${tile.colorname}/${tile.filename}.png`;
  img.onload = () => {
    // render the image to the new canvas
    canvas.drawImage(img, tile.x, tile.y, 18, 18);
    // remove the animated element
    node.parentElement.removeChild(node);
  }
})
