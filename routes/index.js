
/*
* GET home page.
*/

var fs = require('fs');

exports.index = function(req, res){
    res.render('index', { title: 'Express' })
};

exports.getUploadPage = function(req, res){
    res.render('upload', { title: 'Upload Page' })
};

exports.postUploadData = function(req, res){
    console.log(req.body);
    console.log(req.files);
    fs.writeFile('message.jpg', req.body.file, function (err) {
        if (err) throw err;
            console.log('It\'s saved!');
    });
    res.redirect('/upload');
};
