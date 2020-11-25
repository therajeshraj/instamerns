const express = require('express')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')
const { route } = require('./auth')

const router = express.Router()

router.get('/alluser', requireLogin, (req, res) => {

    User.find()
    .select("-password")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
        if(err) {
            return res.status(422).json({error: err})
        } else {
            res.json({result})
        }
    })
    

})

router.get('/user/:id', requireLogin, (req, res) => {

    User.findOne({_id:req.params.id})
    .select("-password")

    .then(user=> {
        Post.find({postedBy: req.params.id})
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
            if(err) {
                return res.status(422).json({error: err})
            } else {
                res.json({user, posts})
            }
        })
    })
    .catch(err => {
        return res.status(422).json({error: err})
    })

})

router.put('/follow', requireLogin, (req,res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push:{followers: req.user._id}
        },{
            new: true
        },
        (err, result) => {
            if(err) {
                return res.status(422).json({error: err})
            }
            User.findByIdAndUpdate(req.user._id, {
                $push:{following: req.body.followId}
            },{
                new: true
            }).select("-password")
            .then(result => {
                res.json(result)
            }).catch(err => {
                res.status(422).json({error: err})
            })
        }
    )
})

router.put('/unfollow', requireLogin, (req,res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull:{followers: req.user._id}
        },{
            new: true
        },
        (err, result) => {
            if(err) {
                return res.status(422).json({error: err})
            }
            User.findByIdAndUpdate(req.user._id, {
                $pull:{following: req.body.unfollowId}
            },{
                new: true
            }).select("-password")
            .then(result => {
                res.json(result)
            }).catch(err => {
                res.status(422).json({error: err})
            })
        }
    )
})

router.put('/updatepic', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {$set:{pic:req.body.pic}}, {new: true},

        (err, result) => {

            if(err) {
                return res.status(422).json({error: err})
            }

            res.json(result)

        })
})

router.post('/search-users', requireLogin, (req,res) => {
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email: {$regex: userPattern}})
    .select("_id email")
    .then(user => {
        res.json({user})
    })
    .catch(err => {
        res.json({error: "No data found"})
    })

})

module.exports = router