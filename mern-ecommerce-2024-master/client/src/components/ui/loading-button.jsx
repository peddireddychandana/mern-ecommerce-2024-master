import { Button } from "./button";
import { Loader2 } from "lucide-react";

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}) {
  return (
    <Button
      disabled={disabled || loading}
      className={`${loading ? "opacity-70 cursor-not-allowed" : ""} ${className || ""}`}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText || children}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
