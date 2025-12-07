import pureClient from ".";
import { toast } from "react-toastify";
import friendSuccessIconCopy from "../../Assets/Friends/friend-success-copy.svg";

export const upgradeServicePost = async ({ obj, token }) => {
  try {
    const response = await pureClient.post("user/buy/upgrade", obj, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response) {
      toast.success(
        <div className="friendsSuccessDiv">
          <p className="friendSuccess">Success</p>
          <p className="friendSuccessText"></p>
          {/* need add text  */}
        </div>,
        {
          icon: <img src={friendSuccessIconCopy} alt="friendSuccessIcon" />,
          closeButton: false,
          autoClose: 1500
        }
      ); //need to change
    }
    return response;
  } catch (err) {
    const message = err?.response?.data?.msg || "An unexpected error occurred";
    toast.error(message);
    console.error("Error", err);
  }
};

export const boostServicePost = async ({ obj, token }) => {
  try {
    const response = await pureClient.post("user/buy/boost", obj, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response;
  } catch (err) {
    const message = err?.response?.data?.msg || "An unexpected error occurred";
    toast.error(message);
    console.error("Error", err);
  }
};

export const postPaymentDataBocUpgrade = async ({ dataPayment, token }) => {
  try {
    const response = await pureClient.post(`/user/buy/upgrade`, dataPayment, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data from /upgrade:", error);
  }
};
