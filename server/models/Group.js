const mongoose = require('mongoose');
const shortid = require('shortid'); // npm package for generating unique IDs

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        trim : true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    joinCode: {
        type: String,
        default : shortid.generate, // Generate a short unique ID for join code
        unique: true,
    },
    expenses : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Expense'
        }
    ]
});

module.exports = mongoose.model('Group', groupSchema);
