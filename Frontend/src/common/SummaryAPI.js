export const baseURL = "http://localhost:5000";

const SummaryAPI = {
  register: {
    url: "/api/user/register",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },
  forgot: {
    url: "/api/user/forgotPassword",
    method: "put",
  },
  verifyOptForForgotPassword: {
    url: "/api/user/verifyresetpasswordotp",
    method: "put",
  },
  resetPasswordAfterVerification: {
    url: "/api/user/resetpasswordafterverification",
    method: "put",
  },
  refrencetoken: {
    url: "/api/user/refrencetoken",
    method: "post",
  },
  getuserdetails: {
    url: "/api/user/getuserdetail",
    method: "get",
  },
  logouttheuser: {
    url: "/api/user/logout",
    method: "get",
  },
  Uploadavatar: {
    url: "/api/user/uploadimage",
    method: "put",
  },
  updatedetails: {
    url: "/api/user/updatedetails",
    method: "put",
  },
  addcategoty: {
    url: "/api/CategoryRouter/addcategory",
    method: "post",
  },
  getcategorydata: {
    url: "/api/CategoryRouter/getcategorydata",
    method: "get",
  },
  uploadimage: {
    url: "/api/imagerouter/imageupload",
    method: "post",
  },
  updatecategory: {
    url: "/api/CategoryRouter/updatecategory",
    method: "put",
  },
  deletecategory: {
    url: "/api/CategoryRouter/deletecategory",
    method: "delete",
  },
  addsubcategory: {
    url: "/api/subcategoryrouter/createsubcategory",
    method: "post",
  },
  getsubcateogrydata: {
    url: "/api/subcategoryrouter/getsubcategory",
    method: "get",
  },
  updatesubcategorydata: {
    url: "/api/subcategoryrouter/updatesubcategory",
    method: "put",
  },
  deletesubcategory: {
    url: "/api/subcategoryrouter/deletesubcategory",
    method: "delete",
  },
  uploadproduct: {
    url: "/api/uploadproductrouter/uploadproduct",
    method: "post",
  },
  getallproduct: {
    url: "/api/uploadproductrouter/getproduct",
    method: "post",
  },
  deleteproduct: {
    url: "/api/uploadproductrouter/deleteproduct",
    method: "delete",
  },
  getproductfromcategory: {
    url: "/api/uploadproductrouter/getproductfromcategory",
    method: "post",
  },
  getproductfromcategoryandsubcategory: {
    url: "/api/uploadproductrouter/getproductfromcategoryandsubcategory",
    method: "post",
  },
  getproductdetailsforproductpage: {
    url: "/api/uploadproductrouter/getproductdetailsforproductpage",
    method: "post",
  },
  gettrendingproducts: {
    url: "/api/uploadproductrouter/gettrendingproducts",
    method: "get",
  },
  searchproducts: {
    url: "/api/uploadproductrouter/searchproducts",
    method: "post",
  },
  getrandomproduct: {
    url: "/api/uploadproductrouter/getrandomproduct",
    method: "get",
  },
  addtocart: {
    url: "/api/cart/getcart",
    method: "post",
  },
  getcartdetails: {
    url: "/api/cart/getcartdetails",
    method: "get",
  },
  deletecartitem: {
    url: "/api/cart/deletecartitem",
    method: "delete",
  },
  addtowishlist: {
    url: "/api/cart/addtowishlist",
    method: "post",
  },
  removefromcart: {
    url: "/api/cart/romvefromcart",
    method: "delete",
  },
  

};
export default SummaryAPI;
