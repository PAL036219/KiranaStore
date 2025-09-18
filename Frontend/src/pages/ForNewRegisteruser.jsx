import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
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

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address : "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate()

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    toast.error("Please enter the same password in both fields");
    return;
  }
  
  try {
    // Log exactly what we're sending
    console.log("Sending data to backend:", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address : formData.address,
      password: "***", // Don't log actual password
      subscribeNewsletter: formData.subscribeNewsletter
    });
    
    // Make the request step by step for better debugging
    const apiConfig = SummaryAPI.register;
    console.log("API Config:", apiConfig);
    
    const response = await Axios({
      method: apiConfig.method,
      url: apiConfig.url,
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address : formData.address,
        password: formData.password,
        subscribeNewsletter: formData.subscribeNewsletter
      }
    });
    
    console.log("Full response:", response);
    console.log("Response data:", response.data);
    
    toast.success("Registration successful!");
    navigate("/login")
    
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
        (typeof errorData === 'string' ? errorData : "Registration failed");
      
      toast.error(errorMessage);
    } else {
      toast.error("Network error. Please try again.");
    }
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br w-full from-slate-50 to-blue-100 flex items-center justify-center md:mt-10 p-4">
      <div className="max-w-md w-full">
        {/* Header with shopping theme */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <ShoppingBag className="w-12 h-12 text-blue-600" />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 fill-current" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GOKART</h1>
          <p className="text-gray-600">Get Your Groceries In Best Price</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="firstName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 hover:shadow-sm"
                  placeholder="John"
                  required
                />
              </div>
            </div>

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

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 hover:shadow-sm"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="Address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 hover:shadow-sm"
                  placeholder="Addess"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 hover:shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 hover:shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200 hover:border-blue-400"
                  required
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="subscribeNewsletter"
                  name="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200 hover:border-blue-400"
                />
                <label
                  htmlFor="subscribeNewsletter"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Subscribe to our newsletter for exclusive offers
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              <span className="relative z-10">
                Create Account & Start Shopping
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2 text-sm">
                ✨ New Member Benefits:
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 15% off your first order</li>
                <li>• Free shipping on orders over 100</li>
                <li>• Early access to sales</li>
                <li>• Personalized recommendations</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
