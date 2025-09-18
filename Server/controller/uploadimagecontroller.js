import uploadProfileImage from "../utils/uploadprofilecloudinary.js";

const UploadImageController = async (req, res) => {
  try {
    const file = req.file; // 👈 multer provides file here

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
      });
    }

    // send to cloudinary (file.buffer will have the raw bytes)
    const uploadImage = await uploadProfileImage(file);

    return res.status(200).json({
      message: "File uploaded successfully",
      url: uploadImage.secure_url,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "Error in UploadImageController",
      success: false,
      error: error.message,
    });
  }
};

export default UploadImageController;
