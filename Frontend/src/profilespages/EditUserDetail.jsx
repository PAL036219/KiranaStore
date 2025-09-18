import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryApi";
import { setuserdetail, Uploadavatar } from "../reduxstore/userSlice"; // or create updateUser action
import fetchUserDetail from "../utils/FetchUserDetail";
import { useNavigate } from "react-router-dom";

const EditUserDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    confirmPassword: "",
    address: user?.address || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");

      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const response = await Axios({
        method: "put", // ✅ Use PUT/PATCH instead of Uploadavatar API
        url: SummaryAPI.updatedetails.url, // <-- define this in your SummaryApi
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log(response);

      if (response.data.success) {
        toast.error("Profile updated successfully");

        // fetch updated user detail
        const userDetail = await fetchUserDetail();

        // make sure you pass the right data
        dispatch(setuserdetail(userDetail?.data));

        console.log("Updated user detail:", userDetail?.data);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
      navigate("/");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Unable to update your details!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Edit Profile
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            required
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            required
          />
        </div>

        {/* New Password */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            placeholder="Leave blank to keep current"
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            required
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() =>
            setFormData({
              name: user?.name || "",
              email: user?.email || "",
              phone: user?.phone || "",
              password: "",
              confirmPassword: "",
              address: user?.address || "",
            })
          }
          className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditUserDetail;
