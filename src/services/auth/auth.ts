import { loginPayload, OtpPayload, signUpPayload } from "@/src/types/auth-type";
import axiosInstance from "../config";
import { APIKEY } from "../api-key";
import { errorHandler } from "@/src/utils/error-handler";

export const login = async (loginData: loginPayload) => {
  try {
    const res = await axiosInstance.post(`${APIKEY.login}`, loginData);
    return res.data;
  } catch (err) {
    throw errorHandler(err, "login");
  }
};

export const verifyOtp = async (otpData: OtpPayload) => {
  try {
    const res = await axiosInstance.post(`${APIKEY.verifyOtp}`, otpData);
    return res.data;
  } catch (err) {
    throw errorHandler(err, "verifyOtp");
  }
};

export const signUp = async (signUpData: signUpPayload) => {
  try {
    const res = await axiosInstance.post(`${APIKEY.signUp}`, signUpData);
    return res.data;
  } catch (err) {
    throw errorHandler(err, "signUp");
  }
};

export const fetchProfile = async (userId: number) => {
  try {
    const res = await axiosInstance.get(`${APIKEY.profile}/${userId}`);
    return res.data;
  } catch (err) {
    throw errorHandler(err, "fetchProfile");
  }
};