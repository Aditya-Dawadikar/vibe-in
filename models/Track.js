const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
    trackName:{
        type:String,
        required:true
    },
    url:{                    //track path on server
        type:String,
        required:true,
    },
    cover:{                //track cover photo path on server
        type:String,
    },
    credits:[String],
    tags:[String],
    copyRights:{},         //copyrights data for future integration
    uploader:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }, //contentCreator account id
    meta:{
        uploadedAt:String,
        runtime:String, //seconds
    }
})

module.exports = mongoose.model('Track',trackSchema);