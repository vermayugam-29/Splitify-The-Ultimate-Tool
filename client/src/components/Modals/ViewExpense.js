import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { IoArrowBackCircle } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import { AiFillDelete } from "react-icons/ai";
import ConfirmationModal from './ConfirmationModal'


const ViewExpense = () => {

    const navigate = useNavigate();
    const expense = useSelector((state) => state.expense.currExpense);
    const user = useSelector((state) => state.user.user);
    const location = useLocation();
    let group = location.state || {};



    const [showModal, setShowModal] = useState(false);
    const closeModal = () => {
        setShowModal(false);
    }

    let message = 'Are you sure you want to delete this expense ?';

    useEffect(() => {
        if (!user || group === null) {
            navigate('/');
        } else {
            group = location.state.group;
        }
    }, [user, group])

    if (group === null || !user || !expense) {
        return (
            navigate('/')
        )
    }


    return (
        <div className='view-expense-container'>
            <IoArrowBackCircle className='back'
                onClick={() => navigate(-1)} />
            <h1 className='view-expense-heading'>{expense.description.toUpperCase()}</h1>
            <div className='view-expense-paidby-container'>
                <h3>
                    {
                        expense.paidById === user.data._id ?
                            `You` : `${expense.paidByName}`
                    }
                </h3>
                <h3>Paid ₹{expense.amountPaid}</h3>
            </div>


            <div>
                <h1 className='heading'>Members involved</h1>
                {
                    expense.splitBetween.map((person, index) => {
                        return <div key={index} className='expense-share'>
                            <span>
                                {
                                    person.amount !== 0 &&
                                        person.id === user.data._id ?
                                        `Your share ` :
                                        person.amount !== 0 && `${person.name}'s share `
                                }
                            </span>
                            <span>
                                {
                                    person.amount !== 0 && `₹${person.amount}`
                                }
                            </span>
                        </div>
                    })
                }
            </div>


            <div className='delete-expense-container'>
                {
                    expense.paidById === user.data._id &&
                    <AiFillDelete className='deleteUser'
                        onClick={() => setShowModal(true)}
                    />
                }
            </div>

            <ConfirmationModal show={showModal} closeModal={closeModal}
                message={message} cameFrom={'deleteExpense'} data={expense.expenseId} group={group}
            />

        </div>
    )
}

export default ViewExpense
