var fs = require('fs');

// async read and write
var readMeText = fs.readFileSync('./public/assets/readMe.txt', 'utf8');

console.log(readMeText);

fs.writeFileSync('./public/assets/readMe.txt', 'Yes, you write me babe!');

var readMeText = fs.readFileSync('./public/assets/readMe.txt', 'utf8');

console.log(readMeText);

// lets test synchronize

fs.readFile('./public/assets/readMe.txt', 'utf8', function (error, data) {
	// when complete
	console.log('read completed');
	// then write again to the file
	fs.writeFile(
		'./public/assets/writeMe.txt',
		'Yeah, you write me again!',
		function (error, data) {
			// when complete
			console.log('write completed');
		}
	);
});
