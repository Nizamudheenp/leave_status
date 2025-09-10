import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("user");
const initialUser = saved ? JSON.parse(saved) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: { user: initialUser },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, registerSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
