import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    groups: [],
    allUsers : [],
    currGroupDetails: null,
    error: null
};


export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        addGroup : (state, action) => {
            if (state.groups === undefined) {
                state.groups = [];
            }
            state.groups.push(action.payload);
        },
        viewCurrGroup : (state , action) => {
            state.currGroupDetails = action.payload
        },
        removeGroup : (state , action) => {
            state.groups = state.groups.filter((curr) => curr._id !== action.payload);
        },
        allGroups : (state , action) => {
            state.groups = action.payload;
        } ,
        getUsers : (state , action) => {
            state.allUsers = action.payload;
        }
    }
});

export const {addGroup , viewCurrGroup , removeGroup , allGroups , getUsers} = groupSlice.actions;
export default groupSlice.reducer;