import axios from "axios";
const getBaseURL = () =>
  process.env.REACT_APP_URL || "https://api.console-pro.com";

const pureClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 5000
});

export default pureClient;
