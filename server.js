const express = require('express');
const {Readable} = require('stream');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const fileSystem = require('fs')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
var upload = multer({ storage: storage }).single('track')

mongoose.connect('mongodb://localhost/tracksDB',
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:true
    },(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("connected to database")
        }
})

/*
const trackRoute= express.Router();
app.use('/tracks',trackRoute);

trackRoute.get('/', (req, res) => {
    fileSystem.exists("uploads/1.mp3",(exists)=>{
        if(exists){
            const rStream = fileSystem.createReadStream("uploads/1.mp3");
            res.set('content-type', 'audio/mp3');
            res.set('accept-ranges', 'bytes');
            rStream.pipe(res)
        }
    })
});

trackRoute.post('/',(req,res)=>{
    upload(req, res, (err) => {
        if(err) {
          res.status(400).send("Something went wrong!");
        }
        res.send(req.file);
    });
});
*/

const userRoutes = require('./routes/User');
const contentCreatorRoutes = require('./routes/ContentCreator');
const trackRoutes = require('./routes/Track');
const playlistRoutes = require('./routes/PlayList');
const albumRoutes = require('./routes/Album');
const streamRoutes = require('./routes/Stream');

app.use('/user',userRoutes);
app.use('/contentCreator',contentCreatorRoutes);
app.use('/track',trackRoutes);
app.use('/playlist',playlistRoutes);
app.use('/album',albumRoutes);
app.use('/stream',streamRoutes);

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})