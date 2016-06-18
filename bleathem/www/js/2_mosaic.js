'use strict';

var _ = require('lodash'),
    canvas = require('./modules/canvas');

canvas.init('1800').
  then(rect => {
    let target = document.querySelector('.target');
    target.style.width = rect.width + 'px';
    target.style.height = rect.height + 'px';
    target.style.top = rect.top + 'px';
    target.style.left = rect.left + 'px';
    let tileSize = 18;
    let cols = Math.ceil(rect.width / tileSize),
        rows = Math.ceil(rect.height / tileSize);
    let steps = [];
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        let x = col * tileSize,
            y = row * tileSize,
            delta = Math.floor(tileSize / 2);
        let colorData = canvas.getColor(x + delta,y + delta);
        steps.push({
          col: col,
          row: row,
          x: x,
          y: y,
          tileSize: tileSize,
          colorData: colorData
        })
      }
    }
    steps.forEach(function(step) {
      drawTile(target, step);
    })
  }, function(err) {
    console.error(err);
  });

function drawTile(target, step) {
  let node = document.createElement('div');
  node.classList.add('node');
  if (_.sum(step.colorData.slice(0,3)) < 5) {
    node.classList.add('node-white');
  } else {
    let mask = document.createElement('div');
    mask.classList.add('mask');
    let c = step.colorData;
    mask.style.background = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
    node.appendChild(mask);
  }
  var tile = document.createElement('img');
  tile.src = '/assets/crowd-small.jpg'
  tile.style.width = step.tileSize + 'px';
  node.style.left = step.x + 'px';
  node.style.top = step.y + 'px';
  node.appendChild(tile);
  tile.onload = ev => target.appendChild(node);
}
