const express = require('express')
const router = express.Router() 
 
const axios = require('axios')

// @route    GET api/currency/used
// @desc     Get USD rate
// @access   Public
router.get('/usd' , async ( req, res) => { 
   
    const reqUrl = `https://api.businessonline.ge/api/rates/nbg/usd`
  
    let dt = ''
    await axios({
      method: 'get',
      url: reqUrl, 
      validateStatus: (status) => {
        return true; 
      },
    }).catch(error => {
      console.log(error)
    }).then(res => { 
      dt = res.data
    }) 
    res.json({data: dt}) 
})
 
 
 
module.exports = router