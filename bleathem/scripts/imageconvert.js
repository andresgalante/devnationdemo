'use strict';

var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    gm = require('gm').subClass({imageMagick: true}),
    q = require('q');

function orangeMatrix(r, g, b, s, d) {
  return `6x3: ${r*s}    0     0    0    0    ${d} \
                 0   ${g*s}    0    0    0    ${d} \
                 0     0   ${b*s}   0    0    ${d} `
}
function blueMatrix(r, g, b, s, d) {
  return `6x3: 0         ${g*s}      ${b*s}    0    0    ${d} \
               ${r*s}    0         ${b*s}    0    0    ${d} \
               ${r*s}    ${g*s}    ${b*s}    0    0  ${d} `
}
var matrix = {
      orange: orangeMatrix(241, 94, 75, 1/200, 0.1),
      blue: blueMatrix(25, 25, 48, 1/100, 0.15),
      white: '6x3: .2    .5    .3    0    0   .45 \
                   .2    .5    .3    0    0   .45 \
                   .2    .5    .3    0    0   .45 ',
    }

function writeAndConvertImage(sourceStream, filename) {
  var promises = [];
  var imageStream = gm(sourceStream).setFormat('png').resize(75).stream();
  promises.push(writeFile(imageStream, path.join('www', 'assets', 'tile', 'square', 'mid', filename)));
  for (let color in matrix) {
    let colorStream = recolor(imageStream, matrix[color]);
    promises.push(writeFile(colorStream, path.join('www', 'assets', 'tile', 'square', 'mid', color, filename)));
  }
  var cropStream = crop(imageStream);
  promises.push(writeFile(cropStream, path.join('www', 'assets', 'tile', 'diamond', 'mid', filename)));
  for (let color in matrix) {
    let colorStream = recolor(cropStream, matrix[color]);
    promises.push(writeFile(colorStream, path.join('www', 'assets', 'tile', 'diamond', 'mid', color, filename)));
  }
  var smallStream = resize(imageStream, 18);
  promises.push(writeFile(smallStream, path.join('www', 'assets', 'tile', 'square', 'small', filename)));
  for (let color in matrix) {
    let colorStream = recolor(smallStream, matrix[color]);
    promises.push(writeFile(colorStream, path.join('www', 'assets', 'tile', 'square', 'small', color, filename)));
  }
  var smallCropStream = resize(cropStream, 18);
  promises.push(writeFile(smallCropStream, path.join('www', 'assets', 'tile', 'diamond', 'small', filename)));
  for (let color in matrix) {
    let colorStream = recolor(smallCropStream, matrix[color]);
    promises.push(writeFile(colorStream, path.join('www', 'assets', 'tile', 'diamond', 'small', color, filename)));
  }
  return q.all(promises);
}

function resize(stream, size) {
  return gm(stream).resize(size).stream();
}

function recolor(stream, matrix) {
  return gm(stream).recolor(matrix).stream();
}

function crop(stream) {
  return gm(stream)
  .command('composite')
  .out('www/assets/mask.png')
  .out('-compose', 'in')
  .stream();
}

function writeFile(stream, filepath) {
  var deferred = q.defer();
  stream.on('end', function() {
    deferred.resolve(filepath);
  });
  stream.on('error', function(err) {
    deferred.reject(err);
  });
  stream.pipe(fs.createWriteStream(filepath));
  return deferred.promise;
}

var filenames = ['crowd', 'summit-1', 'summit-2', 'summit-3', 'summit-4', 'summit-5', 'summit-6'];
filenames.forEach(function(filename) {
  var filepath = path.join('www', 'assets', 'tile', 'original', `${filename}.jpg`);
  var stream = fs.createReadStream(filepath);
  writeAndConvertImage(stream, `${filename}.png`);
})
