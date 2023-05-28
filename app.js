const path=require('path');
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const dotenv=require('dotenv');
dotenv.config();

const app=express();

const mongoose=require('mongoose');
// const User=require('./models/user');

//main routes:
const userRoute=require('./routers/user');
const expenseRoute=require('./routers/expense');
const purchaseRoute=require('./routers/purchase');
const premiumFeatureRoute=require('./routers/premiumFeatures');
const resetPasswordRoute=require('./routers/resetPassword');







app.use(express.static(path.join(__dirname,'public')));
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(userRoute);
app.use(expenseRoute);
app.use(purchaseRoute);
app.use(premiumFeatureRoute);
app.use(resetPasswordRoute);




// app.get('/',async (req,res)=>{
//     try{

//         let user= await new User({
//             name:'abhishek adhikary',
//             emailId:'abhishek.112031@gmail.com',
//             password:'xyz'

//         }).save();

//         res.status(200).json(user);
//     }
//     catch(err){
//         console.log(err)
//     }

    


// });

mongoose.connect(process.env.CONNECTION_STRING).then(result=>{
  app.listen(3000);
  console.log('app is running on port 3000')
})
.catch(err=>{
  console.log(err)
})
