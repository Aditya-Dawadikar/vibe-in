const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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
    favourites:[mongoose.Schema.Types.ObjectId],  //liked songs for listening again
    playlists:[],   //creted playlists
})

module.exports = mongoose.model('User',userSchema);