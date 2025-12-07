import pureClient from ".";

if (typeof window.Telegram === "undefined") {
  window.Telegram = {
    WebApp: {
      expand: () => {},
      initDataUnsafe: {
        user: {
          id: "1802368420",
          auth_date: 1733282584,
          first_name: "",
          last_name: "Poghosyanp",
          username: "Poghos_kkk",
          language_code: "en",
          photo_url:
            "https://t.me/i/userpic/320/R6kP81fplPdhuT-LUfFQPEUXqqKPrvaTLmqSgpUeMfc.jpg",
          hash: "a2ab797fbc1d209a618725edb826dc0736dee5d2a120bcdd7ae6b7d88415ab18"
        }
      }
    }
  };
}

export const loginPostUserData = async (fullUserData) => {
  if (!fullUserData) {
    return;
  }

  try {
    const response = await pureClient.post("/auth/telegram", {
      initData: fullUserData
    });
    // const response = await pureClient.post("/auth/telegram", {
    //   id: fullUserData?.id,
    //   first_name: fullUserData?.first_name,
    //   last_name: fullUserData?.last_name || "",
    //   username: fullUserData?.username || "",
    //   language: fullUserData?.language_code,
    //   photo_url: fullUserData?.photo_url || "",
    //   hash: fullUserData?.hash || "",
    //   auth_date: fullUserData?.auth_date || ""
    // });

    return response;
  } catch (err) {
    console.error("Error sending user info:", err);
  }
};

export const homePageGetData = async ({ token }) => {
  try {
    const response = await pureClient.get(`/user`, {
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

export const homePageDailyCode = async (data, token) => {
  try {
    const response = await pureClient.put(
      `/user/daily-code`,
      { code: data.code },
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

export const homePageDailyPoint = async (token) => {
  try {
    const response = await pureClient.put(
      `/user/daily-claim`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching data from /telegram:", error);
    throw error;
  }
};
