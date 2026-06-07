var juice = require('juice');
var fs = require('fs');
var path = require('path');
var jfile = require('jfile');

var inputFolder = './html';
var outputFolder = './out';

var options = [];
var queue = [];

const directories = [__dirname + '/temp', outputFolder];
directories.forEach((directory) => ensureDirectoryExists(directory));

next();

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, 0o744);
  }
}

function doJuice(inputFile, outputFile) {
  delete options.cssFile;
  delete options.optionsFile;

  juice.juiceFile(inputFile, options, function(err, html) {
    if (handleError(err)) { return; }
    fs.writeFile(outputFile, html, handleError);
  });
}

function next() {
  if (queue.length) {
    return queue.pop()();
  }

  const directory = fs.opendirSync(inputFolder)
  let file
  while ((file = directory.readSync()) !== null) {

    var txtFile=new jfile('html/'+ file.name);

    let buffer = txtFile.text;

    let includeLines = txtFile.grep("@@include", true);
    let replacements = [];
    includeLines.forEach(function callback(value, index) {
      let includeFilePath = 'partials/' + value.line.replace('@@include ', '').trim();
      let includeFile = new jfile(includeFilePath);

      replacements.push({'find': value.line, 'replace': includeFile.text});
    });

    for(let i = 0; i < replacements.length; i++){
      buffer = buffer.replace(replacements[i].find, replacements[i].replace);
    }

    console.log(file.name)

    fs.writeFile('temp/'+ file.name, buffer, err => {
      if (err) {
        console.error(err);
      } else {
        // file written successfully
      }
    });

    inputFile = 'temp/' + file.name
    outputFile = outputFolder + '/' + file.name
    doJuice(inputFile, outputFile);

  }

  directory.closeSync()

}

function handleError(err) {
  if (err) {
    console.error(err.stack);
    process.exit(1);
  }
  return !!err;
}