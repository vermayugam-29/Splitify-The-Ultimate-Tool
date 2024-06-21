const otpGenerator = require('otp-generator');
const OTP = require('../models/OTP');
const User = require('../models/User');

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if there's an existing OTP for the email that is less than 3 minutes old
        const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (recentOTP) {
            const currentTime = new Date();
            const recentTime = recentOTP.createdAt;
            
            const timeDifference = (currentTime - recentTime) / 1000 / 60; // Convert milliseconds to minutes

            if (timeDifference < 3) {
                return res.status(429).json({
                    success: false,
                    otp : recentOTP.otp,
                    message: 'You can only request a new OTP after 3 minutes.',
                });
            }
        }

        // Generate a new OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Ensure the OTP is unique
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        // Create a new OTP entry in the database
        const otpEntryInDb = await OTP.create({ email, otp });

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp: otpEntryInDb.otp
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error in OTP controller',
        });
    }
};


exports.verifyOtp = async(req , res) => {
    try {
        const {email , otp} = req.query;
        if(!email || !otp){
            return res.status(400).json({
                sucess : false,
                message : 'Please provilde all the details to reset password'
            })
        }

        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if(response.length === 0 || response[0].otp !== otp){
            return res.status(400).json({
                success : false,
                message : 'Please enter valid otp'
            })
        }

        res.status(200).json({
            success : true,
            message : 'You may now proceed',
            data : otp
        })

    } catch (error) {
        res.status(500).json({
            success : false, 
            message : 'Something went wrong while verifying otp',
            error : error.message
        })
    }
}