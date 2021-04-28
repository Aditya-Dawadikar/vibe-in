const mongoose = require('mongoose');


const contentCreatorSchema = mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    passWord:{
        type:String,
        required:true
    },
    email:{
        type:String,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    tracks:[mongoose.Schema.Types.ObjectId], //track ids
    accountDetails:{},                       //vendor account details for payments
    albums:[mongoose.Schema.Types.ObjectId], //album ids
})

module.exports = mongoose.model('contentCreator',contentCreatorSchema);