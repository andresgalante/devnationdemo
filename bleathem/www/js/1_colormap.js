'use strict';

var _ = require('lodash');

var canvas = document.getElementById('source'),
    context = canvas.getContext('2d'),
    rect;

var colortest = document.querySelector('.preview-color'),
    colorvalue = document.querySelector('.preview-rgba'),
    mask = document.querySelector('.preview .mask');

var image = new Image();
image.src = '/assets/devnation.svg';

image.onload = event => {
  let aspectRatio = image.height / image.width;
  let width = 900,
      height = width * aspectRatio;

  canvas.width=width; canvas.height=height;
  context.drawImage(image, 0, 0, width, height)
  rect = canvas.getBoundingClientRect();
};

canvas.addEventListener('mousemove', event => {
  let x = event.clientX - rect.left,
  y = event.clientY - rect.top;
  let imageData = context.getImageData(x, y, 1, 1);
  let [r,g,b, a] = imageData.data;
  colorvalue.innerText = `rgba(${r}, ${g}, ${b}, ${a})`
  colortest.style.background = `rgba(${r}, ${g}, ${b}, ${a})`;
  mask.style.background = `rgba(${r}, ${g}, ${b}, ${a})`;
  if (r == 0 && g == 0 && b == 0) {
    mask.parentElement.classList.add('node-white');
  } else {
    mask.parentElement.classList.remove('node-white');
  }
});
