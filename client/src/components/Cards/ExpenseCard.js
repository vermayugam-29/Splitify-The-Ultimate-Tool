import React, { useEffect, useState } from 'react'
import { months } from '../../months';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { viewExpense } from '../../services/expenses';
const ExpenseCard = ({ expense, user ,group }) => {

    const date = expense.createdAt.substring(0, 10).split('-');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const expenseDetails = useSelector((state) => state.expense.currExpense)




    const expesneViewHandler = () => {
        dispatch(viewExpense(expense._id ,group, navigate));
    }

    return (
        <div onClick={expesneViewHandler} className='expense-container'>

            <div className='date'>
                <span>{date[1].charAt(0) === '0' ?
                    months[parseInt(date[1].substring(1))] :
                    months[parseInt(date[1])]}</span>

                <span>{date[2]}</span>
                <span>{date[0]}</span>
            </div>

            <div className='description'>
                <h2>{expense.description}</h2>
                <h4>
                    {
                        expense.paidById === user ?
                            'You ' : `${expense.paidByName} `
                    }
                    paid ₹{expense.amountPaid}
                </h4>
            </div>


            {
                parseInt(expense.amountPaidToUser) === 0 ?
                <div className='other-details'>
                    <span className='not-involved'>You were</span>
                    <span className='not-involved'>No Involved</span>
                </div>
            :
                <div className='other-details'>
                    <span className={expense.paidById === user ? 'lent' : 'borrow'}>
                        {
                            expense.paidById === user ? `You lent`
                                : `You Borrowed`
                        }
                    </span>
                    <span className={expense.paidById === user ? 'lent' : 'borrow'}>
                        ₹{
                            expense.paidById === user ? `${parseFloat(expense.amountPaid - expense.amountPaidToUser).toFixed(2)}`
                                : `${expense.amountPaidToUser}`
                        }
                    </span>
                </div>
            }
        </div>
    )
}

export default ExpenseCard
