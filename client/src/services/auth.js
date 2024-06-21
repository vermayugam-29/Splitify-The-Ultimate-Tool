import toast from "react-hot-toast";
import { deleteUser  } from "../redux/slices/userSlice";
import { fetchUser } from "./user";
import axios from "axios";
import { setLoading } from "../redux/slices/loadingSlice";
import { setError } from "../redux/slices/signupSlice";



export function logOut(navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get(`/api/v1/user/logout` , {
                withCredentials : true
            });
            toast.success('Logged Out Successfully');
            dispatch(deleteUser());
            navigate('/login');
        } catch (error) {
            toast.error('Something went wrong');
        }
        dispatch(setLoading(false));
    }
}


export function uploadLogin(email , password , navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.post(`/api/v1/logIn`, { email, password } ,{ withCredentials : true});
            
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            
            toast.success('Login Successgully')
            dispatch(fetchUser());
            navigate('/Home');
            return response.data;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`Log In failed: ${error.response.data.message}`);
            } else {
                toast.error('Log In failed:: An unknown error occurred');
            }
        }
        dispatch(setLoading(false));
    }
}

export function fetchOtp(email,navigate,cameFrom){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.post(`/api/v1/send-otp` , {email});
            toast.success('Otp Sent to your email');
            if(cameFrom === 'forgot'){
                navigate('/verify-otp' ,{ state : {cameFrom , email}});
            } else {
                navigate('/verify-otp')
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`Sign up failed: ${error.response.data.message}`);
            } else {
                toast.error('Sign up failed: An unknown error occurred');
            }
        }
        dispatch(setLoading(false));
    }
}

export function verifyOtp(email , otp , navigate) {
    return async(dispatch) => {
        dispatch(setLoading(true))
        try {
            const response = await axios.get(`/api/v1/user/verify-otp` , {
                params : {email , otp}
            })
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success('Otp has been verified now please reset password')
            navigate('/reset-password' , {state : email});
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } 
            else {
                toast.error('Something went wrong while verifying otp');
            }
        }
        dispatch(setLoading(false));
    }
}


export function uploadSignUp(name, email, password, otp, navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.post(`/api/v1/signUp`, { name, email, password, otp });
            dispatch(setError(response.data.message));
            if (!response.data.success) {
                toast.error(`${response.data.message}`);
                throw new Error(response.data.message);
            }
            toast.success('Account created Successfully, Please Login to Continue');
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`Sign up failed: ${error.response.data.message}`);
            } else {
                toast.error('Sign up failed: An unknown error occurred');
            }
            navigate('/signUp');
        }
        dispatch(setLoading(false));
    };
}
