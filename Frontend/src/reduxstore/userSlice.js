import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  avatar: "",
  phone: "",
  verify_email: "",
  status: "",
  address_details: [],
  shopping_cart: [],
  orderhistory: [],
  role: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setuserdetail: (state, action) => {
      const userData = action.payload.data || action.payload || {};
      return { ...state, ...userData }; // replace state with payload
    },
    Uploadavatar: (state, action) => {
      state.avatar = action.payload.avatar || action.payload || "";
    },
   updateUser: (state, action) => {
      const newState = { ...state, ...action.payload };
      localStorage.setItem("user", JSON.stringify(newState)); // keep in sync
      return newState;
    },
    clearUser: () => {
      localStorage.removeItem("user");
      return {};
    },
    logout: () => {
      return initialState; // reset state
    },
  },
});

export const { setuserdetail, logout, Uploadavatar, updateUser, clearUser } =
  userSlice.actions;
export default userSlice.reducer;
