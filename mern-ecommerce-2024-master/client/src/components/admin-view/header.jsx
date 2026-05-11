import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader() {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-end px-4 py-3 bg-background border-b gap-2">
      <Button
        onClick={handleLogout}
        className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow min-h-[44px]"
      >
        <LogOut className="size-4" />
        Logout
      </Button>
    </header>
  );
}

export default AdminHeader;
