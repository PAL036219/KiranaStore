import React, { useState, useRef } from "react";
import { FaCamera, FaTimes, FaUpload, FaUser } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Uploadavatar } from "../reduxstore/userSlice"; // adjust path
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import EditUserDetail from "./EditUserDetail";

const ChangeProfileImage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.avatar || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleImageChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(user.avatar || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", selectedImage);
      formData.append("userId", user._id);

      const token = localStorage.getItem("accessToken");

      const response = await Axios({
        method: SummaryAPI.Uploadavatar.method,
        url: SummaryAPI.Uploadavatar.url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(
          Uploadavatar(response.data.avatar || response.data.data.avatar)
        );
        toast.success("Profile image updated successfully!");
        setSelectedImage(null);
        setPreviewUrl(
          response.data.avatar ||
            (response.data.data && response.data.data.avatar)
        );
      } else {
        toast.error(response.data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col lg:flex-row items-start justify-center gap-6 p-4 md:mt-10">
      {/* Profile Image Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md  mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Change Profile Image
        </h2>

        {/* Image Preview */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-4xl sm:text-5xl text-gray-400" />
              )}
            </div>
            {previewUrl && previewUrl !== user.avatar && (
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition"
              >
                <FaTimes className="text-sm" />
              </button>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition mb-6 ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FaCamera className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="font-medium text-gray-700">
                {previewUrl && previewUrl !== user.avatar
                  ? "Change profile photo"
                  : "Upload profile photo"}
              </p>
              <p className="text-sm text-gray-500">
                Drag & drop or{" "}
                <span className="text-blue-500">browse files</span>
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, GIF (Max 5MB)</p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition flex-1"
          >
            <FaUpload className="text-sm" />
            Choose Image
          </button>
          <button
            onClick={handleSaveImage}
            disabled={!selectedImage || isLoading}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition flex-1 ${
              selectedImage && !isLoading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {/* Remove Selected Option */}
        {selectedImage && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={handleRemoveImage}
              className="flex items-center justify-center gap-2 text-red-500 hover:text-red-700 mx-auto transition"
            >
              <MdDelete />
              Remove Selected Image
            </button>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-6">
          For best results, use a square image at least 200x200 pixels.
        </p>
      </div>

      {/* Edit User Details */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto  p-6">
        <EditUserDetail />
      </div>
    </div>
  );
};

export default ChangeProfileImage;
