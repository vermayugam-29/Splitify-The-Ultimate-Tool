import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { settleBalance } from '../../services/settlements';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { deleteAccount } from '../../services/user';
import { deleteExpense } from '../../services/expenses';


const ConfirmationModal = ({ show, closeModal, message, cameFrom, data , group}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const submitHandler = () => {
        if (cameFrom === 'settle') {
            dispatch(settleBalance(data.groupName, data.paidBy, data.paidTo, data.amount, navigate));
        } else if (cameFrom === 'deleteUser') {
            dispatch(deleteAccount(data, password, navigate));
        } else if(cameFrom === 'deleteExpense') {
            dispatch(deleteExpense(data , group, navigate));
        }
        closeModal();
    }


    return (
        <div className={`modal ${show ? 'show' : ''}`}>

            <div className="modal-content-confirm">
                <FaTimes onClick={closeModal} />

                {
                    cameFrom === 'deleteUser' &&
                    <div className='input-container'>
                        <input value={password} placeholder='Enter your password'
                            onChange={(e) => setPassword(e.target.value)}
                            required className='input'
                            type={showPass ? 'text' : 'password'}
                        />
                        {
                            !showPass ?
                                <FaRegEye onClick={() => setShowPass(!showPass)}
                                 className='eye-cnfrm' /> :
                                <FaRegEyeSlash onClick={() => setShowPass(!showPass)} 
                                className='eye-cnfrm' />
                        }
                    </div>
                }


                <h1>{message}</h1>
                <button onClick={submitHandler}>{
                    cameFrom === 'settle' ? `Settle` : cameFrom === 'deleteUser' ? 'Delete Account'
                    : 'Delete Expense'
                }</button>
            </div>
        </div>
    )
}

export default ConfirmationModal
