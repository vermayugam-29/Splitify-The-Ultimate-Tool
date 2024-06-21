const mongoose = require('mongoose');

const settlementSchema = mongoose.Schema(
    {
        groupName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true,
        },
        expense: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expense'
        }
        ,
        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        paidTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Settlement', settlementSchema)