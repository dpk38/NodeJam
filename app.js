const express = require('express');
const fs = require('fs');
const app = express();
const formidable = require('formidable');
const bodyParser = require('body-parser');

//MongoDB Connection establishment----------------------------------------
/*
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  console.log("Database created!");
  dbo.createCollection("songs", function(err, res) {
    if (err) throw err;
  	console.log("Collection created!");
  	db.close();
  });
});
*/
//------------------------------------------------------------------------

//app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

let files = fs.readdirSync(__dirname + '/public/music');

app.get('/', function(req, res) {
	//res.redirect('/home.html'); 
	res.render('profile', {fileList: files, audiosrc: ''});
});

app.get('/home', function(req, res) {
	//res.redirect('/home.html');
	console.log("Hellloooo2");
	let files = fs.readdirSync(__dirname + '/public/music');
	res.render('profile', {fileList: files, audiosrc: ''});
});

/*app.get('/music', function(req, res) {
	let fileId = req.query.id;
	let file = __dirname + '/public/music/' + fileId;
	fs.exists(file, function(exists) {
		if (exists) {
			let readStream = fs.createReadStream(file);
			readStream.pipe(res);
		}
		else {
			res.send("Error 404: File not found!");
			res.end();
		}
	});
});*/

app.get('/download', function(req, res) {

	let fileId = req.query.id;
	let file = __dirname + '/public/music/' + fileId;
	fs.exists(file, function(exists) {
		if (exists) {
			//res.setHeader('Content-disposition', 'attachment; filename=' + fileId);
			//res.setHeader('Content-Type', 'application/audio/mpeg3');
			//let readStream = fs.createReadStream(file);
			//readStream.pipe(res);
			res.download(file);
		} else {
			res.send("Error 404: File not found!");
			res.end();
		}
	});
});

app.post('/fileupload', function(req, res) {
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    	let oldpath = files.filetoupload.path;
    	let newpath = __dirname + '/public/music/' + files.filetoupload.name;
    	fs.rename(oldpath, newpath, function(err) {
    		if (err) throw err;
    		let files = fs.readdirSync(__dirname + '/public/music');
    		res.render('profile', {fileList: files, audiosrc: ''});
    		//res.write('File uploaded');
      		res.end();
    	})
    });
});

app.post('/upload', function(req, res) {
	res.redirect('/upload.html');
});

// app.post('/play', function(req, res) {
// 	console.log('Gotcha!');
// 	var songurl = './music/' + req.body.filename;
// 	console.log(songurl);
// 	res.render('profile', {fileList: files, audiosrc: songurl});
// });
//-----------------------------------------------------------------------

app.listen(3000);