const Expense = require('../models/Expense');
const Group = require('../models/Group');
const Settlement = require('../models/Settlement');
const User = require('../models/User');


exports.viewBalance = async (req, res) => {
    try {
        const { groupName, user } = req.query;

        if (!groupName || !user) {
            return res.status(400).json({
                success: false,
                message: 'Please provide group name and user ID to view balance'
            });
        }

        const grp = await Group.findById(groupName);
        if (!grp) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        const userFind = await User.findById(user);
        if (!userFind) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const paidByMe = await Expense.find({ groupName, 'amount.paidBy': user });
        const paidForMe = await Expense.find({ groupName, 'splitBetween.personName': user });

        let uniquePaidFor = {};

        paidByMe.forEach((expense) => {
            expense.splitBetween.forEach((split) => {
                if (split.personName.toString() !== user.toString()) {
                    let paidForKey = split.personName.toString();
                    if (!uniquePaidFor[paidForKey]) {
                        uniquePaidFor[paidForKey] = {
                            paidFor: split.personName,
                            amount: 0
                        };
                    }
                    uniquePaidFor[paidForKey].amount += (split.value);
                }
            });
        });



        let arr = Object.values(uniquePaidFor);

        let uniquePaidBy = {};

        paidForMe.forEach((expense) => {
            expense.splitBetween.forEach((person) => {
                if (person.personName.toString() === user.toString() && user.toString() !== expense.amount.paidBy.toString()) {
                    let paidByAnotheKey = expense.amount.paidBy.toString();
                    if (!uniquePaidBy[paidByAnotheKey]) {
                        uniquePaidBy[paidByAnotheKey] = {
                            paidBy: expense.amount.paidBy,
                            amount: 0
                        };
                    }
                    uniquePaidBy[paidByAnotheKey].amount += person.value;
                }
            });
        });

        let arr2 = Object.values(uniquePaidBy);
        let map = {};

        for (let i = 0; i < arr.length; i++) {
            let key = arr[i].paidFor.toString();
            map[key] = {
                paidFor: arr[i].paidFor,
                amount: arr[i].amount
            };
        }

        for (let i = 0; i < arr2.length; i++) {
            let key = arr2[i].paidBy.toString();
            if (!map[key]) {
                map[key] = {
                    paidFor: arr2[i].paidBy,
                    amount: arr2[i].amount * -1
                };
            } else {
                map[key].amount -= arr2[i].amount;
            }
        }


        let ans = Object.values(map).filter((e) => e.amount !== 0);

        for (let i = 0; i < ans.length; i++) {
            const settlemetByMe = await Settlement.findOne(
                { groupName, paidBy: user, paidTo: ans[i].paidFor }
            );
            let amount = settlemetByMe ? settlemetByMe.amount : 0;
            ans[i].amount = ans[i].amount + amount;
            ans[i].amount = parseFloat(ans[i].amount).toFixed(2);
        }
        for (let i = 0; i < ans.length; i++) {
            const settlemetByPerson = await Settlement.findOne(
                { groupName, paidBy: ans[i].paidFor, paidTo: user }
            );
            let amount = settlemetByPerson ? settlemetByPerson.amount : 0;
            ans[i].amount = ans[i].amount - amount;
            ans[i].amount = parseFloat(ans[i].amount).toFixed(2);
        }



        for (let i = 0; i < ans.length; i++) {
            const findUser = await User.findById({ _id: ans[i].paidFor });
            ans[i] = { ...ans[i], name: findUser.name };
        }
        return res.status(200).json({
            success: true,
            data: ans,
            message: 'Successfully fetched group balance'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error in processing balance'
        });
    }
};