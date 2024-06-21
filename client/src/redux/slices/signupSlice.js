import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    signupInfo: null,
    error: null
}


export const signupSlice = createSlice({
    name : 'signup',
    initialState,
    reducers : {
        SignupformDetails : (state , action) =>{
            state.signupInfo = action.payload
        },
        setError : (state , action) => {
            state.error = action.payload
        }
    }
})

export const {SignupformDetails , setError} = signupSlice.actions;
export default signupSlice.reducer;