var fs = require('fs');

var readStream = fs.createReadStream(__dirname + '/readMe.txt', 'utf8');
var writeStream = fs.createWriteStream(__dirname + '/writeMe.txt');

readStream.on('data', function (chunk) {
	console.log('new chunk received!');
	console.log(chunk);
	writeStream.write(chunk);
});


// we can do the same read and write by using pipe

readStream.pipe(writeStream);

