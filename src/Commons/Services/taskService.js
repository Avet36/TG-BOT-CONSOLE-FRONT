import pureClient from ".";
import { toast } from "react-toastify";

export const getTasks = async (token) => {
  try {
    const response = await pureClient.get(`/projects/user-tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data from /boost:", error);
  }
};

export const startTask = async (data) => {
  try {
    const response = await pureClient.put(
      `/projects/user-tasks`,
      {
        taskId: data?.id,
        status: data?.status
      },
      {
        headers: {
          Authorization: `Bearer ${data?.token}`
        }
      }
    );
    return response.data;
  } catch (err) {
    const msg = err?.response?.data?.msg || "Claim failed!";
    toast.error(msg);
    console.error("Error fetching data from /boost:", err);
  }
};
