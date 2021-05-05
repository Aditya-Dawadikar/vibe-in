const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
    albumName:{
        type:String,
        required:true,
    },
    cover:{             //album cover path on server
        type:String
    },
    tracks:[mongoose.Schema.Types.ObjectId],    //track ids
    tags:[String],                                    //tags for fast search
    uploader:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },  //contentCreator account id
    credits:[String],    //all artists in the available tracks
    meta:{
        createdAt:{
            type:Date,
            required:true,
        }
    }
})

module.exports = mongoose.model('Album',albumSchema);