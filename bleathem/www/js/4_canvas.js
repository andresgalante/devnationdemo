'use strict';

var colormap = require('./modules/colormap'),
    mosaic = require('./modules/mosaic'),
    falling = require('./modules/falling'),
    Rx = require('rx');

var target = document.getElementById('target');
var context = target.getContext('2d');
document.querySelector('.mosaic').addEventListener('animationend', event => {
  var node = event.target;
  if (!node.classList.contains('node')) {
    return;
  }
  let tile = JSON.parse(node.dataset.tile);
  var img = document.createElement('img');
  img.src = `/assets/crowd-${tile.colorname}.png`;
  img.onload = () => {
    context.drawImage(img, tile.x, tile.y, 18, 18);
    node.parentElement.removeChild(node);
  }
})

colormap.init('1800')
  .then(rect => {
    target.setAttribute('width', rect.width);
    target.setAttribute('height', rect.height);
    target.style.left = rect.left;
    target.style.top = rect.top;
    return rect;
  })
  .then(mosaic.init)
  .then(falling.animate)
  .catch(function(err) {
    console.error(err.stack);
  })
