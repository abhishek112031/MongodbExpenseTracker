const mongoose = require('mongoose');
// const { boolean } = require('webidl-conversions');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    expenseAmount:{
        type:Number,
        required:true,


    },
    description:{
        type:String,
        required:true,
      

    },
    category:{
        type:String,
        required:true,
        
    },
    userId:{
        type:String
    }

});
module.exports=mongoose.model('Expense',expenseSchema);