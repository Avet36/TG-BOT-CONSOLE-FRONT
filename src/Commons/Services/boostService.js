import pureClient from ".";

export const boostData = async (token) => {
  try {
    const response = await pureClient.post(`/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data from /boost:", error);
  }
};

export const boostClaim = async ({ id, token }) => {
  try {
    const response = await pureClient.post(
      `/user/buy/boost`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data from /boost:", error);
  }
};

export const freeBoostEndedService = async ({ id, token }) => {
  try {
    const response = await pureClient.put(
      `/user/boost/deactivate
      `,
      { id },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data from /user/daily-code:", error);
    throw error;
  }
};

export const postPaymentDataBocBoost = async ({ data, token }) => {
  try {
    const response = await pureClient.post(`/user/buy/boost`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data from /boost:", error);
  }
};
