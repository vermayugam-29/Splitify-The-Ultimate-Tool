import React from 'react'
import { FaTimes } from 'react-icons/fa';
import { FiLogOut } from "react-icons/fi";
import { logOut } from '../../services/auth';
import { useDispatch , useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const ProfileModal = ({ show, close }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user =  useSelector((state) => state.user.user);

    return (
        <div className={`profile-modal ${show ? `show` : ``}`}>
            <div className='profile-modal-content'>
                <FaTimes onClick={() => close()} />
                <div>
                    <p onClick={() =>{
                        close();
                        navigate('/user/profile' , {state : user})
                    }}
                     className='view'>View Profile</p>
                    <p onClick={() => {navigate('/Home'); close()}} className='view'>Home</p>
                    <div onClick={() => logOut(navigate)(dispatch)}
                     className='log-out-container'>
                        <p className='log-out'>Log Out</p>
                        <FiLogOut className='log-out-icon' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal
