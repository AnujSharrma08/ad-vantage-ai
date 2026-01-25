import axios from "axios";

export const baseURL = 'http://13.60.80.190/api/v1/';

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 20000,
});

export default axiosInstance;