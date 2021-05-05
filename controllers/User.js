const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const e = require('express');

exports.newUser = (req,res)=>{
    bcrypt.hash(req.body.password,10,(err,result)=>{
        if (err) {
            //send error response if error occurs while hashing password
            console.log(err)
            res.status(500).json({
                message: "error occured while storing the password",
                error: "internal server error"
            });
        }else{
            const newUser = new User({
                userName:req.body.userName,
                password:result,
                email:req.body.email,
                favourites:[],  //liked songs for listening again
                playlists:[],   //creted playlists
            })
        
            newUser.save()
            .then(doc=>{
                res.status(200).json({
                    message:"user created"
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "some error occured while storing user",
                    error: "internal server error"
                });
            });
        }
    })
}

exports.login =async (req,res)=>{
        const body = req.body;
        const user = await User.findOne({ email: body.email });
        if (user) {
          const validPassword = await bcrypt.compare(body.password, user.password);
          if (validPassword) {
            res.status(200).json({ message: "login successful" });
          } else {
            res.status(400).json({ error: "Invalid Password" });
          }
        } else {
          res.status(401).json({ error: "User does not exist" });
        }
}

exports.updateProfile = (req,res)=>{
    var updateOps = req.body;

    for (const ops in updateOps) {
        updateOps[ops.propName] = ops.value;
    }
    User.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps },{new:true})
        .select("-__v -password")
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

exports.deleteAccount = (req,res)=>{
    User.findByIdAndDelete({
        _id: req.params.id
    }).then(result => {
        res.status(200).json({
            message: "success",
            user: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "some error occured while deleting data",
            error: err
        })
    })
}

exports.findUser = (req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-__v -password")
    .then(doc=>{
        res.status(200).json({
            message:"user found",
            user:doc
        })
    })
}

exports.findUserByQuery=(req,res)=>{
    const queryName = req.query.name
    User.find({ userName: { $regex: queryName, $options: '$i' } })
        .then(doc => {
            res.status(200).json({
                message: "success",
                people: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while fetching data",
                people: err
            })
        })
}

exports.getAllUsers=(req,res)=>{
    User.find()
    .select("-__v -password")
    .then(doc=>{
        res.status(200).json({
            message:"user found",
            users:doc
        })
    })
}