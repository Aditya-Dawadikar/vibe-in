const fs = require('fs');
const stream = require('stream');
const multer = require('multer');


var coverStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/covers')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'.png')
    }
})
var uploadCovers = multer({ storage: coverStorage }).single('cover')

var trackStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/tracks')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'.mp3')
    }
})


/* 
trackRoute.get('/', (req, res) => {
    fileSystem.exists("uploads/1.mp3",(exists)=>{
        if(exists){
            const rStream = fileSystem.createReadStream("uploads/1.mp3");
            res.set('content-type', 'audio/mp3');
            res.set('accept-ranges', 'bytes');
            rStream.pipe(res)
        }
    })
});*/

exports.streamTrack=(req,res)=>{
    //find the document in db
    //find the track in filesystem
    //stream
    let trackName = req.params.id;
    let track="uploads/tracks/"+trackName
    fs.exists(track,(exists)=>{
      if(exists){
          const rStream = fs.createReadStream(track);
          res.set('content-type', 'audio/mp3');
          res.set('accept-ranges', 'bytes');
          rStream.pipe(res)
      }else{
        res.status(400).json({
          message:"track not found"
        })
      }
  })
}