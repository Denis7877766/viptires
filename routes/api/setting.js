const express = require('express')
const router = express.Router() 


// Setting Model
const Setting = require('../../models/Setting') 

// @route    GET api/settings
// @desc     Get all settings
// @access   Public
router.get('/' , ( req, res) => {
    Setting
    .find()
    .sort( { createDate:  -1 } )
    .then(  settings =>   res.send(settings)) 
})
   
  
// @route    GET api/settings/usd_rate
// @desc     Get only usd rate value
// @access   Public
router.get('/usd_rate' , ( req, res) => {
  Setting
  .find({name: "last_currency_rate"}) 
  .then(  settings =>   res.json(settings)) 
})


// @route   POST api/settings/update
// @desc    Update setting
// @access  Public
router.post(
  '/update/currency', 
  (req, res) => {
       
  // Get fields
  const settingFields = {}  
  if (req.body.name != null) settingFields.name = req.body.name;  
  if (req.body.value != null) settingFields.value = req.body.value;  


  Setting.findOne( { name: req.body.name}  ).then(record => {

      if (record) {
           // Update
          Setting.findOneAndUpdate(
            { name: req.body.name },
            { $set: settingFields }, 
            { new: true }
          ).then(settings => res.json({status: 'updated', settings}));
      }else { 
        new Setting(settingFields).save().then(settings => res.json({status: "Created", settings}))  
      }
    })
  }
) 
 
module.exports = router