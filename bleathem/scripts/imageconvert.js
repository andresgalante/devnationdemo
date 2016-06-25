'use strict';

var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    gm = require('gm').subClass({imageMagick: true}),
    q = require('q');

var matrix = {
      orange:'.94   0     0     0     0 \
              0     .36   0     0     0 \
              0     0     .29   0     0 \
              0     0     0     1     0 \
              0     0     0     0     1',
      white: '5     0     0     0     0 \
              0     5     0     0     0 \
              0     0     5     0     0 \
              0     0     0     1     0 \
              0     0     0     0     1',
      blue:  '.3   0     0     0     0 \
              0     .3   0     0     0 \
              0     0     .6   0     0 \
              0     0     0     1     0 \
              0     0     0     0     1',
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

var filename = 'crowd.jpg';
var filepath = path.join('www', 'assets', 'tile', 'original', filename);
var stream = fs.createReadStream(filepath);
writeAndConvertImage(stream, 'crowd.png');
