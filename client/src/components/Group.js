import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AddExpense from './Modals/AddExpense';
import Spinner from './Spinner';
import { IoAddSharp } from "react-icons/io5";
import ExpenseCard from './Cards/ExpenseCard';
import BalanceCard from './Cards/BalanceCard';
import SettlementCard from './Cards/SettlementCard'
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllUsers } from '../services/groups';
import { getGroupExpenses } from '../services/expenses';
import { fetchBalance } from '../services/balance';
import { getGroupSettlements } from '../services/settlements';

const Group = ({ group, user }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    group = group || location.state.group;


    // //getting expenses , settlements , balances from slices
    const expenses = useSelector((state) => state.expense.expenses);
    const settlements = useSelector((state) => state.settlement.settlements);
    const balances = useSelector((state) => state.balance.balances);


    const [expensesClick, setExpensesClick] = useState(true);

    const [showModal, setShowModal] = useState(false);



    const handleClose = () => {
        setShowModal(false);
    }

    const loading = useSelector((state) => state.loading.loading);

    const fetchDetails = () => {
        dispatch(getAllUsers(group._id, navigate));
        dispatch(getGroupExpenses(group._id, user, navigate));
        dispatch(fetchBalance(group._id, user, navigate));
        dispatch(getGroupSettlements(group._id, navigate));
    }



    if (loading) {
        return <Spinner />
    }


    return (
        <div className='group-details'>
            <h1 className='grp-name'>{group.groupName}</h1>

            {
                group.admin === user &&
                <div>
                    <span className='join-code'>Join Code : {group.joinCode}</span>
                </div>
            }

            <div className='balance-div'>
                <h2 className=''>Pending Balances : </h2>


                {
                    balances.length > 0 &&
                    balances.map((balance, index) => {
                        return <BalanceCard key={index} balance={balance} user={user} group={group} />
                    })
                }


            </div>


            <div className='headings'>
                <h1 onClick={() => setExpensesClick(true)}
                    className={
                        expensesClick ? 'selected-btn' : 'other-btn'
                    }
                >
                    Expenses
                </h1>
                <h1 onClick={() => setExpensesClick(false)}
                    className={
                        !expensesClick ? 'selected-btn' : 'other-btn'
                    }
                >
                    Overall Paid
                </h1>
            </div>

            <div>
                {
                   expenses.length === 0 &&
                    <div className='refresh-container'>
                        <span className='heading'>
                        Click Here to Get Group Expenses (if any)
                        </span>

                        <button onClick={fetchDetails}>Refresh</button>
                    </div>
                }

                {
                    expensesClick && expenses.length > 0 &&
                    expenses.map((expense) => (
                        <ExpenseCard expense={expense} user={user} key={expense._id} group={group}/>
                    ))
                }
                {
                    !expensesClick && settlements.length > 0 &&
                    settlements.map((settlement) => (
                        <SettlementCard key={settlement._id} settlement={settlement} user={user} />
                    ))
                }
            </div>

            <div className="add-expense-container">
                <IoAddSharp className="add-expense" onClick={() => setShowModal(true)} />
            </div>
            <AddExpense show={showModal} handleClose={handleClose} group={group} currUser={user} />
        </div>
    )
}

export default Group