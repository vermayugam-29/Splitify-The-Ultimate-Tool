import React, { useEffect } from 'react'
import PasswordTemplate from '../../components/PasswordTemplate'
import { useLocation } from 'react-router-dom';
const ResetPassword = () => {
  const heading = 'Reset Password';
  const location = useLocation();
  const state = location.state || {};
  return (
    <div>
      <PasswordTemplate heading={heading} cameFrom={'forgot'} state= {state}/>
    </div>
  )
}

export default ResetPassword
