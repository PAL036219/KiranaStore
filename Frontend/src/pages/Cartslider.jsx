import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../provider/globalcontextapi";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

const CartSliderButton = () => {
  const { totalPrice, totalQty } = useGlobalContext();
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Smooth spring animation for the drag handle
  const x = useMotionValue(0);
  const smoothX = useSpring(x, {
    damping: 20,
    stiffness: 300,
    mass: 0.5
  });

  // Update slider width on resize and initial render
  useEffect(() => {
    const updateWidth = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Calculate the threshold for successful slide (70% of slider width)
  const successThreshold = sliderWidth * 0.7;

  // Transform for the progress bar width
  const dragPercentage = useTransform(
    x,
    [0, sliderWidth - 56],
    [0, 100]
  );

  // Transform for the hint text opacity
  const hintOpacity = useTransform(
    x,
    [0, 50],
    [1, 0]
  );

  // Transform for the success text opacity
  const successOpacity = useTransform(
    x,
    [successThreshold - 20, successThreshold],
    [0, 1]
  );

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Handle drag end
// Handle drag end
const handleDragEnd = () => {
  setIsDragging(false);

  // Check if the user slid far enough to trigger navigation
  if (x.get() > successThreshold) {
    navigate("/cart"); // <-- uncomment this when ready
  }

  // Reset drag handle smoothly by updating x (spring will animate it)
  x.set(0);
};


  // Handle click/tap
  const handleClick = () => {
    // Only navigate if not dragging (to prevent navigation after drag)
    if (!isDragging) {
      // navigate("/cart");
    }
  };

  return (
    <div className="fixed bottom-4 left-0 w-full z-50 px-4 lg:hidden">
      <div
        ref={sliderRef}
        className="relative w-full h-14 bg-gray-100 rounded-full shadow-md overflow-hidden cursor-pointer select-none"
        onClick={handleClick}
      >
        {/* Background Track */}
        <div className="absolute inset-0 bg-gray-200 opacity-60"></div>
        
        {/* Progress Track */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-end pr-4"
          style={{ width: dragPercentage }}
        >
          {/* Success Text */}
          <motion.span
            className="text-white text-sm font-semibold whitespace-nowrap"
            style={{ opacity: successOpacity }}
          >
            Release to view cart
          </motion.span>
        </motion.div>

        {/* Hint Text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-gray-600 font-medium text-sm"
          style={{ opacity: hintOpacity }}
        >
          Slide to view cart
        </motion.div>

        {/* Drag Handle */}
        <motion.div
          drag="x"
          dragConstraints={sliderRef}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ x: smoothX }}
          className="absolute top-1 left-1 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-amber-600 font-bold cursor-grab active:cursor-grabbing"
          whileTap={{ scale: 1.05 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
          </svg>
          {totalQty > 0 && (
            <motion.span
              key={totalQty}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
            >
              {totalQty}
            </motion.span>
          )}
        </motion.div>
        
        
      </div>
    </div>
  );
};

export default CartSliderButton;