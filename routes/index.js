var admZip = require("adm-zip");
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


function saveData(data){
    client.collection("webdbtest",function(err,collection){
        if(err){
            throw err;
        }
        collection.save(data,function(err){
            if(err){
                throw err;
            }
        });
    });
}

exports.postUploadData = function(req, res){
    console.log(req.body);
    console.log(req.files);

    var tmp_path = req.files.archive.path;
    var target_path = './public/archives/' + req.body.version + ".ipa";

    fs.rename(tmp_path, target_path, function(err) {
        if (err) {
            throw err;
        }
        fs.unlink(tmp_path, function() {
            if (err) {
                throw err;
            }
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
        });
    });
    //saveData({path:req.files.image.path});
    res.redirect('/upload');
};
