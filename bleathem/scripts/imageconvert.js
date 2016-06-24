'use strict';

var fs = require('fs'),
    os = require('os'),
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
      blue:  '.09   0     0     0     0 \
              0     .09   0     0     0 \
              0     0     .18   0     0 \
              0     0     0     1     0 \
              0     0     0     0     1',
    }

function writeAndConvertImage(sourceStream, targetpath, filename) {
  var promises = [];
  var imageStream = gm(sourceStream).setFormat('png').resize(75).stream();
  promises.push(writeFile(imageStream, targetpath, `${filename}-mid.png`));
  var cropStream = crop(imageStream);
  for (let color in matrix) {
    let colorStream = recolor(cropStream, matrix[color]);
    promises.push(writeFile(colorStream, targetpath, `${filename}-${color}-mid-diamond.png`));
  }
  var smallStream = resize(imageStream, 18);
  promises.push(writeFile(smallStream, targetpath, `${filename}-small.png`));
  for (let color in matrix) {
    let colorStream = recolor(smallStream, matrix[color]);
    promises.push(writeFile(colorStream, targetpath, `${filename}-${color}-small.png`));
  }
  var smallCropStream = resize(cropStream, 18);
  promises.push(writeFile(smallCropStream, targetpath, `${filename}-small-diamond.png`));
  for (let color in matrix) {
    let colorStream = recolor(smallCropStream, matrix[color]);
    promises.push(writeFile(colorStream, targetpath, `${filename}-${color}-small-diamond.png`));
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

function writeFile(stream, path, filename) {
  var deferred = q.defer();
  var filepath = path + '/' + filename;
  stream.on('end', function() {
    deferred.resolve(filepath);
  });
  stream.on('error', function(err) {
    deferred.reject(err);
  });
  stream.pipe(fs.createWriteStream(filepath));
  return deferred.promise;
}

var filename = 'crowd';
var path = 'www/assets';
var stream = fs.createReadStream(path + '/' + filename + '.jpg');
writeAndConvertImage(stream, path, filename);
