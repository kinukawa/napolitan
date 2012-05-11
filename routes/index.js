var mongo = require("mongodb");
var client = new mongo.Db('test',new mongo.Server('127.0.0.1',27017));
client.open(function (err,client){
    if(err){
        console.log(err);
    }else{
        console.log("connected to mongodb");
    }
});

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
