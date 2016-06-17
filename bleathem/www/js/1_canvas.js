'use strict';

var _ = require('lodash');

var canvas = document.getElementById('source'),
    context = canvas.getContext('2d');

var colortest = document.querySelector('.color-display'),
    colorvalue = document.querySelector('.color-value');

var image = new Image();
image.src = '/assets/devnation.svg';

image.onload = event => {
  let aspectRatio = image.height / image.width;
  let width = 900,
      height = width * aspectRatio;

  canvas.width=width; canvas.height=height;
  context.drawImage(image, 0, 0, width, height)
};

canvas.addEventListener('mousemove', event => {
  let imageData = context.getImageData(event.clientX, event.clientY, 1, 1);
  let [r,g,b, a] = imageData.data;
  colorvalue.innerText = `rgba(${r}, ${g}, ${b}, ${a})`
  colortest.style.background = `rgba(${r}, ${g}, ${b}, ${a})`;
});
