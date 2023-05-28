const Expense=require('../models/expenses');
const User=require('../models/user');
const path=require('path');


exports.premiumUser=async (req,res)=>{
    try{

   if(req.user.isPremiumUser){
    return res.status(200).json({success:true,message:'You Are A Premium User' ,name:req.user.name})
   }


}
catch(err){
    res.status(500).json(err);
}

};
exports.premiumLeaderBoard=async(req,res)=>{
    try{

      
        const aggrigated_expenses= await User.find().populate('name totalExpenses');
        aggrigated_expenses.sort((a,b)=>{
            return b.totalExpenses-a.totalExpenses;
        });
        // console.log('====',aggrigated_expenses)

      res.status(200).json(aggrigated_expenses);

    }
    catch(err){
        // console.log("err===>",err);
        res.status(500).json({message:"something went wrong!"});

    }
}

