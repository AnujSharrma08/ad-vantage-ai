import axios from "axios";

// export const baseURL = 'http://13.53.130.236/api/v1/';
export const baseURL = ' https://starting-insertion-reviewer-coverage.trycloudflare.com/api/v1/';

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 20000,
});

export default axiosInstance;