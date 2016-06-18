'use strict';

var fs = require('fs'),
    os = require('os'),
    gm = require('gm').subClass({imageMagick: true}),
    q = require('q');

var matrix = {
      orange:'2     0     0     0     0 \
              0     0.5   0     0     0 \
              0     0     0     0     0 \
              0     0     0     1     0 \
              0     0     0     0     1',
      white: '5     0     0     0     0 \
              0     5     0     0     0 \
              0     0     5     0     0 \
              0     0     0     1     0 \
              0     0     0     0     1',
      blue:  '0     0     0     0     0 \
              0    .5     0     0     0 \
              0     0     3     0     0 \
              0     0     0     1     0 \
              0     0     0     0     1',
    }

function writeAndConvertImage(sourceStream, targetpath, filename) {
  var promises = [];
  var imageStream = gm(sourceStream).setFormat('png').resize(18).stream();
  promises.push(writeFile(imageStream, targetpath, `${filename}-small.png`));
  // var cropStream = crop(sourceStream);
  for (var color in matrix) {
    var colorStream = recolor(imageStream, matrix[color]);
    promises.push(writeFile(colorStream, targetpath, `${filename}-${color}.png`));
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
  .out('client/assets/mask.png')
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
