import axios from 'axios';
import toast from 'react-hot-toast';
import { setLoading } from '../redux/slices/loadingSlice';




export function resetPassword(email  , password,navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.put(`/api/v1/user/resetpassword` , {
                email  , password
            });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            if(response.data.success){
                toast.success('You have successfully reseted your password , now please login to continue')
                navigate('/login');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } 
            else {
                toast.error('Something went wrong while reseting the password');
            }
        }
        dispatch(setLoading(false));
    }
}

export function changePassword(email , oldPass , newPass , navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.put(`/api/v1/user/changepassword` , {
                email , oldPass , newPass
            });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            if(response.data.success){
                toast.success('You have successfully changed your password');
                navigate('/Home');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } 
            else {
                toast.error('Something went wrong while adding new expense');
            }
        }
        dispatch(setLoading(false));
    }
}
