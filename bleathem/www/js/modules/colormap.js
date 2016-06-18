'use strict';

var _ = require('lodash'),
    q= require('q');

var context, canvas;

function init(width) {
  var deferred = q.defer();

  canvas = document.getElementById('source');
  context = canvas.getContext('2d');

  var image = new Image();
  image.src = '/assets/devnation.svg';

  image.onload = event => {
    width = width || '1800';
    let aspectRatio = image.height / image.width;
    let height = width * aspectRatio;

    canvas.width=width; canvas.height=height;
    context.drawImage(image, 0, 0, width, height)
    let rect = canvas.getBoundingClientRect();
    deferred.resolve(rect);
  };
  return deferred.promise;
};

function getColor(x, y) {
  var data = context.getImageData(x, y, 1, 1).data;
  return Array.from(data)
}

module.exports = {
  init: init,
  getColor: getColor
}
