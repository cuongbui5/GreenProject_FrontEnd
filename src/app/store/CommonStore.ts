import { create } from "zustand";

interface CommonState {
  emailForgotPassword: string;
  setEmailForgotPassword: (email: string) => void;
}

export const useCommonStore = create<CommonState>((set) => ({
  emailForgotPassword: "",
  setEmailForgotPassword: (email: string) =>
    set(() => ({
      emailForgotPassword: email,
    })),
}));
