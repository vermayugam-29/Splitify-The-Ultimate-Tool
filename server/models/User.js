const mongoose = require('mongoose');

const signUpSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true
        } ,
        email : {
            type : String,
            required : true,
            trim : true
        } ,
        password : {
            type : String,
            required : true
        } ,
        imageUrl : { 
            type : String
        } ,
        groups : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Group'
            }
        ]
    }
)

module.exports =  mongoose.model('User' , signUpSchema);