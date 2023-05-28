const mongoose = require('mongoose');
// const { boolean } = require('webidl-conversions');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    isPremiumUser:{
        type:Boolean,
        default:false
    },
    
    totalExpenses:{
        type:Number,
        default:0

    }

});
module.exports=mongoose.model('User',userSchema);