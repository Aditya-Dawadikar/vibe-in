const mongoose = require('mongoose');
const Track = require('../models/Track');
const Album = require('../models/Album');
const ContentCreator = require('../models/ContentCreator');
const multer = require('multer');
const fs = require('fs');

exports.getAlbumInfo=async(req,res)=>{
    await Album.findById({_id:req.params.id})
    .select("-__v")
    .then(doc=>{
        res.status(200).json({
            message:"found album",
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

exports.createAlbum=async(req,res)=>{
    const newAlbum = new Album({
        albumName:req.body.albumName,
        cover:"",
        tracks:req.body.tracks,    //track ids
        tags:req.body.tags,                                    //tags for fast search
        uploader:req.body.uploader,  //contentCreator account id
        credits:req.body.credits,    //all artists in the available tracks
        meta:{
            createdAt:new Date(Date.now()).getTime()
        }
    })
    let albumId;
    await newAlbum.save()
    .then(doc=>{
        albumId=doc._id;
    })

    let albumArray=[]
    await ContentCreator.findById({_id:req.body.uploader})
    .then(doc=>{
        albumArray = doc.albums
        albumArray.push(albumId)
    })
    .catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })

    await ContentCreator.findByIdAndUpdate({_id:req.body.uploader},{$set:{albums:albumArray}},{new:true})
    .then(doc=>{})
    .catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })

    res.status(200).json({
        message:"album created",
        url: `http://localhost:3030/album/${albumId}`
    })
}

exports.addTrack=async(req,res)=>{
    let trackArray=[]
    await Album.findById({_id:req.body.albumId})
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

    await Album.findByIdAndUpdate({_id:req.body.albumId},{$set:{tracks:trackArray}})
    .then(doc=>{
        res.status(200).json({
            message:"track added successfully",
            url:`http://localhost:3030/album/${doc._id}`
        })
    }).catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })
}

exports.removeTrack=async(req,res)=>{
    let trackArray=[]
    await Album.findById({_id:req.body.albumId})
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

    await Album.findByIdAndUpdate({_id:req.body.albumId},{$set:{tracks:trackArray}})
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

exports.updateCover=(req,res)=>{
    
}

exports.deleteAlbum=async(req,res)=>{
    //find the contentCreator
    let albumArray=[]
    let uploaderId
    await Album.findById({_id:req.params.id})
    .then(doc=>{
        uploaderId=doc.uploader
    }).catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })
    //get the albums array
    await ContentCreator.findById({_id:uploaderId})
    .then(doc=>{
        albumArray=doc.albums
    }).catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })
    //splice the required id
    let index = albumArray.findIndex(track => {
        return String(track) === String(req.params.id)
      })
    albumArray.splice(index,1);
    //update the content creator
    await ContentCreator.findByIdAndUpdate({_id:uploaderId},{$set:{albums:albumArray}})
    .then(doc=>{

    }).catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })
    //delete the album
    await Album.findByIdAndDelete({_id:req.params.id})
    .then(doc=>{

    }).catch(err=>{
        res.status(500).json({
            message:"some error occured",
            error:err
        })
    })

    res.status(200).json({
        message:"Album deleted successfully"
    })
}

exports.findAlbumByQuery = (req,res)=>{

}

exports.findMyAlbums = async(req,res)=>{
    let albumIdArray=[]
    await ContentCreator.findById({_id:req.params.id})
    .then(doc=>{
        albumIdArray=doc.albums
    })
    await Album.find({_id:{$in:albumIdArray}})
    .then(doc=>{
        res.status(200).json({
            message:"found albums",
            albums:doc
        })
    })
}

exports.findAllAlbums = (req,res)=>{

}