import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMobile } from "../hooks/Mobilehooks";
import { IoArrowBackOutline } from "react-icons/io5";
import { FiSearch, FiX } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [animatedText, setAnimatedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchBarRef = useRef(null);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const backbutton = (e) => {
    e.stopPropagation();
    navigate(-1);
  };

  const placeholderTexts = [
    "Search for fresh vegetables...",
    "Find dairy products...",
    "Discover organic fruits...",
    "Explore bakery items...",
    "Looking for beverages?",
    "Find kitchen essentials...",
    "Search for snacks...",
  ];

  const isMobile = useMobile();
  const isSearchPage = location.pathname === "/search";

  // Animate placeholder text
  useEffect(() => {
    if (location.pathname === "/search") {
      setAnimatedText("What are you looking for?");
      return;
    }

    const currentText = placeholderTexts[textIndex];
    let timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setAnimatedText(currentText.substring(0, currentIndex - 1));
        setCurrentIndex(currentIndex - 1);

        if (currentIndex === 0) {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % placeholderTexts.length);
        }
      }, 50);
    } else {
      timeout = setTimeout(() => {
        setAnimatedText(currentText.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);

        if (currentIndex === currentText.length) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, textIndex, location.pathname]);

  // Handle scroll for mobile - hide/show entire search bar
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down → hide search bar
        setShowSearchBar(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 10) {
        // Scrolling up or at top → show search bar
        setShowSearchBar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobile]);

  // Debounced search navigation
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const debouncedSearchNavigate = useRef(
    debounce((query) => {
      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }, 500) // 500ms delay
  ).current;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If we're already on the search page, update the URL with the new query
    if (location.pathname === "/search") {
      debouncedSearchNavigate(value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleContainerClick = (e) => {
    // Only navigate if the click is directly on the container, not on input or buttons
    if (e.target === e.currentTarget && location.pathname !== "/search") {
      navigate("/search");
    }
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
    if (location.pathname !== "/search") {
      navigate("/search");
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (location.pathname !== "/search" && isMobile) {
      navigate("/search");
    }
  };

  // Clear search when leaving search page
  useEffect(() => {
    if (location.pathname !== "/search") {
      setSearchQuery("");
    }
  }, [location.pathname]);

  return (
    <div
      ref={searchBarRef}
      className={`relative w-full max-w-2xl mx-auto px-2 transition-all  duration-500 ease-in-out ${
        isMobile
          ? showSearchBar
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
          : ""
      }`}
    >
      {/* Delivery Banner */}
      {!isSearchPage && (
        <div className="flex items-center justify-center mb-1">
          <div className="flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <TbTruckDelivery className="mr-2 text-green-600" size={18} />
            <span>Free delivery in 30 minutes 🚀</span>
          </div>
        </div>
      )}

      {/* Search Box */}
      <div
        className="relative cursor-pointer transform hover:scale-105 transition-transform duration-200"
        onClick={handleContainerClick}
      >
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl ${
                isFocused ? "opacity-100" : "opacity-70"
              } transition-opacity duration-300`}
            ></div>

            <div className="relative bg-white rounded-2xl p-0.5">
              <div className="flex items-center bg-white rounded-2xl pl-4 pr-2 py-2 shadow-lg">
                <button
                  type="button"
                  className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  onClick={isSearchPage && isMobile ? backbutton : undefined}
                >
                  {isSearchPage && isMobile ? (
                    <IoArrowBackOutline size={22} className="text-gray-600" />
                  ) : (
                    <FiSearch
                      size={20}
                      className={`transition-colors duration-200 ${
                        isFocused ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                  )}
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleInputFocus}
                  onBlur={() => setIsFocused(false)}
                  placeholder={animatedText}
                  className="flex-1 ml-2 outline-none text-gray-800 placeholder-gray-400 text-base md:text-lg bg-transparent w-full"
                  onClick={handleInputClick}
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      if (location.pathname === "/search") {
                        navigate("/search"); // Clear the search results
                      }
                      inputRef.current?.focus();
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={18} />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className={`ml-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                    searchQuery.trim()
                      ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isMobile ? (
                    <FiSearch size={18} />
                  ) : (
                    <span className="flex items-center">
                      <FiSearch size={16} className="mr-1" />
                      Search
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Quick Suggestions (Desktop only - hidden on mobile when search bar is hidden) */}
      {!isSearchPage && !isMobile && (
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {["Vegetables", "Fruits", "Dairy", "Bakery", "Snacks"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setSearchQuery(item);
                navigate(`/search?q=${encodeURIComponent(item)}`);
              }}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-100 hover:text-green-800 transition-colors duration-200 border border-gray-200 hover:border-green-300"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {isFocused && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-1 animate-pulse"></div>
      )}
    </div>
  );
};

export default Searchbar;