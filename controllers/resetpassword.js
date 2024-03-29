const path = require('path');

const mongodb=require('mongodb');
const ObjectId=mongodb.ObjectId;

const uuid = require('uuid');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config()

//models:-->
const User = require('../models/user');
const Forgotpassword = require('../models/forgotPassword');

//forgot password:-->
exports.getForgotPasswordPage = (req, res, next) => {
    res.sendFile(path.join(__dirname,'..', 'views', 'forgot-password.html'));
}

exports.postEmailidToReceivePwLink = async (req, res, next) => {
    try{
        const email = req.body.email;
        const user = await User.findOne({ emailId: email });
        if (user) {
            // console.log("user--->>>",user);
            // const id = uuid.v4().split('').slice(30).join('');
            // console.log('id==',id,typeof(id));
            let fpw=await new Forgotpassword({ active: true,userId:user._id }).save();
            let id=fpw._id;
               
            //nodemailer functionalities:--->
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "abhishek.112031@gmail.com",
                    pass: process.env.NODE_MAILER_PASSWORD
                }
            });
    
            let details = {
                from: "abhishek.112031@gmail.com",
                to: email,
                subject: 'Expense-Tracker :Reset Password link',
                text: 'click on the link',
                html: `<a href="http://localhost:${process.env.PORT}/resetpassword/${id}">Reset password</a>`
            }
            mailTransporter.sendMail(details, (err) => {
                if (err) {
                    return res.status(404).json({ message: 'Something went wrong!!' })
                }
                else {
                    res.status(201).json({ message: 'Reset password link sent to your email Id' })
                }
            });
        }
        else {

            throw new Error()
        }  
    }
    catch(err){
        console.log('kkk=',err)
        res.status(404).json({ message: 'User does not exist' })
    }
}

exports.createNewPassword = async (req, res, next) => {
    const id = req.params.id;
    // console.log("id--->", id)

    const forgotpw=await Forgotpassword.findOne({_id: id }).exec();
    try{

        if (forgotpw) {
            console.log('fp==',forgotpw)
            // forgotpw.update({ active: false });
            forgotpw.active=false;
            await forgotpw.save();
    
            res.status(200).send(`<html>
        <script>
            function formsubmitted(e){
                e.preventDefault();
                console.log('called')
            }
        </script>
        <form action="/password/updatepassword/${id}" method="get">
            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button>reset password</button>
        </form>
    </html>`
            )
            res.end()
        }
    }
    catch(err){
        throw new Error()
        
    }
}

exports.updatePassword = async (req, res, next) => {
    try{

        const { newpassword } = req.query;
        const { resetPwid } = req.params;
    
        const resetpwReq=await Forgotpassword.findById(resetPwid);
        const user=await User.findById(resetpwReq.userId);
        if (!user) {
           
            return res.status(404).json({ error: 'No user Exists', success: false })
        }
        bcrypt.hash(newpassword, 10, async function (err, hash) {
            if (err) {
                throw new Error();
            }
             user.password= hash;
             await user.save();
            // res.status(201).json({ message: 'Your Password is Successfuly updated' });
            // res.send(`<h3>Your Password is Successfuly updated<h3/>`)
            res.sendFile(path.join(__dirname,'..','views','success.html'))
                
        })
    }
    catch(err){
        res.status(500).json(err);

    }
     
}