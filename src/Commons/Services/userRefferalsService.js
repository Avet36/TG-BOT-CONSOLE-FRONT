import pureClient from ".";
import { toast } from "react-toastify";

export const getRefferals = async ({ token }) => {
  try {
    const response = await pureClient.get(`/user/referrals`, {
      //here need add path
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching data from /user:",
      error.response || error.message
    );
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
};

export const postPaymentDataBocBot = async ({ dataPayment, token }) => {
  try {
    const response = await pureClient.post(`/user/buy/bot`, dataPayment, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data from /bot:", error);
  }
};
