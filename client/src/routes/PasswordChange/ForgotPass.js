import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { fetchOtp } from '../../services/auth';

const ForgotPass = () => {

  const [email, setEmail] = useState('');
  const loading = useSelector((state) => state.loading.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitHandler = () => {
    dispatch(fetchOtp(email, navigate, 'forgot'));
  }

  if (loading) {
    return (
      <Spinner />
    )
  }

  return (
    <div className='reset-parent'>
      <div>
        <h1 className='heading'>Please Enter Your Registered Email</h1>

        <div className='reset-form'>
          <input value={email}
            onChange={(e) => setEmail(e.target.value)} type='email'
            required className='input' placeholder='Enter Email' />
          <button onClick={submitHandler} style={{ width: '300px', margin: '50px' }}>Get Otp</button>
        </div>

      </div>
    </div>
  )
}

export default ForgotPass
