import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import SummaryAPI from "../common/SummaryAPI";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import AxiosToastError from "../utils/AxiosToast";
import Axios from "../utils/Axios";

const ForForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Log exactly what we're sending
      console.log("Sending data to backend:", {
        email: formData.email,
        password: "***", // Don't log actual password
        subscribeNewsletter: formData.subscribeNewsletter,
      });

      // Make the request step by step for better debugging
      const apiConfig = SummaryAPI.forgot;
      console.log("API Config:", apiConfig);

      const response = await Axios({
        method: apiConfig.method,
        url: apiConfig.url,
        data: {
          email: formData.email,
        },
      });
      navigate("/verifyotp");

      console.log("Full response:", response);
      console.log("Response data:", response.data);

      toast.success("OTP Sent!");
      
    } catch (error) {
      console.log("Full error object:", error);
      console.log("Error response:", error.response);
      console.log("Error data:", error.response?.data);
      console.log("Error status:", error.response?.status);

      if (error.response?.data) {
        const errorData = error.response.data;

        // Try to extract error message in different ways
        const errorMessage =
          errorData.message ||
          errorData.error ||
          (typeof errorData === "string" ? errorData : "Login failed");

        toast.error(errorMessage);
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };
  return (
    <div className=" bg-gradient-to-br w-full  flex items-center justify-center mt-20 mb-10 p-2">
      <div className="max-w-md w-full">
        {/* Header with shopping theme */}
        <div className="text-center ">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <ShoppingBag className="w-12 h-12 text-blue-600" />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 fill-current" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GOKART</h1>
          <p className="text-gray-600">Forgot Your Password For Login</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl mt-1 shadow-2xl p-6 sm:p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 hover:shadow-sm"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              <span className="relative z-10">Forgot Passwrod</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
            Don't have account?
            <Link to={"/register"} className="text-blue-500">
              {" "}
              Register
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForForgotPassword;
