import type { ReactNode } from "react";

export type TSidebar = {
  key: string;
  label: ReactNode;
  children?: TSidebar[];
};

export type TRoute = {
  path: string;
  element: ReactNode;
};

export type TUserPaths = {
  name: string;
  path?: string;
  element?: ReactNode;
  children?: TUserPaths[];
};

export type TJwtPayload = {
  userId: string;
  role: "student" | "admin";
  iat?: number;
  exp?: number;
};

export type TProfileForm = {
  name: string;
  email: string;
  avatar?: string;
};

export type TChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type TMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};
export type TSingleMessage = {
  text: string;
};

export type TUser = {
  // _id: Types.ObjectId;
  userId?: string;
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  role?: "student" | "admin";
};

export type TLanguage = "বাংলা" | "EN";
