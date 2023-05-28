const mongoose = require('mongoose');
// const { boolean } = require('webidl-conversions');
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
  active:{type:Boolean

  },
 userId:{
    type:String
 }

});
module.exports=mongoose.model('Forgotpassword',forgotPasswordSchema);