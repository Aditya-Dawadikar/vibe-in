const mongoose = require('mongoose');

const playListSchema = mongoose.Schema({
    playListName:{
        type:String,
        required:true,
    },
    tracks:[mongoose.Schema.Types.ObjectId],    //track ids
    tags:[String],                              //tags for fast search
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },  //user account id
    credits:[String],    //all artists in the available tracks
    meta:{
        createdAt:{
            type:Date,
            required:true,
        }
    }
})

module.exports = mongoose.model('playList',playListSchema);