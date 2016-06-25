'use strict';

var _ = require('lodash'),
    colormap = require('./modules/colormap');

/* Step 1: initialize the canvas and colormap as we did before */
colormap.init('1600').
  then(rect => {
    /* Step 2: resize the div img container */
    // let mosaic = document.querySelector('.mosaic');
    // resizeMosaic(mosaic, rect);

    /* Step 3: break the img container up into a grid of "tiles" */
    // let tiles = generateTileList(mosaic, rect);

    /* Step 4: draw each tile into the grid */
    // tiles.forEach(function(tile) {
    //   drawTile(tile);
    // })
  })
  .catch(function(err) {
    console.error(err.stack);
  });

function drawTile(tile) {
  // create a "node" div
  let node = document.createElement('div');
  node.classList.add('node');
  if (_.sum(tile.colorData.slice(0,3)) < 5) {
    // add the filter for white colors
    node.classList.add('node-white');
  } else {
    // add a mask for non-white colors
    let mask = document.createElement('div');
    mask.classList.add('mask');
    let c = tile.colorData;
    mask.style.background = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
    node.appendChild(mask);
  }
  // create an image element
  var img = document.createElement('img');
  img.src = '/assets/tile/square/mid/crowd.png'
  // position the image element
  img.style.width = tile.tileSize + 'px';
  node.style.left = tile.x + 'px';
  node.style.top = tile.y + 'px';
  node.appendChild(img);

  // insert the node element into the dom after the image has loaded
  img.onload = ev => tile.mosaic.appendChild(node);
}

function resizeMosaic(mosaic, rect) {
  mosaic.style.width = rect.width + 'px';
  mosaic.style.height = rect.height + 'px';
  mosaic.style.top = rect.top + 'px';
  mosaic.style.left = rect.left + 'px';
}

function generateTileList(mosaic, rect) {
  let tiles = [];
  let tileSize = 18;
  let cols = Math.ceil(rect.width / tileSize),
      rows = Math.ceil(rect.height / tileSize);
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let x = col * tileSize,
          y = row * tileSize,
          delta = Math.floor(tileSize / 2);
      let colorData = colormap.getColor(x + delta,y + delta);
      tiles.push({
        col: col,
        row: row,
        x: x,
        y: y,
        tileSize: tileSize,
        colorData: colorData,
        mosaic: mosaic
      })
    }
  }
  return tiles;
}

function createNode() {

}
