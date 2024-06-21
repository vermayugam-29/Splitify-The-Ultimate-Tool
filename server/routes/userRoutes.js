const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken');
const {sendOTP , verifyOtp} = require('../controller/otpController');
const {signUp , logIn , deleteUser , editName , resetPassword , changePassword , getUserDetails} 
= require('../controller/userHandler');
const {createGroup , joinGroup , viewGroup , getAllUsers,
     viewAllGroupsUser , deleteGroup , editGroup , removeGroupMember} 
= require('../controller/groupHandler');
const {addExpense , deleteExpense , getAllExpenses , viewExpenses} = require('../controller/expenseHandler');
const {viewBalance } = require('../controller/balanceHandler');
const {  getAllSettlements , getSettlementById , settleOverall} 
= require('../controller/settlementHandler');

//login-signup routes
router.post('/send-otp' , sendOTP);
router.post('/signUp' , signUp); 
router.post('/logIn' , logIn); 
router.delete('/user/delete' , deleteUser); 
router.put('/user/edit/name' , editName);  
router.put('/user/resetpassword' , resetPassword); 
router.put('/user/changepassword' , changePassword); 
router.get('/user/details' , verifyToken , getUserDetails);
router.get('/user/logout' , (req , res) => {
     res.clearCookie('token_generated', {
          httpOnly: true
     });
     res.status(200).json({success : true});
})
router.get('/user/verify-otp' , verifyOtp);


//group routes
router.post('/groups/create' , createGroup); 
router.put('/groups/join' , joinGroup); 
router.get('/groups/view' , viewGroup); 
router.get('/groups/allGroups' , viewAllGroupsUser); 
router.delete('/groups/delete' , deleteGroup); 
router.put('/groups/edit' , editGroup); 
router.put('/groups/removeMember' , removeGroupMember); 
router.get('/groups/allUsers' , getAllUsers);


//expense routes
router.post('/expenses/add' , addExpense); 
router.delete('/expenses/delete' , deleteExpense); 
router.get('/expenses/id' , viewExpenses); 
router.get('/expenses/all' , getAllExpenses); 


//balance routes
router.get('/groups/balance' , viewBalance); 


//settle expenses routes
router.post('/settlements/balance' , settleOverall); 
router.get('/settlements/id' , getSettlementById); 
router.get('/settlements/all' , getAllSettlements); 

module.exports = router;