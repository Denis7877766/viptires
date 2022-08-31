const express = require('express')
const router = express.Router()  
const sha256 = require('js-sha256')
const AUTH_USER  = require('../../config/keys').user
const AUTH_PASS  = require('../../config/keys').pass
// User Model
const User = require('../../models/User')  


// @route    GET api/users
// @desc     Get all users
// @access   Public
router.get('/' , ( req, res) => {
    User
    .find()
    .sort( { createDate:  -1 } )
    .then(  records =>   res.send(records)) 
})
 
// @route    Delete api/users
// @desc     Delete a user
// @access   Public
router.put('/' , ( req , res) => {
    User.findById(req.body._id)
       .then(user => user.remove().then(() => res.json({success: true})))
       .catch(err => res.status(404).json({success: false}))
})
 
 
// @route    Authorize api/users/auth
// @desc     Authorize
// @access   Public
router.post('/auth' , async ( req , res) => {
    const username = req.body.username
    const password = req.body.password

    let sh_user = sha256(username)
    let sh_pass = sha256(password) 
    
    if( sh_user.toString() === AUTH_USER.toString() && sh_pass.toString() === AUTH_PASS.toString()){
      res.json({succeed: true})
    }else{
      res.json({succeed: false})
    }
      

})
// @route   POST api/users
// @desc    Create  user profile
// @access  Public
router.post(
    '/create', 
    (req, res) => {
      console.log('req.body', req.body) 
      // Get fields
      const userFields = {}  
      
      if (req.body.name != null && req.body.password != null && req.body.role != null) {
        userFields.name = req.body.name; 
        userFields.password = req.body.password; 
        userFields.role = req.body.role;  
        
          User.findOne( { name: req.body.name}  ).then(user => {
            if (user) {
              res.json({status: "The user already exists, Please try with different name "}) 
            } else { 
                new User(userFields).save().then(user => res.json({status: "Created", user})) 
            }
          })
      }else{
        res.json({status: "The user fiels are required"}) 
      }
    

    }
  )
  
// @route   POST api/users/update
// @desc    Update user profile
// @access  Public
router.post(
  '/update', 
  (req, res) => {
       
  // Get fields
  const userFields = {}  
  if (req.body.name != null) userFields.name = req.body.name; 
  if (req.body.password != null) userFields.password = req.body.password; 
  if (req.body.role != null) userFields.role = req.body.role;  


    User.findOne( { _id: req.body._id}  ).then(user => {

      if (user) {
           // Update
          User.findOneAndUpdate(
            { _id: req.body._id },
            { $set: userFields }, 
            { new: true }
          ).then(user => res.json({status: 'updated', user}));
      } else {
         res.status(404).json({status: "Please refresh and try again!"}) 
      }
    })
  }
) 
 
module.exports = router