import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
    expenses: [],
    currExpense: null,
    error: null
}

export const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        pushExpense: (state, action) => {
            if (state.expenses === undefined) {
                state.expenses = [];
            }
            state.expenses.unshift(action.payload);
        },
        getCurrExpense: (state, action) => {
            state.currExpense = action.payload;
        },
        getGroupsAllExpenses: (state, action) => {
            state.expenses = action.payload;
        },
        deleteAnExpense: (state, action) => {
            state.expenses = state.expenses.filter((curr) => curr._id !== action.payload);
        }
    }
});


export const { pushExpense, getCurrExpense, getGroupsAllExpenses, deleteAnExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
