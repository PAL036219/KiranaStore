import React, { useState } from "react";
import toast from "react-hot-toast";
import UploadImage from "../../utils/imageupload";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryAPI from "../../common/SummaryAPI";
import AxiosToastError from "../../utils/AxiosToast";

const Category = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    image: "", // final uploaded URL
  });

  const [file, setFile] = useState(null); // selected file
  const [previewImage, setPreviewImage] = useState(""); // local preview
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false); // Track if image is uploaded
 
  // handle category name input
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // select file and show preview
  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewImage(URL.createObjectURL(selected));
    setImageUploaded(false); // Reset uploaded status when new file is selected
  };

  // upload file to Cloudinary
  const handleUploadCategoryImage = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    try {
      const uploadResponse = await UploadImage(file);
      console.log("Cloudinary response:", uploadResponse);

      if (uploadResponse && uploadResponse.data && uploadResponse.data.url) {
        setData((prev) => ({ ...prev, image: uploadResponse.data.url }));
        setImageUploaded(true);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Image upload failed - no URL returned");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting data:", data);

    if (!data.image) {
      toast.error("Please upload the image first");
      return;
    }

    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryAPI.addcategoty,
        data,
      });
      toast.success(response?.data?.message || "Category saved!");
     // redirect after save
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add New Category
        </h3>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Category Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              placeholder="Enter category name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Image
            </label>

            <div className="flex flex-col items-center space-y-4">
              {/* File input */}
              <div className="w-full">
                <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50 transition-colors">
                  <svg
                    className="w-8 h-8 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <span className="text-sm font-medium">Select an image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preview and Upload Button */}
              {previewImage && (
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>

                  {!imageUploaded ? (
                    <button
                      type="button"
                      onClick={handleUploadCategoryImage}
                      disabled={uploading}
                      className={`px-4 py-2 rounded-lg text-white font-medium ${
                        uploading
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {uploading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Uploading...
                        </span>
                      ) : (
                        "Upload Image"
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Image Uploaded Successfully</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!data.name || !data.image || loading}
            className={`w-full py-3 px-4 rounded-lg shadow-md font-medium transition-colors ${
              !data.name || !data.image || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Category"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Category;
