import axios from "axios";

export const baseURL = 'http://13.60.252.62/api/v1/';

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 20000,
});

export default axiosInstance;