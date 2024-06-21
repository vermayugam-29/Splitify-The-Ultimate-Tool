const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
    {
        groupName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        },
        amount: {
            paidBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        },
        description: {
            type: String,
            required: true,
            trim : true
        },
        splitBetween: [
            {
                personName: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                value: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Expense', expenseSchema);
