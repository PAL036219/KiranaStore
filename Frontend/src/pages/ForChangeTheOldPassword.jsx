import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import SummaryAPI from "../common/SummaryApi";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ShoppingBag, Sparkles } from "lucide-react";
import Axios from "../utils/Axios";

const ForChangeTheOldPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from navigation state if available
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!formData.email || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    // Check password strength (at least 6 characters)
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    try {
      console.log("Sending data to backend:", {
        email: formData.email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      const apiConfig = SummaryAPI.resetPasswordAfterVerification;
      console.log("API Config:", apiConfig);

      const response = await Axios({
        method: apiConfig.method,
        url: apiConfig.url,
        data: {
          email: formData.email,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        },
      });

      console.log("Full response:", response);
      console.log("Response data:", response.data);

      // Show success message and navigate to login
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 1500);
      
    } catch (error) {
      console.log("Full error object:", error);
      console.log("Error response:", error.response);
      console.log("Error data:", error.response?.data);
      console.log("Error status:", error.response?.status);

      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessage =
          errorData.message ||
          errorData.error ||
          (typeof errorData === "string" ? errorData : "Password reset failed");

        toast.error(errorMessage);
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gradient-to-br w-full from-slate-50 mt-10 to-blue-100 flex items-center justify-center  mb-10 p-2">
      <div className="max-w-md w-full">
        {/* Header with shopping theme */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <ShoppingBag className="w-12 h-12 text-blue-600" />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 fill-current" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GOKART</h1>
          <p className="text-gray-600">Reset Your Password</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl mt-1 shadow-2xl p-6 sm:p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  readOnly // Typically email shouldn't be changed at this stage
                />
              </div>
            </div>
            
            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 hover:shadow-sm"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 hover:shadow-sm"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              <span className="relative z-10">Reset Password</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
            
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:text-blue-700 font-medium">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForChangeTheOldPassword;