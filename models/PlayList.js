const mongoose = require('mongoose');

const playListSchema = mongoose.Schema({
    playListName:{
        type:String,
        required:true,
    },
    tracks:[mongoose.Schema.Types.ObjectId],    //track ids
    tags:[],                                    //tags for fast search
    creator:[mongoose.Schema.Types.ObjectId],  //user account id
    credits:[String],    //all artists in the available tracks
    meta:{
        createdAt:{
            type:Date,
            required:true,
        },
        lastUpdatedAt:{
            type:Date
        },
    }
})

module.exports = mongoose.model('playList',playListSchema);