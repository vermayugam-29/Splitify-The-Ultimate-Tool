import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SignupformDetails } from '../redux/slices/signupSlice';
import { MdError } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { fetchOtp } from '../services/auth';
import Spinner from './Spinner';
import toast from 'react-hot-toast';

const Signup = () => {
  const special = '~!@#$%^&*()_+}{:"?><,./;`';
  const [msg, setMsg] = useState('Password must be of 8-16 characters and include at least one upper case and a speial char')
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState(
    {
      name: "",
      email: "",
      password: "",
      cnfrmPassword: ""
    }
  );
  const [err, setErr] = useState(false);
  const signupInfo = useSelector((state) => state.signupInfo);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const dispatch = useDispatch();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

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

    if(!upper){
      toast.error('Password must contain at least one uppercase')
    } if(!spl){
      toast.error('Password must contain at least special character')
    }

    return upper && spl;
  }

  const loading = useSelector((state) => state.loading.loading);




  const submitHandler = (e) => {
    e.preventDefault();

    if (formDetails.cnfrmPassword !== formDetails.password) {
      toast.error('Both the passwords must be same')
      setMsg('Both the passwords must be same')
      setErr(true);
      return;
    } else if (formDetails.password.length < 8 || formDetails.password.length > 16) {
      toast.error('Password must be between 8 - 16 characters')
      setMsg('Password must be between 8 - 16 characters')
      setErr(true)
      return;
    } else if (!isStrong(formDetails.password)) {
      setMsg('Password must contain at least one Uppper case and one special char')
      setErr(true);
      return;
    }
    setErr(false);


    dispatch(SignupformDetails(formDetails));
    let email = formDetails.email;
    dispatch(fetchOtp(email, navigate));
  }

  if (loading) {
    return (
      <Spinner></Spinner>
    )
  }

  return (
    <div className='container-sign-main'>
      <form className='login-form' onSubmit={submitHandler}>


        <h1 className='heading-signup'>Create New Account</h1>

        <div className='input-container-signup'>
          <div className='box-signup'></div>
          <input className='input-signup' placeholder='Enter Full Name'
            required onChange={changeHandler} id='name' type='text'
            value={formDetails.name} name='name' />
        </div>

        <div className='input-container-signup'>
          <div className='box-signup'></div>
          <input className='input-signup' placeholder='Enter Email id'
            required onChange={changeHandler} id='email' type='email'
            value={formDetails.email} name='email' />
        </div>

        <div className='password'>
          <div className='password-inner'>
            <div className='box-signup'></div>
            <input required placeholder='Create Password' className='input-pass'
              onChange={changeHandler} id='password'
              type={showPass ? 'text' : 'password'}
              value={formDetails.password} name='password' />
            {
              !showPass ?
                <FaRegEye onClick={() => setShowPass(!showPass)} className='eye-signup' /> :
                <FaRegEyeSlash onClick={() => setShowPass(!showPass)} className='eye-signup' />
            }
          </div>

          <div className='password-inner'>
            <div className='box-signup'></div>
            <input required placeholder='Confirm Password'
              onChange={changeHandler} id='cnfrm-pass' className='input-pass'
              type={showPass2 ? 'text' : 'password'}
              value={formDetails.cnfrmPassword} name='cnfrmPassword' />
            {
              !showPass2 ?
                <FaRegEye onClick={() => setShowPass2(!showPass2)} className='eye-signup' /> :
                <FaRegEyeSlash onClick={() => setShowPass2(!showPass2)} className='eye-signup' />
            }
          </div>

        </div>
        <div className='errDiv'>
          {
            err &&
            <MdError className='errIcon' />
          }
          <span className={
            err ? 'err' : 'msg'
          }>
            Note : {msg}
          </span>
        </div>

        <button>
          Create Account
        </button>
      </form>
    </div>
  )
}

export default Signup
