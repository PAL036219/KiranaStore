import { createSlice } from "@reduxjs/toolkit";

const initialvalue={
    allcategory : [],
    allsubcategory : [],
    product :[]
}

const productSlice = createSlice({
    name : "name",
    initialState : initialvalue,
    reducers :{
        setAllcategory : (state,action)=>{
            state.allcategory = [...action.payload]
        },
        setAllsubcategory :(state,action)=>{
            state.allsubcategory = [...action.payload]
        }
    }
})
export const {setAllcategory,setAllsubcategory} = productSlice.actions
export  default productSlice.reducer