import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.loading.loading);
  const navigate = useNavigate();

  useEffect(() => {
    if(user){
      navigate('/Home');
    }
  },[])

  if(loading) {
    return (
      <Spinner />
    )
  }

  return (
    <div className='main-div'>
      {
        !user &&
        <h1 className='main'>Welcome to SplitiFi Please LogIn / SignUp to enjoy our services</h1>
      }
    </div>
  )
}

export default Welcome
