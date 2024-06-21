import {configureStore} from '@reduxjs/toolkit'
import balanceSlice from './slices/balanceSlice'
import groupSlice from './slices/groupSlice';
import expenseSlice from './slices/expenseSlice';
import settlementSlice from './slices/settlementSlice';
import userSlice from './slices/userSlice';
import signupSlice from './slices/signupSlice';
import loginSlice from './slices/loginSlice';
import loadingSlice from './slices/loadingSlice';

const store = configureStore({
    reducer : {
        balance : balanceSlice,
        group : groupSlice,
        expense : expenseSlice,
        settlement : settlementSlice,
        user : userSlice,
        signup : signupSlice,
        login : loginSlice,
        loading : loadingSlice
    }
})

export default store;