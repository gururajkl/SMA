const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {JWT_PRIVATE} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {SENDGRID_API, EMAIL} = require("../config/keys");


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

//signup route
router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please enter all the fields" });
  }
  User.findOne({ email: email })  //findone find the user with email in the User schema
  .then((savedUser) => {
    if (savedUser) {
      return res.status(422).json({ error: "user already exists" });
    }
    bcrypt.hash(password, 12)
    .then (hashedpassword => {
        const user = new User({
            email,
            password: hashedpassword,
            name,
            pic
          });
          user.save()
          .then(user => {
              transporter.sendMail({
                  to:user.email,
                  from:"gururajragavendra7@gmail.com",
                  subject:"SignUp success",
                  html:"<h1 style='text-align:centre;'>Welcome to SMA</h1>  <h2>SMA is a social media web app built using MERN stack</h2> <img src='https://media.istockphoto.com/vectors/man-making-namaste-vector-id1226609385?k=6&m=1226609385&s=612x612&w=0&h=BPCiUB553VC6b6qng1NH4pGUt9V8HrZHFlfuzJlPrwU='/>"
              })
              res.json({message: 'Account created successfully'})
          })
          .catch(err => {
              console.log(err);
          });
    })
  })
  .catch(err => {
      console.log(err);
  });
});

//signin route
router.post("/signin", (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(422).json({error: 'Please enter all the fields'});
    }
    User.findOne({email: email})
    .then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({error: 'Invalid email or password'});
        }
        bcrypt.compare(password, savedUser.password)
        .then(matched => {
            if (matched) {
                // res.json({message: 'Successfuly signedIn'})
                const {_id, name, email, pic} = savedUser;
                const token = jwt.sign({_id: savedUser._id}, JWT_PRIVATE);  //jwt.sign func send unique token to user after sigining in
                res.json({token, user:{_id,name,email, pic}});
            }
            else {
                return res.status(422).json({error: 'Invalid email or password'});
            }
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });
});

//reset password
router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000  //millisecond(1hr)
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"gururajragavendra7@gmail.com",
                    subject:"Password Reset",
                    html:`
                    <h1>Remember Password this time :)</h1>
                    <img src='https://media.giphy.com/media/IgLIVXrBcID9cExa6r/giphy.gif'/>
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })

        })
    })
})


router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password update success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router;
