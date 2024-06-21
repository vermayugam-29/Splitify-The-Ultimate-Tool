import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AiFillDelete } from "react-icons/ai";
import ConfirmationModal from './Modals/ConfirmationModal';



const UserProfile = () => {

  let message = 'Please Enter your password to delete the account'

  const [showModal ,setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  }

  const location = useLocation();
  const state = location.state || {};
  const navigate = useNavigate();

  return (
    <div className='profile-main-div'>

      <div className='profile-container'>

        <img className='profile-img-view' src={state.data.imageUrl} />

        <div>
          <h1 className='name-view'>{state.data.name}</h1>
          <h4 className='email-view'>{state.data.email}</h4>
        </div>

      </div>

      <div className='change-pass-div'>
        <span>Wanna Change Password ? </span> 
        <span onClick={() => navigate('/change-password' , {state : state.data.email})}
         className='change-pass-redirect'>Click Here</span>
      </div>


      <div className='delete-acc-container'>
        <h1 className='deleteUserHeadinng'>Delete Account</h1>
        <AiFillDelete onClick={() => setShowModal(true)}
         className='deleteUser'/>
      </div>

      <ConfirmationModal show={showModal} closeModal={closeModal}
       message={message} cameFrom={'deleteUser'}
       data={state.data.email} />
    </div>
  )
}

export default UserProfile
