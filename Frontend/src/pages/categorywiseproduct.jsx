import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import Cardforcategory from "./Cardforcategoryshow";

const Categorywiseproduct = ({ category, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const mockProducts = [
    {
      _id: "1",
      productName: "Sample Apple",
      price: 4.99,
      productImage:
        "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80",
      rating: 4.5,
      inStock: true,
    },
     {
      _id: "2",
      productName: "Sample Apple",
      price: 4.99,
      productImage:
        "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80",
      rating: 4.5,
      inStock: true,
    },
     {
      _id: "3",
      productName: "Sample Apple",
      price: 4.99,
      productImage:
        "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80",
      rating: 4.5,
      inStock: true,
    },
     {
      _id: "4",
      productName: "Sample Apple",
      price: 4.99,
      productImage:
        "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80",
      rating: 4.5,
      inStock: true,
    }, {
      _id: "5",
      productName: "Sample Apple",
      price: 4.99,
      productImage:
        "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80",
      rating: 4.5,
      inStock: true,
    }, {
      _id: "6",
      productName: "Sample Apple",
      price: 4.99,
      productImage:
        "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80",
      rating: 4.5,
      inStock: true,
    },
     {
      _id: "7",
      productName: "Sample Apple",
      price: 4.99,
      productImage:
        "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80",
      rating: 4.5,
      inStock: true,
    },
 
    // add more mock items if needed
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        method: "POST",
        url: SummaryAPI.getproductfromcategory.url,
        data: { category },
      });

      if (response.data?.success && response.data?.data?.length > 0) {
        setData(response.data.data);
      } else {
        setData(mockProducts);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setData(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      fetchProducts();
    } else {
      setData(mockProducts);
      setLoading(false);
    }
  }, [category]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-semibold">{name}</p>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg h-64 w-40 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-semibold">{name}</p>
      </div>

      {data.length > 0 ? (
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            ◀
          </button>

          {/* Product Row */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {data.map((product) => (
              <div key={product._id  } className="flex-shrink-0 w-30 sm:w-48 md:w-52">
                <Cardforcategory data={product} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            ▶
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-6">No products found.</p>
      )}
    </div>
  );
};

export default Categorywiseproduct;
