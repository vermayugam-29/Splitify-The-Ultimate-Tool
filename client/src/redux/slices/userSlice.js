import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: null,
    token: null,
    error: null
};



export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        deleteUser : (state , action) => {
            state.user = null;
        },
        setUserDetails : (state , action) => {
            state.user = action.payload;
        } 
    }
});
export const {deleteUser , setUserDetails} = userSlice.actions;
export default userSlice.reducer;