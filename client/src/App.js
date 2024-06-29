import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import LoginForm from './routes/AuthRotes/LoginForm'
import SignupForm from './routes/AuthRotes/SignupForm'
import OtpScreen from './routes/AuthRotes/OtpScreen'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './services/user'
import HomePage from './routes/HomePage'
import Spinner from './components/Spinner.js'
import ForgotPass from './routes/PasswordChange/ForgotPass.js'
import GroupDetails from './routes/Group/GroupDetails.js'
import Welcome from './components/Welcome.js'
import ResetPassword from './routes/PasswordChange/ResetPassword.js'
import Profile from './routes/Profile.js'
import ChangePassword from './routes/PasswordChange/ChangePassword.js'
import ViewExpense from './components/Modals/ViewExpense.js'

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.loading.loading);
  const user = useSelector((state) => state.user.user)

  
  useEffect(() => {
    dispatch(fetchUser());
  },[])


  if(loading ){
    return (
      <Spinner></Spinner>
    )
  }

  return (
    <div className='container-app'>

      <div className='container-app-inner'>
        <NavBar />
      </div>


  



      <Routes>
        <Route path='/' element={<Welcome/>}/>
        <Route path='/signup' element={<SignupForm/>}/>
        <Route path='/login' element={<LoginForm/>}/>
        <Route path='/verify-otp' element={<OtpScreen/>}/>
        <Route path='/Home' element={<HomePage/>}/>
        <Route path='/Home/Group' element={<GroupDetails/>}/>
        <Route path='/change-password' element={<ChangePassword/>}/>
        <Route path='/forgot-password' element={<ForgotPass/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/user/profile' element={<Profile/>}/>
        <Route path='/Home/Group/Expense' element={<ViewExpense/>} />
      </Routes>
    </div>
  )
}

export default App

