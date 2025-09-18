import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import SummaryAPI from "../common/SummaryAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setuserdetail } from "../reduxstore/userSlice"; // adjust path if needed


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
import fetchUserDetail from "../utils/FetchUserDetail";

const LoginPageForRegisterUser = () => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animations after component mounts
    setAnimateElements(true);
  }, []);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Log exactly what we're sending
      console.log("Sending data to backend:", {
        email: formData.email,
        password: "***", // Don't log actual password
        subscribeNewsletter: formData.subscribeNewsletter,
      });

      // Make the request step by step for better debugging
      const apiConfig = SummaryAPI.login;
      console.log("API Config:", apiConfig);

      const response = await Axios({
        method: apiConfig.method,
        url: apiConfig.url,
        data: {
          email: formData.email,
          password: formData.password,
          subscribeNewsletter: formData.subscribeNewsletter,
        },
      });

      console.log("Full response:", response);
      console.log("Response data:", response.data);
      //for save token
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refrenceToken", response.data.data.refrenceToken);

      const userDetail = await fetchUserDetail()
      dispatch(setuserdetail(userDetail.data))

      //from redux
       const userData = response.data.data.user; 
    console.log("User Data from backend:", userData);

    // ✅ Save to Redux
    dispatch(setuserdetail(response.data));


    
    

      toast.success("Login successful! 🥰 " );
      navigate("/");
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
          (typeof errorData === "string" ? errorData : "Registration failed");

        toast.error(errorMessage);
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen md:mt-10 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: `linear-gradient(45deg, ${i % 2 === 0 ? '#3b82f6' : '#8b5cf6'}, ${i % 2 === 0 ? '#8b5cf6' : '#3b82f6'})`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header with enhanced animation */}
        <div className="text-center mb-8 transform transition-all duration-1000 ease-out" style={{ 
          opacity: animateElements ? 1 : 0, 
          transform: animateElements ? 'translateY(0)' : 'translateY(-20px)' 
        }}>
          <div className="flex justify-center mb-4 relative">
            <div className="relative animate-bounce-slow">
              <ShoppingBag className="w-12 h-12 text-blue-600" />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 fill-current animate-pulse" />
            </div>
            <div className="absolute -inset-4 bg-blue-100 rounded-full opacity-0 animate-ping-slow" style={{ animationDelay: '1s' }}></div>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2 animate-gradient">
            GOKART
          </h1>
          <p className="text-gray-600 font-medium">Get Your Groceries In Best Price</p>
        </div>

        {/* Card with enhanced animations */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100 transform transition-all duration-700 ease-out" style={{ 
          opacity: animateElements ? 1 : 0, 
          transform: animateElements ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)' 
        }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="transform transition-all duration-500 ease-out delay-100" style={{ 
              opacity: animateElements ? 1 : 0, 
              transform: animateElements ? 'translateX(0)' : 'translateX(-20px)' 
            }}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {/* Email Address */}
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg transform group-hover:scale-105 transition-all duration-200 opacity-0 group-hover:opacity-100 -z-10"></div>
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-200 group-focus-within:text-blue-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 hover:shadow-sm bg-transparent"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="transform transition-all duration-500 ease-out delay-200" style={{ 
              opacity: animateElements ? 1 : 0, 
              transform: animateElements ? 'translateX(0)' : 'translateX(-20px)' 
            }}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {/* Password */}
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg transform group-hover:scale-105 transition-all duration-200 opacity-0 group-hover:opacity-100 -z-10"></div>
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-200 group-focus-within:text-blue-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 hover:shadow-sm bg-transparent"
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

            {/* Checkboxes */}
            <div className="space-y-3 transform transition-all duration-500 ease-out delay-300" style={{ 
              opacity: animateElements ? 1 : 0, 
              transform: animateElements ? 'translateX(0)' : 'translateX(-20px)' 
            }}>
              <div className="flex items-center group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200 hover:border-blue-400 checked:scale-110"
                    required
                  />
                  <div className="absolute inset-0 bg-blue-100 rounded opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-200"></div>
                </div>
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                  >
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              <div className="flex items-center group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="subscribeNewsletter"
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200 hover:border-blue-400 checked:scale-110"
                  />
                  <div className="absolute inset-0 bg-blue-100 rounded opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-200"></div>
                </div>
                <label
                  htmlFor="subscribeNewsletter"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Subscribe to our newsletter for exclusive offers
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="transform transition-all duration-500 ease-out delay-400" style={{ 
              opacity: animateElements ? 1 : 0, 
              transform: animateElements ? 'translateY(0)' : 'translateY(20px)' 
            }}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl relative overflow-hidden group disabled:opacity-85 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Login"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-20 group-hover:animate-shimmer"></div>
              </button>
            </div>
          </form>
          
          {/* Forgot Password Link */}
          <div className="mt-4 text-center transform transition-all duration-500 ease-out delay-500" style={{ 
            opacity: animateElements ? 1 : 0, 
            transform: animateElements ? 'translateY(0)' : 'translateY(20px)' 
          }}>
            <Link 
              to="/forgotpassword" 
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium text-sm inline-flex items-center hover:underline"
            >
              Forgot password?
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
           <div className="mt-4 text-center transform transition-all duration-500 ease-out delay-500" style={{ 
            opacity: animateElements ? 1 : 0, 
            transform: animateElements ? 'translateY(0)' : 'translateY(20px)' 
          }}>
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium text-sm inline-flex items-center hover:underline"
            >
              Don't have an account?
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
        
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPageForRegisterUser;