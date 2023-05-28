const path=require('path');
const Expense=require('../models/expenses');
const User=require('../models/user');


// const DownloadedFile=require('../models/downloadedFile')
// const sequelize = require('../util/database');
// const UserServices=require('../services/userservices');
// const S3Services=require('../services/S3services');


const dotenv=require('dotenv');
dotenv.config();

function invalidInput(input) {
    if (input === undefined || input.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

// exports.downloadExpense=async (req,res,next)=>{
  
//     try{
  
//       // console.log("fileurl===>>",fileUrl)
      
//       if(req.user.isPremiumUser){
//         const expenses=await UserServices.getExpenses(req);
//         // console.log(expenses);
      
//         const stringifiedExpenses=JSON.stringify(expenses);
      
//         //file name should be depend upon user id,who is going to dwnld:
//         let userId=req.user.id;
//         const fileName=`expense${userId}/${new Date()}.txt`;
//         const fileUrl= await S3Services.uploadToS3(stringifiedExpenses,fileName);//async function

//         DownloadedFile.create({

//             url:fileUrl,
//             userId:req.user.id

//         })
      
  
//         return res.status(200).json({fileUrl,success:true});
  
//       }
      
//       return res.status(500).json({message:"Please Update to Premium to Fascilate this functionality!",success:false});
    
    
//     }
//     catch(err){
//     //   console.log("s3 error--->>",err)
//       res.status(500).json({message:"something went wrong! ",success:false});
//     }
// }

exports.getExpensePage=(req, res, next) => {
    res.sendFile(path.join(__dirname,'..', 'views', 'daily-expense.html'));
};

exports.postAddExpense=async(req, res, next) => {

    try{


        const {expenseAmount,description,category}=req.body;
        if (invalidInput(expenseAmount) || invalidInput(description) ||invalidInput(category)) {
            return res.status(400).json({ message: 'input can not be empty or undefined' })
        }
        const eachExp= await new Expense({
            expenseAmount: expenseAmount,
            description: description,
            category: category,
            userId:req.user._id
            
        }).save();
        
        const totalExpense=Number(req.user.totalExpenses)+Number(expenseAmount);
        let curUser= await User.findById(req.user._id);
        curUser.totalExpenses=totalExpense;
        await curUser.save();


        res.status(201).json(eachExp);
    }
    catch(err){
       
        return  res.status(500).json({ error: err });

    }
};
exports.getEachUserExpenses=async (req,res,next)=>{
    try{
        if(!req.query.page){
            req.query = {
                page : 1,
                size : 5
            }
        }
        // console.log(req.user);
        const allExpenses = await Expense.find({userId: req.user._id}).skip((parseInt(req.query.page)-1) * parseInt(req.query.size)).limit(parseInt(req.query.size)).sort({expenseAmount: -1});
        const totalNo = await Expense.find({userId: req.user._id}).count();//no of expenses of the user
        const isPremium = req.user.isPremiumUser;

        res.status(200).json({allExpenses,totalNo,isPremium});
    }
    catch(err){
        console.log(err);
        res.status(400).json(null);
    }
}
exports.totalExpenses=async (req,res)=>{
    try{

        const totalexp = req.user.totalExpenses
        res.status(201).json(totalexp);
    }
    catch(err){
        res.status(500).json({message:"can not be fetched right now!"})
    }

}
exports.deleteExpenseById= async(req,res,next)=>{
    try{
       

        const eachExpId=req.params.Id;
        if (eachExpId===undefined || eachExpId.length===0){
            return res.status(400).json({success:false});
        }

        const exp=await Expense.findById(eachExpId);
        await Expense.findByIdAndRemove(eachExpId);
        const totalExpense=Number(req.user.totalExpenses)-Number(exp.expenseAmount);
        let curUser= await User.findById(req.user._id);
        curUser.totalExpenses=totalExpense;
        await curUser.save();

        return res.status(200).json({success:true,message:'Expense is deleted successfully!!'});

    }
    catch(err){

        return  res.status(400).json({success:false,message:'Failed'});

    }
 
}