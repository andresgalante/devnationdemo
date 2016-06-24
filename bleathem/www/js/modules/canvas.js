'use strict';

var target = document.getElementById('target');
var context = target.getContext('2d');

function init(rect) {
  /* Step 2: initialize a new target canvas */
  document.body.style['min-width'] = '1700px';
  target.setAttribute('width', rect.width);
  target.setAttribute('height', rect.height);
  target.style.left = rect.left;
  target.style.top = rect.top;
  return rect;
}

function drawImage(img, x, y, dx, dy) {
  context.drawImage(img, x, y, dx, dy);
}

module.exports = {
  init: init,
  drawImage: drawImage
}
