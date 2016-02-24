var sharp = require('sharp');
var fs = require('fs');
var path = require('path');
//var gm = require('gm').subClass({imageMagick: true}); //
var math = require('math');
var simd = sharp.simd(true);

var pathoffiles = "public/Pictures/";
var myfiles = [];
var contentsofdir;
var a;
var dir = "public/Pictures_redim/";;

module.exports = {
    getMyPictures: getMyPictures
}

function getMyPictures(req, res, next) {
    _getmecontentofmypath(function (data) {
        console.log("Data: " + data.toString());
        res.send(data);

        console.log("Data was sent");

        //convert all photos to smaller sizes
        myfiles.forEach(function (content, index) {
            sharp(path.normalize(pathoffiles + content.filename))
                .resize(80)
                .withMetadata()
                .quality(90)
                .toFormat('jpeg')
                .toFile(path.normalize(dir + content.filename.toString().split('.')[0] + '_redim.jpg'), function (err) {
                    console.log(err);
                });
        });
    });
//re-init myfiles array with null
    myfiles = [];
}


/* GET folder listing. */
function _getmecontentofmypath(callback) {
    fs.readdir(path.normalize(pathoffiles), function (err, data) {
        contentsofdir = data;
        a = '';
        contentsofdir.forEach(function (content, index) {
            fs.readFile(pathoffiles + contentsofdir[index], function (err, data) {
                if (err) return console.log(err.stack);

                //read async way last modified time of the file; once done construct object and push it in myfiles
                fs.stat(pathoffiles + contentsofdir[index], function (err, stats) {
                    var fileData = {
                        filename: content,
                        filecontent: '', //data,
                        filedate: stats.mtime //last change date of the file
                    };
                    _pushmydata(fileData, index, a, function (dataresult) {
                        a = dataresult;
                    });
                    if (myfiles.length === contentsofdir.length) {
                        callback(a);
                    }
                })
            })
        })
    })
}

function _pushmydata(fileData, id, a, callback) {
    var temp;
    myfiles.push(fileData);
    //temp = '<a href="http://localhost:3000/Pictures/' + contentsofdir[id] + '">' + contentsofdir[id] + '</a>';
    temp = '<img src="http://localhost:3000/Pictures_redim/' + fileData.filename.toString().split('.')[0] + '_redim.jpg"' + '>' + ' - [' + fileData.filename.toString().split('.')[0] + '_redim.jpg' + ']'  ;
    //a += id + ' - [' + fileData.filecontent.toString().substring(1, 10) + ']' + " - " + temp + " - " + fileData.filedate + '<br>';
    a += temp + " - " + fileData.filedate + id + ' - [' + fileData.filecontent.toString().substring(1, 10) + ']' + '<br>';
    callback(a)
}