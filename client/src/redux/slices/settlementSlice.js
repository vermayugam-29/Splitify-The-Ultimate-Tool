import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
    settlements: [],
    currSettlement: null,
    error: null
}


export const settlementSlice = createSlice({
    name: 'settlement',
    initialState,
    reducers: {
        getSettlements : (state , action) => {
            state.settlements = action.payload;
        } , 
        setCurrSettle : (state , action) => {
            state.currSettlement = action.payload;
        },
        addSettlement : (state , action) => {
            if(state.settlements === undefined){
                state.settlements = []
            }
            state.settlements.push(action.payload);
        }
    }
})

export const {getSettlements , setCurrSettle , addSettlement} = settlementSlice.actions; 
export default settlementSlice.reducer;
