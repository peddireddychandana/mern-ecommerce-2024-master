import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";

function AdminLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* admin sidebar (mobile: top nav strip, desktop: left sidebar) */}
      <AdminSideBar />
      <div className="flex flex-1 flex-col min-w-0">
        {/* admin header */}
        <AdminHeader />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
