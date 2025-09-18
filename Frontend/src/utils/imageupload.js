import toast from "react-hot-toast";
import Axios from "./Axios";
import SummaryAPI from "../common/SummaryAPI";

const UploadImage = async (image) => {
  try {
    console.log("Uploading to:", SummaryAPI.uploadimage.url);
console.log("Method:", SummaryAPI.uploadimage.method);
console.log("File:", image);
    const formData = new FormData();
    formData.append("image",image);
    const response = await Axios({
      ...SummaryAPI.uploadimage,
      data: formData
    });
    return response
  } catch (error) {
    toast.error("error coming  image not uploaded");
  }
};

export default UploadImage;
