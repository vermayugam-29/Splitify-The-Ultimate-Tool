const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');

//create new group
exports.createGroup = async (req, res) => {
    try {
        const { groupName, admin } = req.body;
        //check if there is already a group with suuch name
        if (!groupName || !admin) {
            return res.status(404).json({
                success: false,
                message: 'Please provide all necessary details'
            })
        }
        const user = await User.findOne({ email: admin })

        const newGroup = await Group.create({ groupName, admin: user._id, members: [user._id] });
        const updatedUserDetails = await User.findByIdAndUpdate(
            { _id: user._id },
            { $push: { groups: newGroup._id } },
            { new: true }
        )
        res.status(200).json({
            success: true,
            message: 'new group created',
            data: newGroup,
            updatedUser: updatedUserDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Request rejeced '
        })
    }
}


//join group
exports.joinGroup = async (req, res) => {
    try {
        const { members, joinCode } = req.body;

        if(!members || ! joinCode){
            return res.status(400).json({
                uccess : false,
                message : 'Please provide with gien details'
            })
        }

        const existUser = await User.findOne({ email: members });
        //checkif user has sgned up and logged in

        if (!existUser) {
            return res.status(401).json({
                success: false,
                message: 'You should first Sign Up / Log In to website'
            })
        }

        //handle if member is already in the group

        const group = await Group.findOne({
            joinCode: joinCode,
            members: { $in: [existUser._id] }
        });


        if (group) {
            return res.status(307).json({
                success: true,
                message: 'You are already in the group'
            })
        }



        const updateGroup = await Group.findOneAndUpdate(
            { joinCode: joinCode }, // Find by join code
            { $push: { members: [existUser._id] } }, // Update members
            { new: true } // Return the updated group
        );


        if (!updateGroup) {
            return res.status(400).json({
                success: false,
                message: 'Enter valid group id'
            })
        }


        // Add group to the user's groups array
        const userUpdate = await User.findByIdAndUpdate(
            { _id: existUser._id },
            { $push: { groups: updateGroup._id } },
            { new: true }
        );


        res.status(200).json({
            success: true,
            data: updateGroup,
            message: 'You are successfully added to the group',
            user: userUpdate
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Request rejeced '
        })
    }
}


//view group 
exports.viewGroup = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Please provide with a id'
            })
        }

        const findGroup = await Group.findOne({ _id: id });

        if (!findGroup) {
            return res.status(404).json({
                success: false,
                message: `No group found with ${id}`
            })
        }

        return res.status(200).json({
            success: true,
            message: 'This was your desired group you were looking for',
            data: findGroup
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Request rejeced while trying to view group'
        })
    }
}

exports.viewAllGroupsUser = async (req, res) => {
    try {
        const {email}  = req.query;
        if (!email) {
            return res.status(404).json({
                success: false,
                message: 'Please provide with all the details required'
            })
        }

        const findUser = await User.findOne({email :  email });

        if (!findUser) {
            return res.status(404).json({
                success: false,
                message: 'Please sign up first'
            })
        }

        
        if (findUser.groups.length > 0) {
            const allGrps = await Group.find({
                $or: [
                    { admin: findUser._id },
                    { members: findUser._id }
                ]
            });
            
            return res.status(200).json({
                success : true,
                messagge : 'All groups of user fetched',
                data : allGrps
            })
        }



        res.status(200).json({
            success: true,
            message: 'Sussessfully got user group details',
            user: findUser.name,
            groups: findUser.groups
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Request rejeced while fetching all groups of a user'
        })
    }
}

