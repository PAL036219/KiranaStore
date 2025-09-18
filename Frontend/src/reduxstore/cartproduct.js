import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
const initialstate = {
    cart : []
}
const cartSlice = createSlice({
    name : "cart",
    initialState : initialstate,
    reducers : {
        handlecartitem : (state,action)=>{
            state.cart = [...action.payload]
        

        },

    }})
    export const {handlecartitem} = cartSlice.actions
    export default cartSlice.reducer
