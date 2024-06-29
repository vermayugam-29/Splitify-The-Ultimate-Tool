import React, { useEffect } from 'react'
import PasswordTemplate from '../../components/PasswordTemplate'
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const ResetPassword = () => {
  const heading = 'Reset Password';
  const location = useLocation();
  const state = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if(!state){
      navigate('/forgot-password')
    }
  } ,[])


  if(!state){
    return (
      navigate('/forgot-password')
    )
  }


  return (
    <div>
      <PasswordTemplate heading={heading} cameFrom={'forgot'} state= {state}/>
    </div>
  )
}

export default ResetPassword
