const express = require('express');
const {Readable} = require('stream');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const fileSystem = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect('mongodb+srv://vibein:vibin@cluster0.vnbag.mongodb.net/testdb?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    },(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("connected to database")
        }
})


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

app.listen(3030,()=>{
    console.log("server is running on port 3030");
})