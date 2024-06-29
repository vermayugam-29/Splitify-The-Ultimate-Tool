import React, { useEffect } from 'react'
import Home from '../components/Home.js'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const {user} = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if(!user){
      navigate('/');
    }
  },[])

  return (
    <div>
      <Home/>
    </div>
  )
}

export default HomePage
