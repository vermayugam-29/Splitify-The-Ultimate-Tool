import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { uploadLogin } from '../services/auth';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Spinner from './Spinner';

const Login = () => {

  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [details, setDetails] = useState(
    {
      email: "",
      password: ""
    }
  )
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    let email = details.email;
    let password = details.password
    dispatch(uploadLogin(email, password, navigate))
  }


  const changeHandler = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => { return { ...prev, [name]: value } });
  }

  const loading = useSelector((state) => state.loading.loading);


  if (loading) {
    return (
      <Spinner></Spinner>
    )
  }

  return (
    <div className='container-login-main'>

      <form onSubmit={submitHandler} className='login-form'>

        <h1 className='heading'>Login To Your Account</h1>


        <div className='content'>
          <div className='input-parent'>
            <div className='box'></div>
            <input className='input' name='email' value={details.email} required
              onChange={changeHandler} id='email'
              type='email' placeholder='Enter your email-id' />

          </div>
        </div>

        <div className='content'>
          <div className='input-parent'>
            <div className='box'></div>
            <input className='input' onChange={changeHandler} name='password'
              value={details.password} required type={
                showPass ? 'text' : 'password'
              }
              id='password' placeholder='Enter password' />
            {
              !showPass ?
                <FaRegEye onClick={() => setShowPass(!showPass)} className='eye' /> :
                <FaRegEyeSlash onClick={() => setShowPass(!showPass)} className='eye' />
            }
          </div>
        </div>

        <span className='forgot-pass' onClick={() => navigate('/forgot-password')}>Forgot Password ?</span>

        <button>Submit</button>
      </form>

      <div className='seperate'>
        <div className='line'></div>
        <span className='span'>OR</span>
        <div className='line'></div>
      </div>

      <NavLink to='/signup'>
        <button className='create-acc-parent'>
          <span className='create-acc'>Create new Account</span>
        </button>
      </NavLink>
    </div>
  )
}

export default Login
