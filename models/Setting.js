const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const SettingSchema = new Schema({
 

    name: {
        type: String,
        default: ''
    },
    value: {
        type: Number,
        default: 0
    },  
    createDate: {
        type: Date,
        default: Date.now
    }
 
})


module.exports = Setting = mongoose.model('Setting', SettingSchema)