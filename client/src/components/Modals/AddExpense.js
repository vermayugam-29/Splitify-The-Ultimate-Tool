import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import Spinner from '../Spinner';
import PaidBy from './PaidBy';
import { getAllUsers } from '../../services/groups';
import SplitExpense from './SplitExpense';
import toast from 'react-hot-toast';
import { addExpense } from '../../services/expenses';



const AddExpense = ({ show, handleClose, group, currUser }) => {

  const [expenseHandler, setExpenseHandler] = useState({
    description: '',
    amount: 0
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setExpenseHandler((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const loading = useSelector((state) => state.loading.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPaidByModal, setShowPaidByModal] = useState(false);
  const [paidBy, setPaidBy] = useState({ name: 'select', id: '' });

  const [splitModal, setSplitModal] = useState(false);
  const [splitType, setSplitType] = useState('select');

  const handleSplitClose = () => {
    setSplitModal(false);
  }

  const [splitBetween, setSplitBetween] = useState([]);


  const handlePaidByClose = () => {
    setShowPaidByModal(false);
  }

  const clickPaidByHandler = () => {
    if (expenseHandler.description === '' || expenseHandler.amount <= 0) {
      toast.error('Please fill all the fields carefully to proceed');
      return;
    }
    dispatch(getAllUsers(group._id, navigate));
    setShowPaidByModal(true);
  }

  const submitHandler = () => {
    if (expenseHandler.description.trim() === '') {
      toast.error('Description cannot be empty');
      return;
    }
    if (expenseHandler.description.trim().length > 20) {
      toast.error('ExpenseName Cannot be this long');
      return;
    }
    if (expenseHandler.amount <= 0 || expenseHandler.amount === '') {
      toast.error('Amount must be a positive number');
      return;
    }
    if (splitBetween.length <= 0) {
      toast.error('Please split the expense among users');
      return;
    }
    if (paidBy.id === '' || paidBy.name === '') {
      toast.error('Please select who paid the amount');
      return;
    }
    if (expenseHandler.description === null) {
      toast.error('Invalid description');
      return;
    }
    const amount = {
      paidBy: paidBy.id,
      value: expenseHandler.amount
    }
    const groupName = group._id;
    dispatch(addExpense(groupName, amount, expenseHandler.description, splitBetween, currUser, navigate));
    setExpenseHandler({
      description: '',
      amount: 0
    })
  }



  if (loading) {
    return <Spinner />
  }
  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content-expense">
        <div className='add-expense-modal'>
          <FaTimes onClick={handleClose} />
          <h1>Add Expense</h1>
          <span>Enter expense description: </span>
          <input required value={expenseHandler.description} name='description' onChange={changeHandler} />
          <span>Enter expense amount: </span>
          <input required value={expenseHandler.amount}
            name='amount' onChange={changeHandler} type='number' />


          <div className='paid-by'>
            <div>
              <span>Paid By : </span>
              <span className='select' onClick={clickPaidByHandler}>{paidBy.name}</span>
            </div>
            <span>and</span>
            <div>
              <span>Split : </span>
              <span className='select' onClick={() => {
                if (paidBy.name === 'select' || paidBy.name === '' || paidBy.id === '') {
                  toast.error('Pleasse select who paid the amount to proceed')
                  return;
                }
                setSplitModal(true)
              }}>{splitType}</span>
            </div>
          </div>


        </div>


        <div className='add-expense-btn-parent'>
          <button className='add-expense-btn' onClick={submitHandler}>Add Expense</button>
        </div>

      </div>


      {/* Paid by modal  */}
      <PaidBy show={showPaidByModal} setPaidBy={setPaidBy} closePaidBy={handlePaidByClose} />
      <SplitExpense show={splitModal}
        setSplitBetween={setSplitBetween} closeSplit={handleSplitClose}
        setSplitType={setSplitType} splitType={splitType}
        amountPaid={expenseHandler.amount}
      />
    </div>
  )
}

export default AddExpense