//delete group , can only be deleted by admin
exports.deleteGroup = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Please grovide with a group id'
            })
        }

        const findGroup = await Group.findById(
            { _id: id }
        );
        if (!findGroup) {
            return res.status(400).json({
                success: false,
                message: 'Please provide with a valid group Id'
            })
        }

        //delete all expenses related to group
        let DeleteExpenses = await Expense.findOneAndDelete({ groupName: id });

        while (DeleteExpenses) {
            DeleteExpenses = await Expense.findOneAndDelete({ groupName: id });
        }



        //delete all settlements related to group
        let deleteSettlements = await Settlement.findOneAndDelete({ groupName: id })

        while (deleteSettlements) {
            deleteSettlements = await Settlement.findOneAndDelete({ groupName: id });
        }

        //deletedy group from members array related to curr group
        for (let i = 0; i < findGroup.members.length; i++) {
            const deleteGroupFormUser = await User.findByIdAndUpdate(
                { _id: findGroup.members[i] },
                { $pull: { groups: id } },
                { new: true }
            );
        }


        const deleteGroup = await Group.findByIdAndDelete(
            { _id: id }
        );

        res.status(200).json({
            success: true,
            message: 'Group deleted successfully',
            deletedGroupId: id
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error deleting group'
        })
    }
}


//edit group like group name
exports.editGroup = async (req, res) => {
    try {
        const { id, groupName } = req.body;
        if (!id || !groupName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all the details to edit group settings'
            })
        }


        const updateGrp = await Group.findByIdAndUpdate(
            { _id: id },
            { groupName },
            { new: true }
        );

        if (!updateGrp) {
            return res.status(404).json({
                success: false,
                message: 'No such group found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Group details updated successfully',
            grpDetails: updateGrp
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error editing froup details'
        })
    }
}


//handle after creating expenses and settlements
exports.removeGroupMember = async (req, res) => {
    try {
        const { id, user } = req.body;

        if (!id || !user) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all the details to remove user from group'
            });
        }

        // Remove the user from the group's members list
        const updateGrp = await Group.findOneAndUpdate(
            { _id: id, members: { $elemMatch: { $eq: user } } },
            { $pull: { members: user } },
            { new: true }
        );

        if (!updateGrp) {
            return res.status(404).json({
                success: false,
                message: 'Something wrong with group id or user id'
            });
        }

        // Delete all expenses paid by the user
        let deleteExpensePaidByUser;
        do {
            deleteExpensePaidByUser = await Expense.findOneAndDelete(
                { groupName: id, paidBy: user }
            );
            const deleteExpenseFromGroup = await Group.findByIdAndUpdate(
                { _id: id },
                { $pull: { expenses: deleteExpensePaidByUser._id } },
                { new: true }
            )
        } while (deleteExpensePaidByUser);

        // Remove the user from all expenses where they are included
        let deleteExpensePaidForUser;
        do {
            deleteExpensePaidForUser = await Expense.findOneAndUpdate(
                { groupName: id, 'splitBetween.personName': user },
                { $pull: { splitBetween: { personName: user } } },
                { new: true }
            );
            const deleteExpenseFromGroup = await Group.findByIdAndUpdate(
                { _id: id },
                { $pull: { expenses: deleteExpensePaidForUser._id } },
                { new: true }
            )
        } while (deleteExpensePaidForUser);

        // Delete all settlements involving the user
        let deleteSettlements;
        do {
            deleteSettlements = await Settlement.findOneAndDelete(
                { groupName: id, $or: [{ paidBy: user }, { paidTo: user }] }
            );
        } while (deleteSettlements);


        // Remove the group from the user's groups list
        const updatedUser = await User.findByIdAndUpdate(
            user,
            { $pull: { groups: id } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Member removed from group successfully',
            group: updateGrp
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            err: error.message,
            message: 'Something went wrong while removing user from group'
        });
    }
};

//view all member details of a group
exports.getAllUsers = async(req , res) => {
    try {
        const {id} = req.query;

        let users = [];

        const group = await Group.findById({_id : id});

        for(let i = 0; i < group.members.length; i++){
            const user = await User.findById({_id : group.members[i]});
            users.push(user);
        }

        return res.status(200).json({
            success : true,
            message : 'Successgully fetched all users of the group',
            data : users
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : 'Error fetching users of this group'
        })
    }
}