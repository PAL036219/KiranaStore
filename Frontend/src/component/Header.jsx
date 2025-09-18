import React, { useState, useEffect } from "react";
import logo from "../assets/logoandimages/logo.png";
import Searchbar from "../headercomponent/Searchbar";
import { VscAccount } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";
import { useMobile } from "../hooks/Mobilehooks";
import Forcartsection from "../headercomponent/Forcartsection";
import { useSelector } from "react-redux";
import Dropdownarrow from "../headercomponent/DropMenuForAccount";
import DropmenuFormobileuser from "../headercomponent/DropmenuForMobileUser";
import { FiTruck, FiPhone, FiMapPin } from "react-icons/fi";
import navimage from "../assets/logoandimages/fornav.jpg";
import navimageDesktop from "../assets/logoandimages/desktopnav.jpg";
import { TbCurrencyRupee } from "react-icons/tb";
import { useGlobalContext } from "../../provider/globalcontextapi";

function Headers() {
  const isMobile = useMobile();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const [scrolled, setScrolled] = useState(false);
  const [mobileShrink, setMobileShrink] = useState(false);
  const cartdata = useSelector((state) => state.cartItem.cart);
  const{totalPrice,totalQty,setTotalPrice,
    setTotalQty,} = useGlobalContext();

  const isSearchPage = location.pathname === "/search";

  // Calculate cart totals
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

  // Add scroll effect and measure header height
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);

      if (isMobile) {
        if (window.scrollY > 50) {
          setMobileShrink(true);
        } else {
          setMobileShrink(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <div>
      <header
        className={`w-full fixed top-0 md:h-43 h-23 left-0 right-0 transition-all duration-500 z-50 rounded-b-2xl
          ${isMobile ? (mobileShrink ? "h-16" : "h-56") : ""}
          ${
            !isMobile && !scrolled
              ? "bg-gradient-to-r from-gray-500 to-gray-600"
              : ""
          }
        `}
        style={
          isMobile
            ? {
                backgroundImage: `url(${navimage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "all 0.2s ease-in-out",
              }
            : scrolled
            ? {
                backgroundImage: `url(${navimageDesktop})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "all 0.5s ease-in-out",
              }
            : {}
        }
      >
        {scrolled && (
          <style>
            {`
              @media (min-width: 1024px) {
                header {
                  background-image: url(${navimageDesktop}) !important;
                  background-size: cover;
                  height: 170px
                }
              }
            `}
          </style>
        )}

        <div className="px-4">
          {!(isSearchPage && isMobile) && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center  gap-4">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <Link to="/" className="block">
                    <img
                      src={logo}
                      alt="FreshGroceries"
                      className={`hidden lg:block  transition-all duration-300  ${
                        scrolled ? "w-52" : "w-50"
                      } hover:scale-105`}
                    />
                    <img
                      src={logo}
                      alt="FreshGroceries"
                      className={`lg:hidden transition-all duration-300  ${
                        scrolled ? "w-38" : "w-38"
                      } hover:scale-105`}
                    />
                  </Link>
                </div>

                {/* Search bar - Desktop */}
                <div className="hidden lg:flex  flex-1 mx-6 max-w-2xl">
                  <Searchbar />
                </div>

                {/* Account + Cart */}
                <div className="flex items-center  gap-4">
                  {/* Account/Login */}
                  <div className="flex items-center">
                    {/* Mobile */}
                    <div className="lg:hidden">
                      {user?._id ? (
                        <DropmenuFormobileuser />
                      ) : (
                        <Link
                          to="/login"
                          className="flex items-center p-2 rounded-full hover:bg-green-700 transition-colors duration-200"
                        >
                          <VscAccount size={22} className="text-white" />
                        </Link>
                      )}
                    </div>

                    {/* Desktop */}
                    <div className="hidden lg:block">
                      {user?._id ? (
                        <Dropdownarrow />
                      ) : (
                        <Link to="/login">
                          <div
                            className={`
                              flex items-center gap-2 px-4 py-2 rounded-xl font-medium
                              transition-all duration-300 hover:scale-105
                              ${
                                scrolled
                                  ? "bg-green-900 text-white hover:bg-green-700 shadow-md"
                                  : "bg-white text-green-700 hover:bg-green-50 shadow-md"
                              }
                            `}
                          >
                            <VscAccount size={18} />
                            <span>Login</span>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Cart */}
                  <div className="relative group ">
                    <Link to="/cart">
                      <div
                        className={`
                          flex items-center gap-2 font-medium
                          rounded-xl transition-all duration-300 hover:scale-105 h-5
                          ${
                            scrolled
                              ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md"
                              : "bg-white text-orange-600 hover:bg-orange-50 shadow-md"
                          }
                        `}
                      >
                        <Forcartsection className="flex items-center  gap-1" />
                      </div>
                    </Link>

                    {/* Cart Hover Preview - Desktop only */}
                    {cartdata.length > 0 && (
                      <div className="absolute hidden lg:group-hover:block right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-lg p-4 z-50 border border-gray-200">
                        <div className="text-center">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Your Cart
                          </h4>
                          <p className="text-sm text-gray-600">
                            {totalQty} item{totalQty !== 1 ? "s" : ""}
                          </p>
                          <p
                            className="
                             flex items-center 
                                  bg-gradient-to-r from-green-50 to-emerald-50
  rounded-lg p-2
  border border-green-200
                                     shadow-sm
                                        mt-2"
                          >
                            <span className="text-gray-600 font-semibold mr-2">
                              Total:
                            </span>
                            <span className="flex items-center text-green-700 font-bold">
                              <TbCurrencyRupee className="w-4 h-4 mr-1" />
                              <span className="text-lg">
                                {totalPrice.toFixed(2)}
                              </span>
                            </span>
                          </p>
                          <Link
                            to="/cart"
                            className="block mt-3 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-colors"
                          >
                            View Cart & Checkout
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Searchbar - ALWAYS VISIBLE */}
          <div className="lg:hidden w-full mt-2">
            <Searchbar />
          </div>
        </div>
      </header>

      {/* Add padding to prevent content from being hidden behind fixed header */}
      <div
        className={`transition-all duration-500 ${
          isMobile ? (mobileShrink ? "pt-16" : "pt-44") : "pt-32"
        }`}
      ></div>
    </div>
  );
}

export default Headers;
