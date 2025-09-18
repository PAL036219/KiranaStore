import React, { useState } from "react";
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaMapMarkerAlt,
  FaEdit,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdPayment, MdSupportAgent, MdSecurity } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RiAdminLine } from "react-icons/ri";
import IsAdmin from "../utils/isAdmin";

const EcommerceProfileCard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  return (
    <div className="  bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 ">
      <div className="max-w-4xl w-full bg-white rounded-2xl md:mt-10 shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Profile Sidebar */}
          <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center overflow-hidden">
                  {/* Show user avatar if available, otherwise show default icon */}
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // If image fails to load, show the default icon
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  {/* Always render the FaUser icon but hide it if avatar is displayed */}
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      user.avatar ? "hidden" : "flex"
                    }`}
                  >
                    <FaUser className="text-5xl text-white" />
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full text-blue-600 hover:bg-blue-100 transition">
                  <FaEdit className="text-sm" />
                </button>
              </div>

              <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
              <p className="text-blue-100">{user.email}</p>
              <div className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                {user.membership || "Standard Member"}
              </div>

              <div className="w-full mt-6 space-y-4">
                <Link
                  to={"/myprofileoverview"}
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg text-left transition ${
                    activeTab === "overview"
                      ? "bg-blue-700"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  <FaUser className="text-lg" />
                  <span>Profile Overview</span>
                </Link>

                <Link
                  to={"/myorder"}
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg text-left transition ${
                    activeTab === "orders" ? "bg-blue-700" : "hover:bg-blue-700"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <FaShoppingBag className="text-lg" />
                  <span>My Orders</span>
                </Link>

                <button
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg text-left transition ${
                    activeTab === "wishlist"
                      ? "bg-blue-700"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  <FaHeart className="text-lg" />
                  <span>Wishlist</span>
                </button>

                <button
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg text-left transition ${
                    activeTab === "address"
                      ? "bg-blue-700"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={() => setActiveTab("address")}
                >
                  <FaMapMarkerAlt className="text-lg" />
                  <span>Addresses</span>
                </button>

                <button
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg text-left transition ${
                    activeTab === "payment"
                      ? "bg-blue-700"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={() => setActiveTab("payment")}
                >
                  <MdPayment className="text-lg" />
                  <span>Payment Methods</span>
                </button>

                <button
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg text-left transition ${
                    activeTab === "security"
                      ? "bg-blue-700"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  <MdSecurity className="text-lg" />
                  <span>Security</span>
                </button>
                {IsAdmin(user.role) && (
                  <Link
                    to={"/adminuser"}
                    className={`w-full flex items-center space-x-2 p-3 rounded-lg text-left transition ${
                      activeTab === "Admin"
                        ? "bg-blue-700"
                        : "hover:bg-blue-700"
                    }`}
                    onClick={() => setActiveTab("Admin")}
                  >
                    <RiAdminLine className="text-lg" />
                    <span>Admin</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Profile Overview
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FaShoppingBag className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {user.orders || 0}
                    </p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <FaHeart className="text-pink-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {user.wishlist || 0}
                    </p>
                    <p className="text-sm text-gray-600">Wishlist Items</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FaMapMarkerAlt className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {user.addresses || 0}
                    </p>
                    <p className="text-sm text-gray-600">Saved Addresses</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MdPayment className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {user.paymentMethods || 0}
                    </p>
                    <p className="text-sm text-gray-600">Payment Methods</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <MdSupportAgent className="text-2xl text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Need Help?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Contact our support team for assistance with your account or
                    orders.
                  </p>
                  <button className="mt-2 text-sm text-blue-600 font-medium hover:underline">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceProfileCard;
