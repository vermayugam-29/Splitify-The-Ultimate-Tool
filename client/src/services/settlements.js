import {setLoading} from '../redux/slices/loadingSlice'
import axios from "axios";
import { addSettlement, getSettlements, setCurrSettle } from '../redux/slices/settlementSlice';
import toast from "react-hot-toast";
import { fetchBalance } from './balance';


export function getGroupSettlements(groupName , navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get(`/api/v1/settlements/all` , {
                params : {groupName}
            })
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            dispatch(getSettlements(response.data.data));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } 
            else {
                toast.error('Something went wrong while getting group settlements');
            }
        }
        dispatch(setLoading(false));
    }
}

export function getCurrSettlement(id , navigate) {
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get(`/api/v1/settlements/id` , {
                params : {id}
            });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            dispatch(setCurrSettle(response.data.data));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } 
            else {
                toast.error('Something went wrong while getting settlement by id');
            }
        }
        dispatch(setLoading(false));
    }
}

export function settleBalance(groupName , paidBy , paidTo , amount, navigate) {
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.post(`/api/v1/settlements/balance` , {
                groupName , paidBy , paidTo , amount
            });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success('Successfully settled balance');
            dispatch(fetchBalance(groupName,paidBy,navigate));
            dispatch(addSettlement(response.data.data));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } 
            else {
                toast.error('Something went wrong while getting settling balance');
            }
        }
        dispatch(setLoading(false));
    }
}
