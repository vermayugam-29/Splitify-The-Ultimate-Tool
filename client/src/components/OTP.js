import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux';
import {  uploadSignUp, verifyOtp } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';


const OTP = ({ state }) => {
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const signupInfo = useSelector((state) => state.signup.signupInfo);

    const loading = useSelector((state) => state.loading.loading);



    const handleChange = (otp) => {
        setOtp(otp);
    };


    const submitHandler = (e) => {
        e.preventDefault();
        if (state !== null && state.cameFrom === 'forgot') {
            dispatch(verifyOtp(state.email, otp, navigate))
            return;
        }
        const { name, email, password } = signupInfo;
        dispatch(uploadSignUp(name, email, password, otp, navigate));
    }

    useEffect(() => {
        if (!signupInfo && state === null) {
            navigate('/signup')
        }
    }, [])


    if (loading) {
        return (
            <Spinner></Spinner>
        )
    }


    return (
        <div className='otp-main'>
            <div className='otp-inner'>
                <h1 className='heading'>You must have received OTP on your registerd email</h1>
                <form className='formOtp' onSubmit={submitHandler}>
                    <div>
                        <OtpInput
                            style={
                                {
                                    width: '100%',
                                    height: '40px',
                                    fontSize: '24px',
                                    padding: '10px',
                                    border: '10px solid #ccc',
                                    borderRadius: '5px',
                                    margin: '1px',
                                }
                            }
                            value={otp}
                            onChange={handleChange}
                            numInputs={6}
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    placeholder="_"
                                    style={{
                                        width: '30px',
                                        height: '40px',
                                        fontSize: '41px',
                                        padding: '20px',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        margin: '10px'
                                    }}
                                />
                            )}

                        />
                       
                    </div>
                    <button className='otp-submit'>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default OTP;
