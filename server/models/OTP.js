const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            required : true
        } ,
        otp : {
            type : String ,
            required : true,
        },
        createdAt : {
            type : Date,
            default : Date.now(),
            expires : 60 * 3,
        }
    }
)

//function to send emails
async function sendVerificationEmail(email , otp){
    try {
        const mailResponse = await mailSender(
            email ,
            'Verification Email' ,
            `
                <h1> Please confirm your otp</h1>
                <p> Here is your otp : ${otp} </p>
            `
        );
    } catch (error) {
        console.log(error);
        throw error
    }
}

otpSchema.pre('save' , async function(next) {
    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp);
    }
    next();
})

module.exports = mongoose.model('OTP' , otpSchema);