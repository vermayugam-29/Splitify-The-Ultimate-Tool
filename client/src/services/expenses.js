import axios from 'axios'
import { setLoading } from "../redux/slices/loadingSlice";
import toast from 'react-hot-toast';
import { deleteAnExpense, getCurrExpense, getGroupsAllExpenses, pushExpense } from '../redux/slices/expenseSlice';
import { viewCurrGroup } from '../redux/slices/groupSlice';
import { fetchBalance } from './balance';


export function addExpense(groupName , amount , description , splitBetween , user, navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.post(`/api/v1/expenses/add` , 
                { groupName , amount , description , splitBetween , user}
                    
            );
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success(`Successfully added new expense ${response.data.data.description}`);
            
            dispatch(fetchBalance(groupName,user,navigate));
            dispatch(pushExpense(response.data.data));
            dispatch(viewCurrGroup(response.data.group));
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

export function getGroupExpenses(groupName , user , navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get(`/api/v1/expenses/all` ,  {params : {groupName , user}});
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            dispatch(getGroupsAllExpenses(response.data.data));
        } catch (error){
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } 
            else {
                toast.error('Something went wrong while getting group expenses');
            }
        }
        dispatch(setLoading(false));
    }
}

export function deleteExpense(expenseId,group,navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.delete(`/api/v1/expenses/delete` , {
                params : {expenseId}
            });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success(`Successfully deleted ${response.data.description}`);
            dispatch(deleteAnExpense(response.data.id));
            navigate('/Home/Group' , {state : {group : group}});
        } catch(error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } 
            else {
                toast.error('Something went wrong while creating new group');
            }  
        }
        dispatch(setLoading(false));
    }
}

export function viewExpense(expenseId ,group, navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get(`/api/v1/expenses/id` , {
                params : {expenseId}
            });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            dispatch(getCurrExpense(response.data.data));
            navigate('/Home/Group/Expense',{state : {group : group}})
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } 
            else {
                toast.error('Something went wrong while getting this expense details');
            }   
        }
        dispatch(setLoading(false));
    }
}