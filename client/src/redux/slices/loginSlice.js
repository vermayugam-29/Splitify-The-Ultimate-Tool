import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    loginInfo: null,
    error: null
}


export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loginForm: (state, action) => {
            state.loginInfo = action.payload;
        }
    }
})


export const { loginForm } = loginSlice.actions;
export default loginSlice.reducer;
