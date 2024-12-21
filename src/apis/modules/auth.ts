import api from "../request";

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export function loginRequest(params: LoginParams) {
  return api.post(`auth/login`, params);
}

export function registerRequest(params: RegisterParams) {
  return api.post(`auth/register`, params);
}

export function logoutRequest() {
  return api.post(`auth/logout`);
}

export function getUserInfo() {
  return api.get(`user-info`);
}

export function verityEmail(email: string) {
  return api.post(`forgotPassword/verifyMail/${email}`);
}

export function verifyOtp(email: string, otp: number) {
  return api.post(`forgotPassword/verifyOtp/${otp}/${email}`);
}

export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export function changePassword(params: ResetPasswordRequest, email: string) {
  return api.put(`forgotPassword/changePassword/${email}`,params);
}
