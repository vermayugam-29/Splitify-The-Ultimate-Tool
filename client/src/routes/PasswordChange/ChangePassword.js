import React, { useEffect } from 'react'
import PasswordTemplate from '../../components/PasswordTemplate'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ChangePassword = () => {
    const heading = 'Change Password'
    const location = useLocation();
    const state = location.state || {};
    const {user} = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
      if(!user){
        navigate('/');
      }
    } ,[])

    if(!user) {
      return (
        navigate('/')
      )
    }



  return (
    <div>
      <PasswordTemplate heading={heading} cameFrom={'change-pass'}
      state={state}
      />
    </div>
  )
}

export default ChangePassword
