var mongo = require("mongodb");
var client = new mongo.Db('naporitan',new mongo.Server('127.0.0.1',27017));
var collectionName = "naporitan";

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
    client.collection(collectionName,function(err,collection){
        if(err){
            throw err;
        }

        collection.findOne({version:data.version}, {}, function(err, doc) {
            if (err) sys.puts(err.message);
            console.log(doc);
            if(doc){
                doc.path = data.path;
                doc.full_path = data.full_path;
                doc.created = data.created;
                collection.save(doc,function(err){
                    if(err){
                        throw err;
                    }
                });

            }else{
                collection.save(data,function(err){
                    if(err){
                        throw err;
                    }
                });
            }
        });
    });
}

function outputPlist(version){
  var write_stream = fs.createWriteStream('./public/archives/'+version+'.plist');

  write_stream.on('drain', function ()         { console.log('write: drain'); })
  .on('error', function (exeption) { console.log('write: error'); })
  .on('close', function ()         { console.log('write: colse'); })
  .on('pipe',  function (src)      { console.log('write: pipe');  });

  var plist = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\"><plist version=\"1.0\"><dict>	<key>items</key>	<array>		<dict>			<key>assets</key>			<array>				<dict>					<key>kind</key>					<string>software-package</string>					<key>url</key>					<string>http://localhost:3000/</string>				</dict>			</array>			<key>metadata</key>			<dict>				<key>bundle-identifier</key>				<string>com.momodev.testflight</string>				<key>bundle-version</key>				<string>1.0</string>				<key>kind</key>				<string>software</string>				<key>title</key>				<string>testflight</string>			</dict>		</dict>	</array></dict></plist>";
  write_stream.write(plist);
  write_stream.end();
}

exports.postUploadData = function(req, res){
  console.log(req.body);
    console.log(req.files);

    var tmp_path = req.files.archive.path;
    var target_path = './public/archives/' + req.body.version + ".ipa";
    var full_path = "http://localhost:3000/archives/" + req.body.version + ".ipa";
        fs.rename(tmp_path, target_path, function(err) {
        if (err) {
            throw err;
        }
        fs.unlink(tmp_path, function() {
            if (err) {
                throw err;
            }
        });
    });
    var now = new Date();
    saveData({
        created:now,
        version:req.body.version,
        path:target_path,
        full_path:full_path
    });
    outputPlist(req.body.version);
    res.redirect('/upload');
};

exports.showIPAData = function(req, res){
  var ua = req.headers['user-agent'];
  var isIphone;
  if(ua.indexOf("iPhone",0) != -1){
    isIphone = true;
  }else{
    isIphone = false;
  }
  client.collection(collectionName,function(err,collection){
    if(err){
      throw err;
    }
    collection.find().toArray(function(err, results){
      if(err){
        throw err;
      }
      res.render('upload',{
        title: 'Upload Page',
        list: results,
        isIphone: isIphone
      });
    });
  });
}
