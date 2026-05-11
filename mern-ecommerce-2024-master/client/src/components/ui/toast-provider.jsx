import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1f2937",
          color: "#f9fafb",
          fontSize: "14px",
          borderRadius: "8px",
        },
        success: {
          style: { background: "#065f46", color: "#f0fdf4" },
        },
        error: {
          style: { background: "#991b1b", color: "#fef2f2" },
        },
      }}
    />
  );
}
