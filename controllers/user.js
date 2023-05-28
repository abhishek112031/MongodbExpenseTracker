const path=require('path');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

const User=require('../models/user');

function invalidInput(input) {
    if (input === undefined || input.length === 0) {
        return true;
    }
    else {
        return false;
    }
}
function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name }, process.env.SECRET_TOKEN_KEY)
}
exports.getSignUpPage = (req, res, next) => {
    res.sendFile(path.join(__dirname,'..', 'views', 'signUp.html'));
}

exports.postNewUserDetails = (req, res, next) => {

    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;

    // const {user,email,password}=req.query
    if (invalidInput(email) || invalidInput(password) || invalidInput(user)) {
        return res.status(400).json({ message: 'input can not be empty or undefined' });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
        try {

        const users=await new User({
                name: user,
                emailId: email,
                password: hash
            }).save();
            // console.log("new user--->",users);
            res.status(201).json({ message: 'user is created successfully', success: true })
        }
        catch (err) {
            console.log('err=',err)
            res.status(500).json({ message: "email id already exist", success: false });

        }

    })



}

exports.getLogInPage = (req, res, next) => {
    res.sendFile(path.join(__dirname,"..", 'views', 'login.html'));
}

exports.postLogInDetails = async (req, res, next) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        if (invalidInput(email) || invalidInput(password)) {
            return res.status(400).json({ message: 'input can not be empty or undefined' })
        }
        const user = await User.find({ emailId: email });
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'something went wrong!' })

                }
                if (result === true) {
                    res.status(200).json({ success: true, message: 'Logged in successful', token: generateAccessToken(user[0].id, user[0].name) })
                }
                else {
                    return res.status(400).json({ success: false, message: 'Incorrect Password! Please refresh the page and Enter again' })

                }
            });
        }
        else {
            return res.status(404).json({ success: false, message: 'user does not exist' })

        }
    }

    catch (err) {
        res.status(500).json({ message: err, success: false })
    }


};
