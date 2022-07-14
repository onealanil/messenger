import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:5000/";

const initialState = {
  loginUserDetails: [],
  signupUserDetails: [],
  userOneList: [],

  loginStatus: "",
  loginError: "",

  signupStatus: "",
  signupError: "",

  updateUserStatus: "",
  updateUserError: "",
};

//login
export const loginUser = createAsyncThunk(
  "login/user",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseUrl + "signin", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

//signup
export const signupUser = createAsyncThunk(
  "signup/user",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseUrl + "signup", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

//update
export const updateOneUser = createAsyncThunk(
  "update/user",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      const response = await axios.post(baseUrl + "update/" + data.id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginSignupSlice = createSlice({
  name: "loginSignup",
  initialState: initialState,
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      return {
        ...state,
        loginStatus: "pending",
        loginError: "",
        signupError: "",
        signupStatus: "",
        updateUserStatus: "",
        updateUserError: "",
      };
    },
    [loginUser.fulfilled]: (state, action) => {
      return {
        ...state,
        loginUserDetails: [action.payload, ...state.loginUserDetails],
        signupUserDetails: [],
        userOneList: [],
        loginStatus: "success",
        loginError: "",
        signupStatus: "",
        signupError: "",
        updateUserStatus: "",
        updateUserError: "",
      };
    },
    [loginUser.rejected]: (state, action) => {
      return {
        ...state,
        loginStatus: "failed",
        loginError: action.payload,
        signupStatus: "",
        signupError: "",
        updateTodoStatus: "",
        updateTodoError: "",
      };
    },
    [signupUser.pending]: (state, action) => {
      return {
        ...state,
        loginStatus: "",
        loginError: "",
        signupError: "",
        signupStatus: "pending",
        updateUserStatus: "",
        updateUserError: "",
      };
    },
    [signupUser.fulfilled]: (state, action) => {
      return {
        ...state,
        loginUserDetails: [],
        signupUserDetails: [action.payload, ...state.signupUserDetails],
        userOneList: [],
        loginStatus: "",
        loginError: "",
        signupStatus: "success",
        signupError: "",
        updateUserStatus: "",
        updateUserError: "",
      };
    },
    [signupUser.rejected]: (state, action) => {
      return {
        ...state,
        loginStatus: "",
        loginError: "",
        signupStatus: "failed",
        signupError: action.payload,
        updateUserStatus: "",
        updateUserError: "",
      };
    },
    [updateOneUser.pending]: (state, action) => {
      return {
        ...state,
        loginStatus: "",
        loginError: "",
        signupError: "",
        signupStatus: "",
        updateUserStatus: "pending",
        updateUserError: "",
      };
    },
    [updateOneUser.fulfilled]: (state, action) => {
      return {
        ...state,
        loginStatus: "",
        loginError: "",
        signupStatus: "",
        signupError: "",
        updateUserStatus: "success",
        updateUserError: "",
      };
    },
    [updateOneUser.rejected]: (state, action) => {
      return {
        ...state,
        loginStatus: "",
        loginError: "",
        signupStatus: "",
        signupError: "",
        updateUserStatus: "ailed",
        updateUserError: action.payload,
      };
    },
  },
});

export default loginSignupSlice.reducer;
