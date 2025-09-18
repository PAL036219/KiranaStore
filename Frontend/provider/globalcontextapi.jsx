// contexts/GlobalProvider.js
import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../src/utils/Axios";
import SummaryAPI from "../src/common/SummaryAPI";
import { useDispatch, useSelector } from "react-redux";
import { handlecartitem } from "../src/reduxstore/cartproduct";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

// Local storage utilities for guest cart
const CartStorage = {
  saveGuestCart: (cartItems) => {
    try {
      localStorage.setItem("guest_cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving guest cart:", error);
    }
  },

  loadGuestCart: () => {
    try {
      const cart = localStorage.getItem("guest_cart");
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("Error loading guest cart:", error);
      return [];
    }
  },

  clearGuestCart: () => {
    try {
      localStorage.removeItem("guest_cart");
    } catch (error) {
      console.error("Error clearing guest cart:", error);
    }
  },
};

export const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
    const [totalQty, setTotalQty] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
      const cartdata = useSelector((state) => state.cartItem.cart);
        const [isUpdatingCart, setIsUpdatingCart] = useState(false);
         const [cartQuantity, setCartQuantity] = useState(0);

  const fetchcartdetails = async () => {
    // For guest users, load from localStorage
    if (!user?._id) {
      const guestCart = CartStorage.loadGuestCart();
      dispatch(handlecartitem(guestCart));
      return;
    }

    // For logged-in users, fetch from API
    setIsLoading(true);
    setError(null);

    try {
      const response = await Axios({
        ...SummaryAPI.getcartdetails,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handlecartitem(responseData.data));
      } else {
        setError("Failed to fetch cart details");
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Sync guest cart to server when user logs in
  const syncGuestCartToServer = async () => {
    const guestCart = CartStorage.loadGuestCart();
    if (guestCart.length > 0 && user?._id) {
      try {
        for (const item of guestCart) {
          await Axios({
            ...SummaryAPI.addtocart,
            method: "POST",
            data: {
              productid: item.productid,
              quantity: item.quantity,
            },
          });
        }
        // Clear guest cart after successful sync
        CartStorage.clearGuestCart();
      } catch (error) {
        console.error("Error syncing guest cart:", error);
      }
    }
  };



  // Fetch cart details when user changes
  useEffect(() => {
    if (user?._id) {
      // User is logged in - sync guest cart and fetch server cart
      syncGuestCartToServer().then(() => {
        fetchcartdetails();
      });
    } else {
      // User is not logged in - load guest cart
      fetchcartdetails();
    }
  }, [user?._id]);
  // Function to refresh cart details
  useEffect(() => {
      // Check if cartdata exists and is not empty
      if (cartdata && cartdata.length > 0) {
        const totalQuantity = cartdata.reduce(
          (total, item) => total + item.quantity,
          0
        );
        const totalCartPrice = cartdata.reduce((preve, curr) => {
          // Make sure productid and price exist
          if (curr.productid && curr.productid.price) {
            return preve + curr.productid.price * curr.quantity;
          }
          return preve; // Skip items with missing price data
        }, 0); // Add initial value of 0
  
        console.log("totalcartprice", totalCartPrice);
        console.log("totalquantity", totalQuantity);
        console.log("cartdata", cartdata);
  
        setTotalQty(totalQuantity);
        setTotalPrice(totalCartPrice);
      } else {
        // Handle empty cart case
        setTotalQty(0);
        setTotalPrice(0);
      }
    }, [cartdata]);

  const refreshCart = () => {
    fetchcartdetails();
  };


  const value = {
    fetchcartdetails: refreshCart,
    isLoading,
    error,
    clearError: () => setError(null),
    totalQty,
    totalPrice,
    cartdata,
    setTotalPrice,
    setTotalQty,
   
    
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalProvider;
