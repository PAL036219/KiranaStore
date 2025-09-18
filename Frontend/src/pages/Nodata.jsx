import React from "react";
import nodata from "../assets/nodata.webp";

const Nodata = ({ message = "No data available", subtitle = "There's nothing to display at the moment" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Image with subtle animation */}
      <div className="relative mb-6">
        <img 
          src={nodata} 
          alt="No data"
          className="h-full w-full object-contain opacity-90 transition-opacity duration-300 hover:opacity-100" 
        />
        {/* Optional decorative element */}
        <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full opacity-70 blur-lg"></div>
      </div>
      
      {/* Text content */}
      <div className="max-w-md mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          {message}
        </h3>
        <p className="text-gray-500 mb-6">
          {subtitle}
        </p>
        
        {/* Optional call to action */}
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">
          Refresh Page
        </button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute left-1/4 top-1/4 w-16 h-16 rounded-full bg-blue-100 opacity-40 blur-xl"></div>
      <div className="absolute right-1/4 bottom-1/4 w-20 h-20 rounded-full bg-purple-100 opacity-40 blur-xl"></div>
    </div>
  );
};

export default Nodata;