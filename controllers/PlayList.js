const mongoose = require('mongoose');
const PlayList = require('../models/PlayList');
const User = require('../models/User');
const Track = require('../models/Track');

exports.createPlayList = async(req,res)=>{
    const newPlayList = new PlayList({
        playListName:req.body.playListName,
        tracks:req.body.tracks,    //track ids
        tags:req.body.tags,                                    //tags for fast search
        creator:req.body.creator,  //contentCreator account id
        credits:req.body.credits,    //all artists in the available tracks
        meta:{
            createdAt:new Date(Date.now()).getTime()
        }
    })
    let playListId;
    await newPlayList.save()
    .then(doc=>{
        playListId=doc._id;
    }).catch(err=>{
        return res.status(500).json({
            message:"some error occured",
            error:err
        })
    })

    let playListArray=[]
    await User.findById({_id:req.body.creator})
    .then(doc=>{
        playListArray = doc.playlists
        console.log(playListArray)
        playListArray.push(playListId)
    })
    .catch(err=>{
        return res.status(500).json({
            message:"some error occured here 1",
            error:err
        })
    })

    await User.findByIdAndUpdate({_id:req.body.creator},{$set:{playlists:playListArray}},{new:true})
    .then(doc=>{})
    .catch(err=>{
        res.status(500).json({
            message:"some error occured here 2",
            error:err
        })
    })

    res.status(200).json({
        message:"playlist created",
        url: `http://localhost:3030/playlist/${playListId}`
    })
}

exports.deletePlayList = async(req,res)=>{
    //find the contentCreator
    let playListArray=[]
    let creatorId
    await PlayList.findById({_id:req.params.id})
    .then(doc=>{
        creatorId=doc.creator
    }).catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })
    //get the albums array
    await User.findById({_id:creatorId})
    .then(doc=>{
        playListArray=doc.playlists
    }).catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })
    //splice the required id
    let index = playListArray.findIndex(track => {
        return String(track) === String(req.params.id)
      })
    playListArray.splice(index,1);
    
    //update the content creator
    await User.findByIdAndUpdate({_id:creatorId},{$set:{playlists:playListArray}})
    .then(doc=>{}).catch(err=>{
        res.status(500).json({
            message:"some error occured here",
            error:err
        })
    })
    //delete the album
    await PlayList.findByIdAndDelete({_id:req.params.id})
    .then(doc=>{}).catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })

    res.status(200).json({
        message:"PlayList deleted successfully"
    })
}

exports.addTrack = async(req,res)=>{
    let trackArray=[]
    await PlayList.findById({_id:req.body.playListId})
    .then(doc=>{
        trackArray=doc.tracks
    }).catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })
    
    for(let i=0;i<req.body.tracks.length;i++){
        trackArray.push(req.body.tracks[i])
    }

    await PlayList.findByIdAndUpdate({_id:req.body.playListId},{$set:{tracks:trackArray}})
    .then(doc=>{
        res.status(200).json({
            message:"track added successfully",
            url:`http://localhost:3030/playlist/${doc._id}`
        })
    }).catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })
}

exports.removeTrack = async(req,res)=>{
    let trackArray=[]
    await PlayList.findById({_id:req.body.playListId})
    .then(doc=>{
        trackArray=doc.tracks
    }).catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })
    
    let index = trackArray.findIndex(track => {
        return String(track) === String(req.body.trackId)
      })
    trackArray.splice(index,1);

    await PlayList.findByIdAndUpdate({_id:req.body.playListId},{$set:{tracks:trackArray}})
    .then(doc=>{
        res.status(200).json({
            message:"track removed successfully"
        })
    }).catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })
}

exports.getPlaylist = async(req,res)=>{
    await PlayList.findById({_id:req.params.id})
    .select("-__v")
    .then(doc=>{
        res.status(200).json({
            message:"found playlist",
            data:doc
        })
    })
    .catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })
}

exports.findPlayListByQuery = (req,res)=>{

}

exports.findMyPlayLists = async(req,res)=>{
    let playListIdArray=[]
    await User.findById({_id:req.params.id})
    .then(doc=>{
        playListIdArray=doc.playlists
    })
    await PlayList.find({_id:{$in:playListIdArray}})
    .then(doc=>{
        res.status(200).json({
            message:"found playList",
            playlists:doc
        })
    })
}
