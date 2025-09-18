import React from "react";
import { useSelector } from "react-redux";
import { useGlobalContext } from "../../provider/globalcontextapi";
import CartSliderButton from "../pages/Cartslider";


const Showcartinfoatbottom = () => {
     const cartdata = useSelector((state) => state.cartItem.cart);
       const{totalPrice,totalQty,setTotalPrice,
         setTotalQty,} = useGlobalContext();
  return (
    <>
      <div>
        <CartSliderButton/>


      </div>
    </>
  );
};

export default Showcartinfoatbottom;
