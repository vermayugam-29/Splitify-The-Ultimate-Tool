import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading : false,
    balances : [],
    error : null
}


export const balSlice = createSlice(
    {
        name : 'balance',
        initialState,
        reducers : {
            fetchGroupBalance : (state , action) => {
                state.balances = action.payload
            }
        }
    }
)

export const {fetchGroupBalance} = balSlice.actions;
export default balSlice.reducer;