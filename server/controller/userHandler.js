const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const generateDefault = require('../utils/defaultImgHandler');
const Group = require('../models/Group');
const Settlement = require('../models/Settlement');
const Expense = require('../models/Expense');

function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder };

    if (quality) {
        options.quality = quality;
    }

    options.resource_type = 'auto';
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

//user sign-up
exports.signUp = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;
        const file = req.files ? req.files.image : null;

        if (!name || !email || !password || !otp) {
            return res.status(403).json({
                success: 'false',
                message: 'Please provide all the fields'
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists please try with another email'
            })
        }

        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (response.length === 0 || otp !== response[0].otp) {
            return res.status(400).json({
                success: false,
                message: 'OTP is not valid'
            })
        }

        //hashing password using bcrypt library
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `Hashing password error for ${password}: ` + error.message,
            });
        }

        let imageUrl;
        if (file) {
            const supportedTypes = ['jpg', 'jpeg', 'png'];

            const extension = file.name.split('.').at(-1).toLowerCase();

            if (!isFileTypeSupported(extension, supportedTypes)) {
                return res.status(400).json({
                    success: false,
                    message: 'File format not supported'
                })
            }

            const sizeLimit = 500 * 1024;

            if (file.size > sizeLimit) {
                return res.status(404).json({
                    success: false,
                    message: 'Image should be less than 500Kb'
                })
            }


            const cloudinaryResponse = await uploadFileToCloudinary(file, 'practice');
            if (cloudinaryResponse && cloudinaryResponse.secure_url) {
                imageUrl = cloudinaryResponse.secure_url;
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload image to Cloudinary'
                });
            }
        } else {
            imageUrl = generateDefault(name);
        }

        const newUser = await User.create({
            name, email, password: hashedPassword, imageUrl
        });

        return res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message ,
            message : 'Something went wrong'
        });
    }
}

//user log-in
exports.logIn = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'The required fields cannot be empty'
            })
        }

        const findUser = await User.findOne({ email });

        if (!findUser) {
            return res.status(401).json({
                success: false,
                message: 'User is not registered yet'
            })
        }

        const payload = {
            email: findUser.email,
            id: findUser._id,
            imageUrl : findUser.imageUrl
        };

        if (await bcrypt.compare(password, findUser.password)) {
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2d'
            })


            findUser.token = token;
            findUser.password = undefined;

            //set cookie and cookie time period for generated token
            const generateCookie = {
                expires: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)),
                httpOnly: true,
            }


            return res.cookie('token_generated', token, generateCookie).status(200)
            .json({
                success: true,
                token: token,
                user: findUser,
                message: 'User logged in Successfully'
            });
        }

        res.status(401).json({
            success: false,
            message: `Password is incorrect`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        });
    }
}


//reset password
exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'please provide with a email before logging in'
            })
        }
        let user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'No such user exists'
            })
        }


        //hashing password using bcrypt library
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `Hashing password error for ${password}: `,
                err: error.message,
            });
        }

        user = await User.findOneAndUpdate(
            { email: email },
            { password: hashedPassword },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reseting password',
            err: error.message
        })
    }
}

//change password
exports.changePassword = async (req, res) => {
    try {
        const { email, oldPass, newPass } = req.body;
        if (!email || !oldPass || !newPass) {
            return res.status(400).json({
                success: false,
                message: 'Please provide with all the details for updating password'
            })
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No such user found , Please sign up first'
            })
        }


        const payload = {
            email: user.email,
            id: user._id,
        };
        if (await bcrypt.compare(oldPass, user.password)) {
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '24h'
            })


            // findUser = findUser.toObject();
            user.token = token;
            user.password = undefined;

            //set cookie and cookie time period for generated token
            const generateCookie = {
                expires: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)),
                httpOnly: true
            }

            let hashedPassword;
            try {
                hashedPassword = await bcrypt.hash(newPass, 10);
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: `Hashing password error for ${newPass}: `,
                    err: error.message,
                });
            }


            user = await User.findOneAndUpdate(
                { email: email },
                { password: hashedPassword },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: 'Successfully change password',
                data: user
            })
        }

        res.status(401).json({
            success: false,
            message: 'Old password was incorrect'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error while changing password'
        })
    }
}

//delete user
exports.deleteUser = async (req, res) => {
    try {
        //user needs to provide with email as well as password to delete account
        const { email, password } = req.query;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide with email and password to delete the account'
            })
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No such user found'
            })
        }
        let id = user._id;


        if (await bcrypt.compare(password, user.password)) {
            //group se naam hatana agar admin ha to group hatana
            let grp = await Group.findOneAndDelete(
                { admin: user._id }
            );
            if (grp) {
                user = await User.findByIdAndUpdate(
                    { _id: id },
                    { $pull: { groups: grp._id } },
                    { new: true }
                );
                for(let i = 0; i < grp.expenses.length; i++){
                    const allExpDel = await Expense.findByIdAndDelete(
                        {_id : grp.expenses[i]}
                    );
                }
            }
            for (let i = 0; i < user.groups.length; i++) {
                grp = await Group.findByIdAndUpdate(
                    { _id: user.groups[i] },
                    { $pull: { members: user._id } },
                    { new: true }
                );
            }
            //settlement se hatana
            let delSettlements;
            do {
                delSettlements = await Settlement.findOneAndDelete({
                    $or: [
                        { paidBy: id },
                        { paidTo: id }
                    ]
                });
            } while (delSettlements)

           

            //expenses se hatana
            let delExpenses = await Expense.findOneAndDelete(
                { 'amount.paidBy': id }
            );

            delExpenses = await Expense.findOneAndUpdate(
                { 'splitBetween.personName': id },
                { $pull: { splitBetween: { personName: id } } },
                { new: true }
            );

            while (delExpenses) {
                delExpenses = await Expense.findOneAndUpdate(
                    { 'splitBetween.personName': id },
                    { $pull: { splitBetween: { personName: id } } },
                    { new: true }
                );
            }


            user = await User.findByIdAndDelete({ _id: id });
            return res.status(200).json({
                success: true,
                message: 'Account deleted successfully',
                data: user,
            })
        }

        res.status(401).json({
            success: false,
            message: 'Incorrect password'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            err: error.message,
            message: 'Error deleting user id'
        })
    }
}


//edit user name
exports.editName = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide with all the detaiils for updating id'
            })
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Please provide with a valid email id'
            })
        }
        let id = user._id;

        user = await User.findByIdAndUpdate({ _id: id }, { name: name }, { new: true });

        res.status(200).json({
            success: true,
            message: 'Successfully updated user',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            err: error.message,
            message: 'Error changing users name'
        })
    }
}

//get user details
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById({_id : req.userId}).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
};