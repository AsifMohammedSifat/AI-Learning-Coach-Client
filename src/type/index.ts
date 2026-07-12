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
    name: string,
    path?: string,
    element?: ReactNode,
    children?: TUserPaths[]
}

export type TJwtPayload = {
  userId: string;
  role: "student" | "faculty" | "admin";
  iat: number;
  exp: number;
};