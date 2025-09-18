import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";

import Headers from "./component/Header";
import Footer from "./component/Footer";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import Loginpagesforregister from "./pages/Loginpagesforregister";
import ForNewRegisteruser from "./pages/ForNewRegisteruser";
import ForForgotPassword from "./pages/ForForgotPassword";

import OtpVerificationForForgotPassword from "./pages/OtpVerificationForForgotPassword";
import ForChangeTheOldPassword from "./pages/ForChangeTheOldPassword";
import { useEffect } from "react";
import fetchUserDetail from "./utils/FetchUserDetail";
import { setuserdetail } from "./reduxstore/userSlice";
import { useDispatch } from "react-redux";
import UserInitializer from "./Intializer/UserInitializer";
import UserMenuForMobile from "./pages/UserMenuForMobile";
import FortheMyProfilePage from "./pages/FortheMyProfilePage";
import Myorderpage from "./profilespages/Myorderpage";
import MyProfileOverview from "./profilespages/MyProfileOverview";
import ChangeProfileImage from "./profilespages/ChangeProfileImage";
import Admin from "./Admin/adminrouter/Admin";
import Category from "./Admin/adminrouter/category";
import AdminPermissionOnly from "./Admin/Adminpermmisononly";
import { setAllcategory, setAllsubcategory } from "./reduxstore/categoryslice";
import Axios from "./utils/Axios";
import SummaryAPI from "./common/SummaryAPI";
import ProductDetails from "./pages/ProductDetails";
import Forcategoryproduct from "./pages/Forcategoryproduct";
import ScrollToTop from "./component/Scrollto";
import GlobalProvider from "../provider/globalcontextapi";
import Addtocartpage from "./pages/Addtocartpage";

// make sure path is correct

const App = () => {
  const dispatch = useDispatch();

  const userdetail = async () => {
    const data = await fetchUserDetail();
  };
  const fetchCategoryData = async () => {
    try {
      const response = await Axios({ ...SummaryAPI.getcategorydata });

      let categories = [];
      if (response.data && Array.isArray(response.data)) {
        categories = response.data;
      } else if (response.data && response.data.data) {
        categories = response.data.data;
      } else if (response.data && response.data.success && response.data.data) {
        categories = response.data.data;
      }
      console.log("dataaa", categories);
      dispatch(setAllcategory(categories));
      // setCategoryData(categories);
    } catch (error) {
      console.error("Error fetching category data:", error);
    } finally {
    }
  };
  const fetchSubCategoryData = async () => {
    try {
      const response = await Axios({ ...SummaryAPI.getsubcateogrydata });

      let subcategories = [];
      if (response.data && Array.isArray(response.data)) {
        subcategories = response.data;
      } else if (response.data && response.data.data) {
        subcategories = response.data.data;
      } else if (response.data && response.data.success && response.data.data) {
        subcategories = response.data.data;
      }

      dispatch(setAllsubcategory(subcategories));
      // setCategoryData(categories);
    } catch (error) {
      console.error("Error fetching category data:", error);
    } finally {
    }
  };

  useEffect(() => {
    userdetail();
    fetchCategoryData();
    fetchSubCategoryData();
  }, []);
  return (
    <>
      <GlobalProvider>
        <UserInitializer />

        <BrowserRouter>
          <ScrollToTop /> {/* Add BrowserRouter wrapper here */}
          <Headers />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<Loginpagesforregister />} />
            <Route path="/register" element={<ForNewRegisteruser />} />
            <Route path="/forgotpassword" element={<ForForgotPassword />} />
            <Route path="/UserMenuForMobile" element={<UserMenuForMobile />} />
            <Route path="/profile" element={<FortheMyProfilePage />} />
            <Route path="/myorder" element={<Myorderpage />} />
            <Route path="/myprofileoverview" element={<MyProfileOverview />} />
            <Route path="/editprofile" element={<ChangeProfileImage />} />
            <Route path="/product/:id/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<Addtocartpage />} />
            <Route
              path="/categoryproduct/:categoryId/:categoryName"
              element={<Forcategoryproduct />}
            />
            "
            <Route
              path="/category"
              element={
                <AdminPermissionOnly>
                  <Category />
                </AdminPermissionOnly>
              }
            />
            <Route
              path="/adminuser"
              element={
                <AdminPermissionOnly>
                  <Admin />
                </AdminPermissionOnly>
              }
            />
            <Route
              path="/verifyotp"
              element={<OtpVerificationForForgotPassword />}
            />
            <Route
              path="/resetpassword"
              element={<ForChangeTheOldPassword />}
            />
            <Route path="*" element={<Home />} />
          </Routes>
          
          <Footer />
        </BrowserRouter>
        <Toaster position="top-center" />
      </GlobalProvider>
    </>
  );
};

export default App;
