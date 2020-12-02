import { getListingModel } from "../../Model/Listing/listingModel";
import ErrorMessage from "../../Context/MessageContext";

const getListing = async (pageNum, limit) => {
  try {
    const res = await getListingModel(pageNum, limit);
    // Do all the data manipulation here
    return { success: true, data: res.data };
  } catch (e) {
    console.error(e);
    return { success: false, message: e.message };
  }
};

export default getListing;
