import React, { useState } from "react";
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaMapMarkerAlt,
  FaEdit,
  FaPhone,
} from "react-icons/fa";
import { MdPayment, MdSupportAgent, MdSecurity, MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const MyProfileOverview = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleopenchangeprofile = ()=>{
    navigate("/editprofile")

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl md:mt-10 overflow-hidden">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center overflow-hidden">
                    <FaUser className="text-5xl text-white" />
                  </div>
                )}
                <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full text-blue-600 hover:bg-blue-100 transition">
                  <FaEdit className="text-sm" />
                </button>
                
              </div>

              <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
              <p className="text-blue-100">{user.email}</p>

              <div className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                {user.membership || "Standard"}
              </div>

              {/* Sidebar Navigation */}
              <div className="w-full mt-6 space-y-2">
                <Link
                  to="/myprofileoverview"
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg transition ${
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
                  to="/myorder"
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg transition ${
                    activeTab === "orders" ? "bg-blue-700" : "hover:bg-blue-700"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <FaShoppingBag className="text-lg" />
                  <span>My Orders</span>
                </Link>
                

                <button
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg transition ${
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
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg transition ${
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
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg transition ${
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
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg transition ${
                    activeTab === "security"
                      ? "bg-blue-700"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  <MdSecurity className="text-lg" />
                  <span>Security</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Profile Overview
            </h1>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-white shadow-md object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                    <FaUser className="text-5xl text-white" />
                  </div>
                )}

                <button
                onClick={handleopenchangeprofile}
                 className="absolute bottom-1 right-2 flex items-center gap-2 bg-white px-3 py-2 rounded-full 
             text-blue-600 font-medium text-sm shadow-md border border-gray-200
             hover:bg-blue-600 hover:text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300"
>
                  <FaEdit className="text-sm" />
                  Edit
                </button>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-blue-600 font-medium">
                  {user.membership || "Standard Member"}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Member since {user.joinDate || "2023"}
                </p>
              </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {/* Name */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FaUser className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.name || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MdEmail className="text-purple-600 text-xl" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-semibold text-gray-800 truncate">
                      {user.email || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FaPhone className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FaMapMarkerAlt className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Default Address</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.address || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-800">12</p>
                    <p className="text-sm text-blue-600">Total Orders</p>
                  </div>
                  <FaShoppingBag className="text-blue-500 text-xl" />
                </div>
              </div>

              <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-pink-800">7</p>
                    <p className="text-sm text-pink-600">Wishlist Items</p>
                  </div>
                  <FaHeart className="text-pink-500 text-xl" />
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <MdSupportAgent className="text-xl text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Need Assistance?
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Our support team is here to help with your account or
                    orders.
                  </p>
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
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

export default MyProfileOverview;
