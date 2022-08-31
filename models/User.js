const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const UserSchema = new Schema({

     
    name: {
        type: String,
        default: ''
    }, 
    password:{
        type: String,
        default: ''
    }, 
    role: {
        type: String,
        default: ''
    },
    createDate: {
        type: Date,
        default: Date.now
    }
 
})


module.exports = User = mongoose.model('Users', UserSchema)