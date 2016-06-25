'use strict';

var colormap = require('./modules/colormap'),
    mosaic = require('./modules/mosaic'),
    falling = require('./modules/falling'),
    Rx = require('rx');

var target = document.getElementById('target');
var context = target.getContext('2d');

/* Step 1: initialize the canvas, colormap */
colormap.init('1600')
  .then(rect => {
    /* Step 2: New: initialize a target canvas */
    document.body.style['min-width'] = '1700px';
    target.setAttribute('width', rect.width);
    target.setAttribute('height', rect.height);
    target.style.left = rect.left;
    target.style.top = rect.top;
    return rect;
  })
  /* Step 4: initialize the img container */
  .then(mosaic.init)
  /* Step 5: animate the tiles */
  .then(tiles => {
    falling.animate(tiles)
    .subscribe(tile => mosaic.drawTile(tile))
  })
  .catch(function(err) {
    console.error(err.stack);
  })

/* Step 6: Introduce a animation event listener */
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
  img.src = `/assets/tile/square/small/${tile.colorname}/${tile.filename}.png`;
  img.onload = () => {
    /* Step 7: Draw the image on the canvas */
    // context.drawImage(img, tile.x, tile.y, 18, 18);
    /* Step 8: Remove the animated element */
    // node.parentElement.removeChild(node);
  }
})

/* Step 7: Show FPS */

/* Step 8: Disable the .mask animation */
// document.querySelector('.mosaic').classList.remove('animate-mask')
