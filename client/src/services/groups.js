import axios from 'axios'
import { setLoading } from "../redux/slices/loadingSlice";
import toast from 'react-hot-toast';
import { addGroup, allGroups , removeGroup , viewCurrGroup , getUsers } from '../redux/slices/groupSlice';
import { fetchUser } from './user';


export function createGroup(groupName, admin, navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.post(`/api/v1/groups/create`, { groupName, admin });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success('Successfully created new group');
            fetchUser(navigate)(dispatch)
            dispatch(addGroup(response.data.data));
            navigate('/Home');
        } catch (error) {
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


export function joinGroup(members, joinCode, navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.put(`/api/v1/groups/join`,{members , joinCode});
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success('Successfully joined the group');
            dispatch(fetchUser(navigate));
            dispatch(addGroup(response.data.data));
            navigate('/Home');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error('Something went wrong while joining the group, Please try again later');
            }
        }
        dispatch(setLoading(false));
    };
}


//view all groups
export function viewAllGroups(email, navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get(`/api/v1/groups/allGroups`, {
                params: { email }, // Pass email as a query parameter
                withCredentials: true // Include this if necessary for authentication
            });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            dispatch(allGroups(response.data.data));
            navigate('/Home')
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.log(error.response.data.message)
            } else {
                console.error('Something went wrong')
            }
        }
        dispatch(setLoading(false))
    }
}



export function viewGroup(id) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get(`/api/v1/groups/view`, { id });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            dispatch(viewCurrGroup(response.data));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error('Something went wrong while viewing the group, Please try again later');
            }
        }
        dispatch(setLoading(false));
    };
}


export function deleteGroup(id, navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.delete(`/api/v1/groups/delete`, {
                params: { id },
                withCredentials: true
            });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            fetchUser(navigate)(dispatch)
            dispatch(removeGroup(response.data.deletedGroupId));
            toast.success('Successfully deleted the group');
            navigate('/Home');
        } catch (error) {
            toast.error('Something went wrong while deleting the group');
        }
        dispatch(setLoading(false));
    };
}


//get all members of a particular group
export function getAllUsers(id , navigate) {
    return async(dispatch) => {
        try {
            const response = await axios.get(`/api/v1/groups/allUsers` , {
                params : {id},
                withCredentials : true
            });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            dispatch(getUsers(response.data.data));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } 
            else {
                toast.error('Something went wrong while creating new group');
            }
        }
    }
}