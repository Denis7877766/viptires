const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const ProductSchema = new Schema({

       
    name: {
        type: String,
        default: ''
    }, 
    brand: {
        type: String,
        default: ''
    }, 
    price: {
        type: Number,
        default: 0
    },
    noPrice: {
        type: Boolean,
        default: false
    },
    img_url : {
        type: String,
        default: ''
    },
    inSale: { 
        type: Boolean,
        default: false 
    },
    disscountPrice: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 1
    },
    condition:{
        type: String,
        default: ''
    }, 
    season: {
        type: String,
        default: ''
    },
    code: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: ''
    },
    createDate: {
        type: Date,
        default: Date.now
    }
 
})


module.exports = Prouct = mongoose.model('Product', ProductSchema)