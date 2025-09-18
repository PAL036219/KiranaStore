import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import toast from "react-hot-toast";
import Cardforcategoryshow from "./Cardforcategoryshow";
import { useLocation } from "react-router-dom";
import Noproductfoound from "./Noproductfoound";

const SearchPage = () => {
  const [totalpage, settotalpage] = useState(1);
  const [currentpage, setcurrentpage] = useState(1);
  const [data, setdata] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setloading] = useState(true);
  const [randomLoading, setRandomLoading] = useState(false);
  const loadingcardnumber = new Array(10).fill(null);
  const location = useLocation();

  // Extract search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

  const fetchsearchproduct = async () => {
    // Don't search if there's no query
    if (!searchQuery.trim()) {
      setdata([]);
      setloading(false);
      return;
    }

    try {
      setloading(true);

      const response = await Axios({
        ...SummaryAPI.searchproducts,
        method: "POST",
        data: {
          search: searchQuery,
          page: currentpage,
          limit: 10,
        },
      });

      const { data: responseData } = response;
      console.log("responsedata", responseData);

      if (responseData.success) {
        if (currentpage === 1) {
          setdata(responseData.data);
        } else {
          setdata((prev) => [...prev, ...responseData.data]);
        }
        settotalpage(responseData.totalPages);
        
      } else {
        toast.error(responseData.message || "Request failed");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong");
    } finally {
      setloading(false);
    }
  };

  const fetchRandomProducts = async () => {
    try {
      setRandomLoading(true);
      const response = await Axios({
        ...SummaryAPI.getrandomproduct,
        method: "GET",
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setRandomProducts(responseData.data);
        
      }
    } catch (error) {
      console.error("Error fetching random products:", error);
    } finally {
      setRandomLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 and clear data when search query changes
    setcurrentpage(1);
    setdata([]);

    // Fetch random products when there's no search query
    if (!searchQuery.trim()) {
      fetchRandomProducts();
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchsearchproduct();
  }, [currentpage, searchQuery]);

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {searchQuery
          ? `Search Results for "${searchQuery}" (${data.length})`
          : "Discover Products"}
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loadingcardnumber.map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 h-64 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : data.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((product) => (
              <Cardforcategoryshow
                key={product._id}
                data={product}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              />
            ))}
          </div>

          {currentpage < totalpage && (
            <div className="text-center mt-10">
              <button
                onClick={() => setcurrentpage((prev) => prev + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        searchQuery &&
        !loading && (
          <div className="text-center py-12">
            <div className=" lg:hidden">
           <Noproductfoound/>
            </div>
          

            {/* Show random products when search has no results */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-6">
                You might like these products
              </h2>
              {randomLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {loadingcardnumber.slice(0, 8).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-200 h-64 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : randomProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {randomProducts.map((product) => (
                    <Cardforcategoryshow
                      key={product._id}
                      data={product}
                      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )
      )}

      {/* Show random products when there's no search query */}
      {!searchQuery && !loading && (
        <div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-6">Featured Products</h2>
            {randomLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loadingcardnumber.slice(0, 8).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 h-64 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : randomProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {randomProducts.map((product) => (
                  <Cardforcategoryshow
                    key={product._id}
                    data={product}
                    className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No products available at the moment.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
