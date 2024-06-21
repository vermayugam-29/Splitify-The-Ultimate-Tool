import React from 'react'
import OTP from '../../components/OTP'
import { useLocation } from 'react-router-dom'

const OtpScreen = () => {
    const loaction = useLocation();
    const {state} = loaction || {};
    return (
        <div>
            <OTP state={state}/>
        </div>
    )
}

export default OtpScreen
