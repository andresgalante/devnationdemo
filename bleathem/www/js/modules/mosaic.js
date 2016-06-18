'use strict';

var _ = require('lodash'),
    q= require('q'),
    colormap = require('./colormap'),
    shuffle = require('./shuffle'),
    Rx = require('rx'),
    nameThisColor = require('name-this-color');

var colorMap = {
  'black': 'white',
  'mirage': 'blue',
  'livid-brown': 'orange',
  'burnt-sienna': 'orange',
  'buccaneer': 'blue',
  'lotus': 'blue',
  'carnation': 'orange'
}

function init(rect) {
  let mosaic = document.querySelector('.mosaic');
  mosaic.style.width = rect.width + 'px';
  mosaic.style.height = rect.height + 'px';
  mosaic.style.top = rect.top + 'px';
  mosaic.style.left = rect.left + 'px';
  let tileSize = 18;
  let cols = Math.ceil(rect.width / tileSize),
      rows = Math.ceil(rect.height / tileSize);
  let tiles = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let x = col * tileSize,
          y = row * tileSize,
          delta = Math.floor(tileSize / 2);
      let colorData = colormap.getColor(x + delta,y + delta);
      let c = colorData;
      let colorname = nameThisColor(`rgb(${c[0]}, ${c[1]}, ${c[2]})`)[0]
      tiles.push({
        col: col,
        row: row,
        x: x,
        y: y,
        tileSize: tileSize,
        colorData: colorData,
        colorname: colorMap[colorname.name],
        mosaic: mosaic
      })
    }
  }
  return q.when(tiles);
}

function drawTile(tile) {
  let node = document.createElement('div');
  node.classList.add('node');
  if (_.sum(tile.colorData.slice(0,3)) < 5) {
    node.classList.add('node-white');
  } else {
    let mask = document.createElement('div');
    mask.classList.add('mask');
    let c = tile.colorData;
    mask.style.background = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
    node.appendChild(mask);
  }
  var img = document.createElement('img');
  img.src = '/assets/crowd-small.png'
  img.style.width = tile.tileSize + 'px';
  node.style.left = tile.x + 'px';
  node.style.top = tile.y + 'px';
  node.dataset.tile = JSON.stringify(tile);
  node.appendChild(img);
  img.onload = ev => tile.mosaic.appendChild(node);
}

function animateTiles(tiles) {
  shuffle(tiles);
  Rx.Observable.zip(
    Rx.Observable.from(tiles).bufferWithCount(2),
    Rx.Observable.interval(4),
    (tiles, index) => tiles
  )
  .flatMap(tiles => tiles)
  .subscribe(tile => mosaic.drawTile(tile));
};

module.exports = {
  init: init,
  drawTile: drawTile
}
