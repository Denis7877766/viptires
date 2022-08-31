const express = require('express')
const router = express.Router() 
const cloudinary = require('cloudinary').v2

// User Model
const Product = require('../../models/Prouct') 

// @route    GET api/proucts
// @desc     Get all products
// @access   Public
router.get('/' , ( req, res) => {
    Product
    .find()
    .sort( { createDate:  -1 } )
    .then(  records => {
      let data = []
        
      for(let i=0; i< records.length ; i++){ 
        let condition_display = ''
        if(records[i].condition ==='secondary'){
          condition_display = 'მეორადი'
        }
        if(records[i].condition ==='used'){
          condition_display = 'მეორადი'
        }
        if(records[i].condition ==='new'){
          condition_display = 'ახალი'
        }
  
        let inSale_display = ''
        if(records[i].inSale){
          inSale_display = 'აქტიური'
        }
        let { _id,noPrice, name, img_url, brand, price, inSale, disscountPrice,quantity,condition,season,code,size } =  records[i]
        data.push({ inSale_display,noPrice, condition_display,  _id, name, img_url, brand, price, inSale, disscountPrice,quantity,condition,season,code,size})
         
      }
      res.send(data)
    }) 
})
 
// @route    Delete api/proucts
// @desc     Delete a prouct
// @access   Public
router.put('/' , ( req , res) => {
    Product.findById(req.body._id)
       .then(user => user.remove().then(() => res.json({success: true})))
       .catch(err => res.status(404).json({success: false}))
})
 
// @route   POST api/proucts
// @desc    Create  a product
// @access  Public
router.post(
    '/create', 
    (req, res) => {
       
        // Get fields
        const productFields = {}  
        if (req.body.name != null) productFields.name = req.body.name; 
        if (req.body.img_url!= null) productFields.img_url = req.body.img_url; 
        if (req.body.brand != null) productFields.brand = req.body.brand; 
        if (req.body.price != null) productFields.price = req.body.price; 
        if (req.body.inSale != null) productFields.inSale = req.body.inSale; 
        if (req.body.disscountPrice != null) productFields.disscountPrice = req.body.disscountPrice; 
        if (req.body.quantity != null) productFields.quantity = req.body.quantity; 
        if (req.body.condition != null) productFields.condition = req.body.condition; 
        if (req.body.season != null) productFields.season = req.body.season; 
        if (req.body.code != null) productFields.code = req.body.code; 
        if (req.body.size != null) productFields.size = req.body.size; 
        if (req.body.noPrice != null) productFields.noPrice = req.body.noPrice; 
  
     
    
        Product.findOne( { code: req.body.code}  ).then(db_record => {
        if (db_record) {
            res.json({status: "The product code already exists, Please try with different code "}) 
        } else { 
            new Product(productFields).save().then(product => res.json({status: "Created", product})) 
        }
        })
      

    }
  )
  
// @route   POST api/products/update
// @desc    Update product
// @access  Public
router.post(
  '/update', 
  (req, res) => {
       
      // Get fields
      const productFields = {}  
      if (req.body.name != null) productFields.name = req.body.name; 
      if (req.body.img_url != null) productFields.img_url = req.body.img_url; 
      if (req.body.brand != null) productFields.brand = req.body.brand; 
      if (req.body.price != null) productFields.price = req.body.price; 
      if (req.body.inSale != null) productFields.inSale = req.body.inSale; 
      if (req.body.disscountPrice != null) productFields.disscountPrice = req.body.disscountPrice; 
      if (req.body.quantity != null) productFields.quantity = req.body.quantity; 
      if (req.body.condition != null) productFields.condition = req.body.condition; 
      if (req.body.season != null) productFields.season = req.body.season; 
      if (req.body.code != null) productFields.name = req.body.code; 
      if (req.body.size != null) productFields.size = req.body.size; 
      if (req.body.noPrice != null) productFields.noPrice = req.body.noPrice;
   

      Product.findOne( { _id: req.body._id}  ).then(db_record => {

      if (db_record) {
           // Update
          Product.findOneAndUpdate(
            { _id: req.body._id },
            { $set: productFields }, 
            { new: true }
          ).then(product => res.json({status: 'updated', product}));
      } else {
         res.status(404).json({status: "Please refresh and try again!"}) 
      }
    })
  }
) 



// @route   POST api/products/upload
// @desc    Upload product image
// @access  Public
router.post(
  '/upload', 
  async (req, res) => {
       
    const CLOUDINARY_API_KEY = '337589398971936'
    const CLOUDINARY_API_SECRET = 'pQ3Px_k-VNL26L9Ab4O3MhQZSBw'
    const CLOUDINARY_NAME = 'dctglbpob'



    cloudinary.config({
        cloud_name: CLOUDINARY_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
    })


    // Get data
     const base64EncodedImage = req.body.data
      
     const fileStr = base64EncodedImage
     const uploadResponse = await cloudinary.uploader.upload(fileStr)

     if(uploadResponse != null && uploadResponse != undefined){
       console.log('PASSED 1')
       if(uploadResponse.hasOwnProperty('url')){
        console.log('PASSED 2')
        res.json({succeed: true, url: uploadResponse.url})
       }else{
         res.json({succeed: false, url: ''})
       }
     }else{
       res.json({succeed: false, url: ''})
     }
   
       
     
    
  }
) 
 
module.exports = router