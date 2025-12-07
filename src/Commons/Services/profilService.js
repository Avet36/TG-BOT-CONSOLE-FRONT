import pureClient from ".";

export const getProfileData = async ({ token }) => {
  try {
    const response = await pureClient.get(`/user/profile`, {
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

export const postWalletInfo = async (walletData, token) => {
  try {
    const response = await pureClient.post(`/user/wallet`, walletData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error posting data to /user/wallet:", error);
    throw error;
  }
};

export const deleteWalletInfo = async (token) => {
  try {
    const response = await pureClient.delete(`/user/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting wallet from /user/wallet:", error);
    throw error;
  }
};
