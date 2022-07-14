import { configureStore } from "@reduxjs/toolkit";
import  loginSignupSlice  from "../feature/userReducer";

export const store = configureStore({
    reducer:{
        user: loginSignupSlice,
    }
})