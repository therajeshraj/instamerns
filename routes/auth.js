const express = require('express')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")
const requireLogin = require('../middleware/requireLogin')

const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const sendgridTransport = require('nodemailer-sendgrid-transport')
// const { default: NewPassword } = require('../client/src/screens/NewPassword')

const {SENDGRID_API, EMAIL} = require('../config/keys')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))

const router = express.Router()

const validField = {
    "status": false,
    "message": "All fields are required"
}

const errorField = {
    "status": false,
    "message": "User already exist"
}

const successLogin = {
    "status": true,
    "message": "Login Successful"
}

const validLogin = {
    "status": false,
    "message": "Invalid email or password"
}

const successField = {
    "status": true,
    "message": "Signed up successfully"
}

// router.get('/',(req, res) => {
//     res.send("hello -- world")
// })

// router.get('/protected',requireLogin, (req, res) => {
//     res.send("hello user")
// })



router.post('/signup',(req, res)=> {
    const {name, email, password, pic} = req.body

    if(!name || !email || !password) {
        return res.send(validField, 422)
    }

    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser) {
            return res.status(422).json(errorField)
        }

        bcrypt.hash(password, 12)
        .then(hashedpassword => {

            const user = new User({
                name,
                email,
                password: hashedpassword,
                pic
            })
    
            user.save()
            .then(user => {

                transporter.sendMail({
                    to:email,
                    from: "ricimih857@tjuln.com",
                    subject: "Signup Success",
                    html: "<h1>Welcome to InstaMern</h1>"
                })
                .then((dataRes) => {
                    console.log(dataRes)
                })
                .catch((err) => {
                    console.log(err)
                })

                res.status(200).json(successField)
            })
            .catch(err=>{
                console.log(err)
            })

        })

        

    })
    .catch(err=> {
        console.log(err)
    })

    //res.send(successField)
    //console.log(req.body.name)
})


router.post('/signin', (req, res)=> {

    const {email, password} = req.body

    if(!email || !password) {
        return res.status(422).json(validField)
    }

    User.findOne({email: email})
    .then(savedUser => {
        if(!savedUser) {
            return res.status(422).json(validLogin)
        }

        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch) {

                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)

                const {_id, name, email, followers, following, pic} = savedUser

                res.json({token, status: true, user: {_id, name, email, followers, following, pic}})

                //res.json(successLogin)
            } else {
                return res.status(422).json(validLogin)
            }
        })
        .catch(err=> {
            console.log(err)
        })
    })
    .catch(err=> {
        console.log(err)
    })

})

router.post('/reset-password', (req,res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err)
        }

        const token = buffer.toString("hex")

        User.findOne({email: req.body.email})
        .then(user=> {
            if(!user) {
                return res.status(422).json({error: "User does not exist"})
            }

            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save()
            .then((result) => {
                transporter.sendMail({
                    to: req.body.email,
                    from: "ricimih857@tjuln.com",
                    subject: "Reset Password",
                    html: `
                    <p>You requested for password reset</p>
                    <h5>Click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                    
                    `
                })
                .then((dataRes) => {
                    console.log(dataRes)
                })
                .catch((err) => {
                    console.log(err)
                })

                res.json({message: "Please check your email"})

            })

        })
    })
})


router.post('/new-password', (req,res) => {
    const newPassword = req.body.password
    const sendToken = req.body.token

    User.findOne({resetToken:sendToken, expireToken:{$gt:Date.now()}})
    .then(user => {

        if(!user) {
            return res.status(422).json({error: "Session Exired"})
        }

        bcrypt.hash(newPassword, 12)
        .then(hashedpassword => {
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save()
            .then((savedUser) => {
                res.json({message: "Password update success"})
            })
        })

    }).catch(err => {
        console.log(err)
    })

})

module.exports = router