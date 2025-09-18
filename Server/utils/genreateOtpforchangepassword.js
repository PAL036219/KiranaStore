const genreateOtpForChangePassword = () => {
  try {
    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000) + 10000; // 6-digit OTP

    // Save the OTP to the database or send it via email/SMS
    // This part is not implemented here, but you can use your existing logic

    return otp; // Return the generated OTP
  } catch (error) {
    throw new Error("Error generating OTP: " + error.message);
  }
}
export default genreateOtpForChangePassword;