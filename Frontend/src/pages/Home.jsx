import React from "react";
import banner1 from "../assets/logoandimages/banner.jpg";
import banner2 from "../assets/logoandimages/banner-mobile.jpg";
import CategorySection from "./CategorySection";
import Showcartinfoatbottom from "./Showcartinfoatbottom";


const Home = () => {
  return (
   
    <>
    <div>
      
     
      <div className={`mt-13 h-60 w-full ${!banner1 && animate - pulse}`}>
        <div
        className="">
          <img src={banner1} className="hidden lg:block " alt="banner" />
        </div>
        <div
        className="">
          <img src={banner2} className=" lg:hidden" alt="banner" />
        </div>
      </div>

      <div className="mt-2">
        <CategorySection />
      </div>
      </div>
      <Showcartinfoatbottom/>
    </>
  );
};

export default Home;
