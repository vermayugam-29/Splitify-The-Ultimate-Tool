import React, { useDebugValue, useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changePassword, resetPassword } from '../services/passwordHandlers';

const PasswordTemplate = ({ heading, cameFrom, state }) => {
    const special = '~!@#$%^&*()_+}{:"?><,./;`';
    const [password, setPassword] = useState('');
    const [cnfrmPass, setCnfrmPass] = useState('');
    const [oldPass , setOldPass] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function isStrong(str) {
        let upper = false;
        let spl = false;

        Array.from(str).forEach((char) => {
            if (char >= 'A' && char <= 'Z') {
                upper = true;
            } else if (special.includes(char)) {
                spl = true;
            }
        });

        if (!upper) {
            toast.error('Password must contain at least one uppercase')
        } if (!spl) {
            toast.error('Password must contain at least special character')
        }

        return upper && spl;
    }
    //for  eye icon
    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);
    const [showOldPass , setShowOldPass] = useState(false);


    const submitHandler = (e) => {
        e.preventDefault();
        if (cnfrmPass !== password) {
            toast.error('Both the passwords must be same')
            return;
        } else if (password.length < 8 || password.length > 16) {
            toast.error('Password must be between 8 - 16 characters')
            return;
        } else if (!isStrong(password)) {
            return;
        }

        if(cameFrom === 'change-pass'){
            dispatch(changePassword(state , oldPass , password,navigate));
            return;
        }

        dispatch(resetPassword(state, password, navigate));
    }




    return (
        <form onSubmit={submitHandler} className='password-template'>

            {
                heading !== null &&
                <h1 className='heading'>{heading}</h1>
            }

            {
                cameFrom === 'change-pass' &&
                <div className='input-container-signup'>
                    <div className='box-signup'></div>
                    <input required
                        onChange={(e) => setOldPass(e.target.value)}
                        className='input' value={oldPass}
                        placeholder='Enter Old Password'
                        type={showOldPass ? 'text' : 'password'}
                    />
                    {
                        !showOldPass ?
                        <FaRegEye onClick={() => setShowOldPass(!showOldPass)} className='eye-password' /> :
                        <FaRegEyeSlash onClick={() => setShowOldPass(!showOldPass)} className='eye-password' />
                    }
                </div>
            }

            <div className='input-container-signup'>
                <div className='box-signup'></div>
                <input required
                    onChange={(e) => setPassword(e.target.value)}
                    className='input' value={password}
                    placeholder='Create New Password'
                    type={showPass ? 'text' : 'password'}
                />
                {
                    !showPass ?
                        <FaRegEye onClick={() => setShowPass(!showPass)} className='eye-password' /> :
                        <FaRegEyeSlash onClick={() => setShowPass(!showPass)} className='eye-password' />
                }
            </div>
            <div className='input-container-signup'>
                <div className='box-signup'></div>
                <input required
                    className='input' value={cnfrmPass}
                    onChange={(e) => setCnfrmPass(e.target.value)}
                    placeholder='Confirm new Password'
                    type={showPass2 ? 'text' : 'password'}
                />
                {
                    !showPass2 ?
                        <FaRegEye onClick={() => setShowPass2(!showPass2)} className='eye-password' /> :
                        <FaRegEyeSlash onClick={() => setShowPass2(!showPass2)} className='eye-password' />
                }
            </div>
            <button
                className='password-submit'>Submit</button>
        </form>
    )
}

export default PasswordTemplate
