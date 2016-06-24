'use strict';

var _ = require('lodash');

var canvas = document.getElementById('source'),
    context = canvas.getContext('2d'),
    rect;

// Step 1: Load our image into a Image element
var image = new Image();
image.src = '/assets/devnation.svg';

image.onload = event => {
  /* Step 2: draw the image into a canvas */
  // context.drawImage(image, 0, 0, canvas.width, canvas.height)

  /* Step 3: set the canvas size */
  // canvas.width = 900;
  // canvas.height = 500;

  /* Step 4: preserve the aspect ratio */
  // canvas.width = 900;
  // let aspectRatio = image.height / image.width;
  // canvas.height = canvas.width * aspectRatio;

  // context.drawImage(image, 0, 0, canvas.width, canvas.height)

  /* Step 5: retrieve imageData */
  // let imageData = context.getImageData(100, 100, 1, 1);
  // let [r,g,b, a] = imageData.data;
  // let colorString = `rgba(${r}, ${g}, ${b}, ${a})`
  // previewColor(colorString);

  rect = canvas.getBoundingClientRect();
};

canvas.addEventListener('mousemove', event => {
  /* Step 6: resolve the co-ordinates from the mosue event */
  let x = event.clientX - rect.left,
  y = event.clientY - rect.top;

  /* Step 7: Inspect the canvas for the pixel data */
  let imageData = context.getImageData(x, y, 1, 1);
  let [r,g,b, a] = imageData.data;

  /* Step 8: Display the rgb values as a CSS rgba color */
  let colorString = `rgba(${r}, ${g}, ${b}, ${a})`
  previewColor(colorString);

  previewMask(r,g,b,a);
});


var colortest = document.querySelector('.preview-color'),
    colorvalue = document.querySelector('.preview-rgba'),
    mask = document.querySelector('.preview .mask');

function previewColor(colorString) {
  if (!colorvalue) return;
  // Step 9: Set the background of our colorpicker box
  colorvalue.innerText = colorString;
  colortest.style.background = colorString;
}

function previewMask(r,g,b,a) {
  if (!mask) return;
  /* Step 10: preview image mask */
  let colorString = `rgba(${r}, ${g}, ${b}, ${a})`
  mask.style.background = colorString;

  if (r == 0 && g == 0 && b == 0) {
    mask.parentElement.classList.add('node-white');
  } else {
    mask.parentElement.classList.remove('node-white');
  }
}
