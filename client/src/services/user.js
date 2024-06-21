import axios from "axios"
import toast from "react-hot-toast";
import { deleteUser, setUserDetails } from "../redux/slices/userSlice";
import { setLoading } from "../redux/slices/loadingSlice";
import { viewAllGroups } from "./groups";




export function fetchUser(navigate) {
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get(`/api/v1/user/details` , {withCredentials : true});
            dispatch(setUserDetails(response.data));
            dispatch(viewAllGroups(response.data.data.email,navigate))
            // navigate('/Home');
        } catch (error) {
            console.error(error)
        }
        dispatch(setLoading(false));
    }
}

export function deleteAccount(email , password , navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.delete(`/api/v1/user/delete` , {
                params : {email , password}
            });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success('Account deleted Successfully')
            dispatch(deleteUser());
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } 
            else {
                toast.error('Something went wrong while deleting your account');
            }
        }
        dispatch(setLoading(false));
    }
}