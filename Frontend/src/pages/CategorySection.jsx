import React, { useState, useEffect } from "react";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import ValidUrlconverter from "../utils/VlaidUrlConverter";
import { Link, useNavigate } from "react-router-dom";
import Categorywiseproduct from "./categorywiseproduct";


const CategorySection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(0);
  const [isHovered, setIsHovered] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  

  // Get categories from Redux with fallback
  const reduxCategories = useSelector(
    (state) => state.product.allcategory || []
  );
  const subCategories = useSelector(
    (state) => state.product.allsubcategory || []
  );

  // Slug creation function

  // Handle click event - navigate to category page
  const handleonclickeventondiv = (category) => {
    // Find subcategory
    let Subcategory = null;
    try {
      Subcategory = subCategories.find((sub) => {
        const hasCategory =
          sub.category &&
          sub.category.some((c) => {
            return c._id === category._id;
          });

        return hasCategory;
      });
    } catch (error) {
      console.error("Error finding subcategory:", error);
    }

    // Create URL with query parameters
    const categoryName = category?.name || "category";
    const categoryId = category?._id || "1";
    const subcategoryName = Subcategory?.name || "all";
    const subcategoryId = Subcategory?._id || "1";

    const URL = `/categoryproduct/${categoryId}/${ValidUrlconverter(
      categoryName
    )}?subcategoryId=${subcategoryId}&subcategoryName=${ValidUrlconverter(
      subcategoryName
    )}`;

    console.log("Final URL:", URL);
    navigate(URL);
  };
  const defaultCategories = [
  {
    _id: 1,
    name: "Fresh Vegetables",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    items: 128,
  },
  {
    _id: 2,
    name: "Seasonal Fruits",
    image: "https://images.unsplash.com/photo-1566842600175-97dca3dfc3c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    items: 96,
  },
  {
    _id: 3,
    name: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwa90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    items: 72,
  },
  {
    _id: 4,
    name: "Meat & Fish",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwa90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    items: 58,
  },
];

  const processCategories = (cats) => {
    return cats.map((cat, index) => {
      // If category doesn't have an image, use a default one
      const imageUrl =
        cat.image ||
        defaultCategories[index % defaultCategories.length]?.image ||
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwa90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80";

      // Ensure items count exists
      const items = cat.items || Math.floor(Math.random() * 100) + 20;

      return {
        _id: cat._id || cat.id || index,
        name: cat.name || `Category ${index + 1}`,
        image: imageUrl,
        items: items,
      };
    });
  };

  // Use processed Redux categories if available, otherwise use default categories
  const categories =
    reduxCategories.length > 0
      ? processCategories(reduxCategories)
      : defaultCategories;

  // Animation on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle category navigation
  const nextCategory = () => {
    if (categories.length > 0) {
      setActiveCategory((prev) => (prev + 1) % categories.length);
    }
  };

  const prevCategory = () => {
    if (categories.length > 0) {
      setActiveCategory(
        (prev) => (prev - 1 + categories.length) % categories.length
      );
    }
  };

  // Show loading state if categories are not available yet
  if (categories.length === 0) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Browse Our Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Loading categories...
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-md animate-pulse"
              >
                <div className="h-40 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Browse Our Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover a wide range of fresh and organic products carefully
            selected for your healthy lifestyle.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-white shadow-md p-1">
            {categories.slice(0, 4).map((category, index) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeCategory === index
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Category Display */}
        <div className="relative mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Featured Category */}
            <div
              onClick={() =>
                handleonclickeventondiv(categories[activeCategory])
              }
              className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-500 cursor-pointer ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="relative h-96">
                <img
                  src={categories[activeCategory]?.image}
                  alt={categories[activeCategory]?.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwa90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    {categories[activeCategory]?.name}
                  </h3>
                  <p className="mb-4">
                    {categories[activeCategory]?.items || 0} products
                  </p>
                  <button className="flex items-center text-sm font-semibold bg-white text-gray-800 py-2 px-4 rounded-full w-max hover:bg-gray-100 transition-colors duration-300">
                    Shop Now <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-2 gap-4">
              {categories
                .filter((_, idx) => idx !== activeCategory)
                .slice(0, 4)
                .map((category, index) => (
                  <div
                    key={category._id}
                    onClick={() => handleonclickeventondiv(category)}
                    className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl cursor-pointer ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-10"
                    }`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                    onMouseEnter={() => setIsHovered(category._id)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <div className="relative h-48">
                      <img
                        src={category.image}
                        alt={category.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isHovered === category._id ? "scale-110" : "scale-100"
                        }`}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwa90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                        <div
                          className={`text-center transition-all duration-300 ${
                            isHovered === category._id
                              ? "transform -translate-y-2"
                              : ""
                          }`}
                        >
                          <h4 className="font-semibold text-white text-lg mb-1">
                            {category.name}
                          </h4>
                          <p className="text-sm text-gray-200">
                            {category.items} items
                          </p>
                          <button
                            className={`mt-2 text-xs bg-white text-gray-800 font-medium py-1 px-3 rounded-full transition-all duration-300 ${
                              isHovered === category._id
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          >
                            Explore
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Navigation Arrows - Only show if there are categories */}
          {categories.length > 1 && (
            <>
              <button
                onClick={prevCategory}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <FiChevronLeft className="text-2xl text-gray-700" />
              </button>
              <button
                onClick={nextCategory}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <FiChevronRight className="text-2xl text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* All Categories Grid - Updated for mobile */}
        <div
          className={`grid grid-cols-5 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => handleonclickeventondiv(category)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer"
            >
              {/* Square wrapper for mobile, maintains aspect ratio */}
              <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
              <div className="text-center p-2 flex-grow flex flex-col justify-center">
                <h3 className="font-semibold text-gray-800 text-xs truncate px-1">
                  {category.name}
                </h3>
                <p className="text-[10px] text-gray-600 mt-1">
                  {category.items} products
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Products Section */}
      <div>
        {reduxCategories.map((category, index) => (
          <Categorywiseproduct
            key={category._id || index}
            category={category._id}
            name={category.name}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
