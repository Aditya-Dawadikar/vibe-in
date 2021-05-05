const mongoose = require('mongoose');
const Track = require('../models/Track');
const ContentCreator = require('../models/ContentCreator');
const multer = require('multer');
const fs = require('fs');
const { nextTick } = require('process');

//storage config
var coverStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/covers')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'.png')
    }
})
var uploadCovers = multer({ storage: coverStorage }).single('cover')

var trackStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/tracks')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now()+'.mp3')
    }
})
var uploadTracks = multer({ storage: trackStorage }).single('track')


//handlers
exports.getTrackInfo=(req,res)=>{
    Track.findById({_id:req.params.id})
    .select("-__v")
    .then(doc=>{
      res.status(200).json({
        message:"success",
        doc:doc
      })
    })
    .catch(err=>{
      console.log(err)
      res.status(500).json(err)
    })
}

exports.uploadTrack=async(req,res)=>{
    uploadTracks(req, res,(err) =>{
        if(err) {
            console.log(err)
            res.status(400).send("Something went wrong!");
        }
        res.status(200).json({
          message:"track uploaded successfully",
          trackName:req.file.filename
        })
    })
}

exports.postTrackData=async(req,res)=>{
    const newTrack = new Track({
      trackName:req.params.trackName,
      url:"http://localhost:3030/stream/"+req.params.trackName,
      cover:"",
      credits:req.body.credits,
      tags:req.body.tags,
      copyRights:{},         //copyrights data for future integration
      uploader:req.body.uploader, //contentCreator account id
      meta:{
          uploadedAt:new Date(Date.now()).getTime(),
          runtime:req.body.track.runtime, //seconds
          size:req.body.track.size, 
      }
  })

  let trackDoc;
  await newTrack.save()
  .then(doc=>{
    trackDoc=doc
  })
  .catch(err=>{
    console.log(err)
    res.status(500).json(err)
  })

  let tracksArray=[]
  await ContentCreator.findById({_id:req.body.uploader})
  .then(doc=>{
    tracksArray=doc.tracks;
  })

  tracksArray.push(trackDoc._id)

  ContentCreator.findByIdAndUpdate({_id:req.body.uploader},{$set:{tracks:tracksArray}}).then(doc=>{
    res.status(200).json({
      message:"track uploaded",
      trackId:trackDoc._id
    })
  })
}

exports.uploadCover=(req,res)=>{
    var uploadedCover;
    uploadCovers(req,res,(err)=>{
        if(err){
            console.log(err)
            //res.status(400).send("Something went wrong");
        }
        uploadedCover=req.file;
        console.log(uploadedCover);
    })
}

exports.deleteCover=(req,res)=>{

}

exports.updateTrack=async(req,res)=>{
  //find the old track name
  let trackName = req.params.trackName;
  let track="uploads/tracks/"+trackName
  let newName="";
  await uploadTracks(req, res,async(err) =>{
    if(err) {
        console.log(err)
        res.status(400).send("Something went wrong!");
    }
    newName=req.file.filename;
    //update the document in database
    
    await fs.exists(track,(exists)=>{
      if(exists){
        fs.unlink(track,(err) => {
          if (err) {
              throw err;
          }
        })      
      }else{
        res.status(400).json({
          message:"track not found"
        })
      }
    })
    await Track.findByIdAndUpdate({_id:req.params.id},{$set:{trackName:newName,url:"http://localhost:3030/stream/"+newName}},{new:true})
    .then(doc=>{
      res.status(200).json({
        message:"track uploaded successfully",
        trackName:newName
      })
    })
    .catch(err=>{
      res.status(400).json({
        message:"track not found"
      })
    })
  })


}

exports.updateTrackInfo=(req,res)=>{
    var updateOps = req.body;
    for (const ops in updateOps) {
        updateOps[ops.propName] = ops.value;
    }
    Track.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps },{new:true})
        .exec()
        .then(doc => {
            res.status(200).json({
                message: "success",
                doc: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while updating data",
                error: err
            })
        })
}

exports.deleteTrack=(req,res)=>{
  let track="uploads/tracks/"
  let creator=""
  Track.findById({_id:req.params.id})
  .then(doc=>{
    track=track+doc.trackName
    creator=doc.uploader
  })
  .then(()=>{
    fs.exists(track, (exists)=>{
      if(exists){
        fs.unlink(track,(err) => {
          if (err) {
              throw err;
          }
        })
      }
    })
  })
  .then(()=>{
    Track.findByIdAndDelete({_id:req.params.id})

    let contentCreatorData=ContentCreator.findById({_id:creator}).select("tracks")
    let tracksArray=[]
    for(let track in contentCreatorData.tracks){
      tracksArray.push(track)
    }
    let index = tracksArray.findIndex(track => {
      return String(track._id) === String(req.params.id)
    })
    tracksArray.splice(index,1);
    ContentCreator.findByIdAndUpdate({_id:creator},{$set:{tracks:tracksArray}})
    .then(doc=>{
      res.status(200).json({
        message:"successfully deleted"
      })
    })
    
  })
  .catch(err=>{
    console.log(err)
    res.status(400).json({
      message:"something went wrong",
      error:err
    })
  })
}

exports.getTrackByQuery=(req,res)=>{

}

exports.getAllTracks=(req,res)=>{
    
}