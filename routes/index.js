
/*
* GET home page.
*/

exports.index = function(req, res){
    res.render('index', { title: 'Express' })
};

exports.getUploadPage = function(req, res){
    res.render('upload', { title: 'Upload Page' })
};

exports.postUploadData = function(req, res){
    req.form.complete(function(err, fields, files) {
        console.log('here i go');
    });
    res.redirect('/upload');
};
