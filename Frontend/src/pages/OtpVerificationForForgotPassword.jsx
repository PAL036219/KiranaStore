import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SummaryAPI from "../common/SummaryAPI";
import { Mail, ShoppingBag, Sparkles } from "lucide-react";
import Axios from "../utils/Axios";

const OtpVerificationForForgotPassword = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  console.log("location", location);

  // Get email from navigation state if available
  useEffect(() => {
    if (location.state?.email) {
      setFormData((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields are filled
    if (!formData.email) {
      toast.error("Email is required");
      setIsLoading(false);
      return;
    }

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending data to backend:", {
        email: formData.email,
        otp: otpValue,
      });

      const apiConfig = SummaryAPI.verifyOptForForgotPassword;
      console.log("API Config:", apiConfig);

      const response = await Axios({
        method: apiConfig.method,
        url: apiConfig.url,
        data: {
          email: formData.email,
          otp: otpValue,
        },
      });

      console.log("Full response:", response);
      console.log("Response data:", response.data);

      // Check for success in different possible response formats
      const isSuccess = 
        response.data.success === true ||
        response.data.status === "success" ||
        response.data.message?.toLowerCase().includes("success") ||
        response.status === 200;

      if (isSuccess) {
        toast.success("OTP verified successfully!");
        
        navigate("/resetpassword", {
          state: { email: formData.email },
        });
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.log("Full error object:", error);
      
      // More detailed error handling
      if (error.response) {
        console.log("Error response:", error.response);
        console.log("Error data:", error.response.data);
        console.log("Error status:", error.response.status);
        
        const errorData = error.response.data;
        const errorMessage =
          errorData.message ||
          errorData.error ||
          (typeof errorData === "string" ? errorData : "Wrong OTP. Please try again.");
        
        toast.error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("Error request:", error.request);
        toast.error("Network error. Please check your connection and try again.");
      } else {
        // Something happened in setting up the request
        console.log("Error message:", error.message);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = () => {
    toast.success("Get the New Otp");
    navigate("/forgotpassword");
  };

  return (
    <div className="bg-gradient-to-br w-full from-slate-50 to-blue-100 flex items-center justify-center mt-10 mb-10 p-2">
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
          <p className="text-gray-600">Verify OTP to reset your password</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl mt-1 shadow-2xl p-6 sm:p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
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

            {/* OTP Input */}
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                OTP
              </label>

              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold 
                      border border-gray-300 rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                      transition-all duration-200 hover:border-blue-400 shadow-sm"
                  />
                ))}
              </div>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={resendOtp}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Resend OTP
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Validate OTP"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationForForgotPassword;