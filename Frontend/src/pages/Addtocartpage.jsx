import React from "react";
import { useSelector } from "react-redux";

const Addtocartpage = () => {
  const cartItems = useSelector((state) => state.cartItem.cart);

  const formatPrice = (price) => `₹${price?.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-100 mt-10">
      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="bg-amber-300 h-32 w-full text-center text-2xl font-bold flex items-center justify-center px-4">
          <h1 className="truncate">Your Cart ({cartItems.length} items)</h1>
        </div>

        <div className="p-4">
          <h1 className="text-center text-lg font-bold mt-4 text-green-600">
            Estimated delivery in 10 mins
          </h1>

          <div className="text-xl font-bold mt-6 mb-4">
            Products ({cartItems.length})
          </div>

          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item._id || item.id}
                className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm"
              >
                <div className="flex items-start">
                  <div className="w-16 h-16 mr-3 flex-shrink-0">
                    <img
                      src={
                        item.productid?.image[0] ||
                        item.productid?.image ||
                        "https://via.placeholder.com/150"
                      }
                      alt={item.productid?.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {item.productid?.name}
                    </h3>
                    <p className="text-green-600 text-xs mt-1">
                      Delivery in 10 mins
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <div className="font-bold text-sm ml-2">
                        {formatPrice(item.productid?.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-6xl mb-4">🛒</div>
              <p className="text-gray-600">Your cart is empty</p>
              <p className="text-sm text-gray-500 mt-2">
                Add some items to get started
              </p>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm mt-6 border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Total Amount</span>
                  <span>
                    {formatPrice(
                      cartItems.reduce(
                        (sum, i) => sum + i.productid?.price * i.quantity,
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex min-h-screen">
        {/* Main Content Area */}
        <div className="w-2/3 p-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">
              Your Shopping Cart ({cartItems.length} items)
            </h1>
            <p className="text-green-600 mb-6">Estimated delivery in 10 mins</p>

            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="flex items-center border-b pb-4"
                  >
                    <div className="w-20 h-20 mr-6 flex-shrink-0">
                      <img
                        src={
                          item.productid?.image[0] ||
                          item.image ||
                          "https://via.placeholder.com/150"
                        }
                        alt={item.productid?.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lg truncate">
                        {item.productid?.name}
                      </h3>
                      <p className="text-green-600 text-sm mt-1">
                        Delivery in 10 mins
                      </p>
                      <p className="text-sm mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-lg ml-4 w-24 text-right">
                      {formatPrice(item.productid?.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-500 text-8xl mb-6">🛒</div>
                <p className="text-gray-600 text-xl mb-2">Your cart is empty</p>
                <p className="text-gray-500">Add some items to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div className="w-1/3 p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>
                    {formatPrice(
                      cartItems.reduce(
                        (sum, i) => sum + i.productid?.price * i.quantity,
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
              <div className="text-center text-green-600 font-medium p-4 bg-green-50 rounded-lg">
                <p className="text-sm">Your delivery will arrive in</p>
                <p className="text-xl font-bold mt-1">10 mins</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Addtocartpage;
