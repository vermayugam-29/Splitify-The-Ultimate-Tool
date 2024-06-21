import axios from "axios";
import { fetchGroupBalance } from "../redux/slices/balanceSlice";
import toast from "react-hot-toast";
import { setLoading } from "../redux/slices/loadingSlice";



export function fetchBalance(groupName , user , navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get(`/api/v1/groups/balance` , {
                params : {groupName , user}
            });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            dispatch(fetchGroupBalance(response.data.data));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } 
            else {
                toast.error('Something went wrong while getting group expenses');
            }
        }
        dispatch(setLoading(false))
    }
}