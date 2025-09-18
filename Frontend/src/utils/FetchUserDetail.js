import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
const fetchUserDetail = async () => {
    try {
        const response = await Axios({
    ...SummaryAPI.getuserdetails,
    
  });
  return response

        
    } catch (error) {
        message : "coming from the fetchpages"
        
    }
  
};
export default fetchUserDetail;
