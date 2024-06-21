import React from 'react'
import PasswordTemplate from '../../components/PasswordTemplate'
import { useLocation } from 'react-router-dom'

const ChangePassword = () => {
    const heading = 'Change Password'
    const location = useLocation();
    const state = location.state || {};
  return (
    <div>
      <PasswordTemplate heading={heading} cameFrom={'change-pass'}
      state={state}
      />
    </div>
  )
}

export default ChangePassword
