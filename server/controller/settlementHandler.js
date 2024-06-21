const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');

//get all settlements
exports.getAllSettlements = async (req, res) => {
    try {
        const { groupName } = req.query;
        if (!groupName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide groupId'
            })
        }

        const allSettle = await Settlement.find({ groupName });

        if (!allSettle) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No expense has been settled yet'
            })
        }

        let arr = []

        for (let i = 0; i < allSettle.length; i++) {
            let obj = {
                paidById: allSettle[i].paidBy,
                paidByName: null,
                paidToId: allSettle[i].paidTo,
                paidToName: null,
                amount: allSettle[i].amount,
                updatedAt: allSettle[i].updatedAt
            };
            const userThatPaid = await User.findById(
                { _id: allSettle[i].paidBy }
            );
            const userWhoWasPaid = await User.findById(
                { _id: allSettle[i].paidTo }
            );
            obj.paidByName = userThatPaid.name;
            obj.paidToName = userWhoWasPaid.name;
            arr.push(obj);
        }

        res.status(200).json({
            success: true,
            data: arr,
            message: 'All the settlements fetched successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            mmessage: 'Error fetching settlements'
        })
    }
}

//settlement by id
exports.getSettlementById = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Please provide with a id to fetch details'
            })
        }

        const findSettlement = await Settlement.findById({ _id: id });

        if (!findSettlement) {
            return res.status(404).json({
                success: false,
                message: 'Please provide a valid settlement id'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Settlement fetched successfully',
            data: findSettlement
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            mmessage: 'Error fetching settlements'
        })
    }
}

exports.settleOverall = async (req, res) => {
    try {
        const { groupName, paidBy, paidTo, amount } = req.body;

        if (!groupName || !paidBy || !paidTo || amount === null) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all the details to settle amount'
            })
        }


        let newSettle = await Settlement.findOne(
            { groupName, paidBy, paidTo }
        );


        let id = newSettle ? newSettle._id : null;
        let amountPaid = newSettle ? newSettle.amount : 0;

        if (!newSettle) {
            newSettle = await Settlement.create(
                { groupName, paidBy, paidTo, amount }
            );
        } else {
            newSettle = await Settlement.findByIdAndUpdate(
                { _id: id },
                { amount: amount + amountPaid }
            );
        }

        const userThatPaid = await User.findById({_id : paidBy});
        const userForWhomPaid = await User.findById({_id : paidTo});

        let obj = {
            paidById: newSettle.paidBy,
            paidByName: userThatPaid.name,
            paidToId: newSettle.paidTo,
            paidToName: userForWhomPaid.name,
            amount: newSettle.amount,
            updatedAt: newSettle.updatedAt
        };

        
        res.status(200).json({
            success: true,
            message: 'Successfully settled balance',
            data: obj
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            mmessage: 'Error settling the balance amount'
        })
    }
}