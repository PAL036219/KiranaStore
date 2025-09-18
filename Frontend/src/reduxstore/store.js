import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import userReducer from "./userSlice";
import productreducer from "../reduxstore/categoryslice"
import cartreducer from "../reduxstore/cartproduct";


// persist config
const persistConfig = {
  key: "root",
  storage,
};
// wrap your reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    product : productreducer,
    cartItem : cartreducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required by redux-persist
    }),
});

export const persistor = persistStore(store);
