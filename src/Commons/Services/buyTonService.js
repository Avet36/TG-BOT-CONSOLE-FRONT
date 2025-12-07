import pureClient from ".";

export const buyTon = async (data, token) => {
  try {
    const response = await pureClient.post(`/buyton`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data from /boost:", error);
  }
};

export const connectTonWallet = async (data, token) => {
  try {
    const response = await pureClient.post(`/topnwallet`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data from /boost:", error);
  }
};
