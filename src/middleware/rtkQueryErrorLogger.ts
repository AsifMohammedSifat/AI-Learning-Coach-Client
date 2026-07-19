import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import { Modal } from "antd";

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const message =
      (action.payload as any)?.data?.message ||
      (action.payload as any)?.error ||
      "কিছু একটা সমস্যা হয়েছে😢";

    Modal.error({
      title: "Error",
      content: message,
      centered: true,
    });
  }
  return next(action);
};