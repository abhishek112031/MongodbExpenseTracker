const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User=require('../models/user')
const dotenv=require('dotenv');
dotenv.config();


exports.purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RZP_KEY_ID,
            key_secret: process.env.RZP_KEY_SECRET
        });
        const amount = 2500;
        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            // console.log(order);
            if (err) {
                // throw new Error(JSON.stringify(err));
                res.status(401).json({message:'something went wrong! try later '})
            }
            User.findById(req.user._id).then(user=>{
                let neworder=new Order({ orderid: order.id, status: 'PENDING',userId:user._id});
                return neworder.save();
            })
            .then(result=>{
                return res.status(201).json({ order, key_id: rzp.key_id })

            })
            .catch(err => {
                // throw new Error(err);
                // console.log('error======',err);
             res.status(403).json({ message: 'something went wrong', Error: err })

            });

           
        });
    }
    catch (err) {
        // console.log("err----->>>>",err);
        res.status(403).json({ message: 'something went wrong', Error: err })
    }

};

exports.updateTransactionStatus=async(req,res)=>{

    try{
        const { payment_id,order_id}=req.body;
        const order=await Order.findOne({orderid:order_id});
        const curUser= await User.findById(req.user._id);
        order.paymentid=payment_id;
        order.status='SUCCESSFUL';
        await order.save();

        curUser.isPremiumUser=true;
        await curUser.save();

        res.status(202).json({success:true,message:'Transaction Successful'});

    }
    catch(err){
        res.status(500).json(err);
    }

    

}

exports.updateTransactionStatusFailed =async(req,res)=>{

    try{
        const { payment_id,order_id}=req.body;

        const order=await Order.findOne({orderid:order_id});
        const curUser= await User.findById(req.user._id);
        order.paymentid=payment_id;
        order.status='FAILED';
        await order.save();

        curUser.isPremiumUser=false;
        await curUser.save();

        res.status(202).json({success:true,message:'Transaction Unsuccessful'});


    }
    catch(err){
        res.status(500).json(err);
    }

    

};




