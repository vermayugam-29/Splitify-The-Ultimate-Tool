const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');

//add exppense
exports.addExpense = async (req, res) => {
    try {
        const { groupName, amount, description, splitBetween, user } = req.body;

        if (!groupName || !amount || !description || !splitBetween) {
            return res.status(406).json({
                success: false,
                message: 'Please provide all the details to add an expense'
            });
        }

        const grp = await Group.findById(groupName);
        if (!grp) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        const paidByUser = await User.findOne({ _id: amount.paidBy });
        if (!paidByUser) {
            return res.status(404).json({
                success: false,
                message: `User with email ${amount.paidBy} not found`
            });
        }

        let sum = 0.0;
        const splitBetweenIds = [];

        for (let i = 0; i < splitBetween.length; i++) {
            sum += splitBetween[i].value;
            const user = await User.findOne({ _id: splitBetween[i].personName });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: `User with email ${splitBetween[i].personName} not found`
                });
            }
            splitBetweenIds.push({
                personName: user._id,
                value: parseFloat(splitBetween[i].value).toFixed(2)
            });
        }

        if (Math.abs(sum - amount.value) < 1e-9) {
            const newExpense = await Expense.create({
                groupName,
                amount: {
                    paidBy: paidByUser._id,
                    value: parseFloat(amount.value).toFixed(2)
                },
                description,
                splitBetween: splitBetweenIds
            });

            const updatedGroup = await Group.findByIdAndUpdate(
                groupName,
                { $push: { expenses: newExpense._id } },
                { new: true }
            );

            let obj = {
                description : newExpense.description,
                _id: null,
                amountPaid: null,
                paidByName: null,
                paidById : null,
                currUser: null,
                amountPaidToUser: null,
                createdAt : newExpense.createdAt
            };

            obj._id = newExpense._id;
            const userThatPaid = await User.findById(
                { _id: newExpense.amount.paidBy }
            );
            obj.paidById = userThatPaid._id;
            obj.paidByName = userThatPaid.name;
            obj.amountPaid = newExpense.amount.value;

            for (let i = 0; i < newExpense.splitBetween.length; i++) {
                if (newExpense.splitBetween[i].personName.toString() === user.toString()) {
                    const me = await User.findById({ _id: user });
                    obj.currUser = me.name;
                    obj.amountPaidToUser = newExpense.splitBetween[i].value;
                    break;
                }
            }

            return res.status(200).json({
                success: true,
                data: obj,
                group: updatedGroup,
                message: 'Expense added successfully'
            });
        }

        res.status(400).json({
            success: false,
            message: `Total amount doesn't match the split expenses added, i.e., ${amount.value} !== ${sum}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error in adding new expense'
        });
    }
}

//delete expense
exports.deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.query;
        if (!expenseId) {
            return res.status(404).json({
                success: false,
                message: 'Please provide with an valid expense Id'
            })
        }

        const findExp = await Expense.findById({ _id: expenseId });

        if (!findExp) {
            return res.status(404).json({
                success: false,
                message: 'No such expense found'
            })
        }


        const updatedGroup = await Group.findOneAndUpdate(
            {},
            { $pull: { expenses: findExp._id } },
            { new: true }
        )


        const deleteExp = await Expense.findByIdAndDelete({ _id: findExp._id });


        res.status(200).json({
            success: true,
            group: updatedGroup,
            data : deleteExp,
            description: deleteExp.description,
            id: expenseId,
            message: 'Expense Deleted Successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error in deleting expense'
        });
    }
}

//view all expenses of a group
exports.getAllExpenses = async (req, res) => {
    try {
        const { groupName , user} = req.query;
        if (!groupName) {
            res.status(400).json({
                success: false,
                message: 'Please provide with all the details'
            })
        }

        const allExpenses = await Expense.find({ groupName });
        if (allExpenses.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No expenses of this group found'
            })
        }
        let arr = [];

        for (let i = 0; i < allExpenses.length; i++) {
            let obj = {
                description : allExpenses[i].description,
                _id: null,
                amountPaid: null,
                paidByName: null,
                paidById : allExpenses[i].amount.paidBy,
                currUser: null,
                amountPaidToUser: 0,
                createdAt : allExpenses[i].createdAt
            };
            obj._id = allExpenses[i]._id;
            const userThatPaid = await User.findById(
                { _id: allExpenses[i].amount.paidBy }
            );
            obj.paidByName = userThatPaid.name;
            obj.amountPaid = allExpenses[i].amount.value;
            
            for (let j = 0; j < allExpenses[i].splitBetween.length; j++) {
                if (allExpenses[i].splitBetween[j].personName.toString() === user.toString()) {
                    const me = await User.findById({ _id: user });
                    obj.currUser = me.name;
                    obj.amountPaidToUser = allExpenses[i].splitBetween[j].value;
                    break;
                }
            }
            arr.push(obj)
        }

        arr.reverse();

        res.status(200).json({
            success: true,
            message: 'Successfully fetched expenses of the given group',
            data: arr
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            mmessage: 'Error fetching expenses'
        })
    }
}

//view one expense
exports.viewExpenses = async (req, res) => {
    try {
        const { expenseId } = req.query;

        if (!expenseId) {
            return res.status(404).json({
                success: false,
                message: 'Please provide with a expenseId'
            })
        }

        const findExpense = await Expense.findById({ _id: expenseId });

        
        if (!findExpense) {
            return res.status(404).json({
                success: false,
                message: 'No such expense found'
            })
        }

        let arr = [];

        for(let i = 0; i < findExpense.splitBetween.length; i++){
            const user = await User.findById({_id : findExpense.splitBetween[i].personName});
            let temp = {
                id : user._id,
                name : user.name,
                amount : findExpense.splitBetween[i].value
            }
            arr.push(temp);
        }

        const paidUser = await User.findById({_id : findExpense.amount.paidBy})

        let obj = {
            expenseId : findExpense._id,
            description : findExpense.description,
            paidById : paidUser._id,
            paidByName : paidUser.name,
            amountPaid : findExpense.amount.value,
            splitBetween : arr
        }
        
        res.status(200).json({
            success: true,
            message: 'Successfully fetched the expense details',
            data: obj
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error in fetching expense by id'
        });
    }
}