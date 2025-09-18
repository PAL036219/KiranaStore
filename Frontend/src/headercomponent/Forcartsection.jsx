import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { TbCurrencyRupee } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Forcartsection = ({ className = "", onCartClick }) => {
  const cartdata = useSelector((state) => state.cartItem.cart);
  const [itemCount, setItemCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const Navigate = useNavigate();

  // Calculate total price and update item count with animation
  useEffect(() => {
    // Calculate total price
    const calculatedTotal = cartdata.reduce((total, item) => {
      const price =
        item.productid && item.productid.price ? item.productid.price : 0;
      return total + price * (item.quantity || 1);
    }, 0);

    setTotalPrice(calculatedTotal);

    // Handle animation when items are added
    if (cartdata.length > itemCount) {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 300);
    }
    setItemCount(cartdata.length);
  }, [cartdata, itemCount]);
  //path for the navigate to the cart section
  const clickoncartsection = () => {
    Navigate("/");
  };

  return (
    <div
      className={`
        flex items-center gap-1
        p-2 rounded-lg cursor-pointer
        bg-gray-50 border border-gray-200
        transition-all duration-300 ease-in-out
        hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-md
        active:translate-y-0
        ${className}
      `}
      onClick={clickoncartsection}
      role="button"
      aria-label="Shopping cart"
      tabIndex={0}
    >
      <div className={`relative ${isBouncing ? "animate-bounce" : ""}`}>
        <MdOutlineShoppingCartCheckout className="w-7 h-7  text-gray-700" />
        {cartdata.length > 0 && (
          <span
            className="
            absolute -top-2 -right-2
            bg-red-500 text-white
            rounded-full w-5 h-5
            flex items-center justify-center
            text-xs font-bold
          "
          >
            {cartdata.length > 99 ? "99+" : cartdata.length}
          </span>
        )}
      </div>

      <div onClick={onCartClick} className="flex flex-col items-start">
        <span className="font-medium text-gray-700 md:block hidden">
          Cart ({cartdata.length})
        </span>

        {cartdata.length > 0 && (
          <div className="lg:hidden flex flex-col items-center text-green-600 font-semibold text-sm">
            <TbCurrencyRupee className="w-5 h-5" />
            <span>{totalPrice.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forcartsection;
