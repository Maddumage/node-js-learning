var fs = require('fs');

fs.mkdir('./public/stuff', function (error, data) {
	console.log('stuff dir created');
	fs.writeFile(
		'./public/stuff/testWrite.txt',
		'Yes, you write to the new file',
		function (error, data) {
			//
			fs.readFile(
				'./public/stuff/testWrite.txt',
				'utf8',
				function (error, data) {
					console.log(data);
				}
			);
		}
	);
});

// remove file
fs.unlink('./public/stuff/testWrite.txt', function (error, data) {
	// remove directory
	console.log('file deleted');
	fs.rmdir('./public/stuff', function (error, data) {
		console.log('stuff dir removed');
	});
});
