import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="size-5 lg:size-6" />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket className="size-5 lg:size-6" />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck className="size-5 lg:size-6" />,
  },
];

function AdminSideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/admin/dashboard") return location.pathname === "/admin/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* MOBILE: horizontal icon nav at top */}
      <nav className="flex lg:hidden items-center justify-around border-b bg-background px-2 py-1 sticky top-0 z-40" aria-label="Admin navigation mobile">
        {adminSidebarMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-md min-h-[44px] min-w-[60px] transition-colors ${
              isActive(item.path)
                ? "text-primary bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            aria-current={isActive(item.path) ? "page" : undefined}
          >
            {item.icon}
            <span className="text-[10px] leading-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* DESKTOP: full sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-background p-6" aria-label="Admin sidebar">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2 mb-8"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") navigate("/admin/dashboard"); }}
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <nav className="flex-col flex gap-2">
          {adminSidebarMenuItems.map((menuItem) => (
            <div
              key={menuItem.id}
              onClick={() => navigate(menuItem.path)}
              className={`flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 min-h-[44px] transition-colors ${
                isActive(menuItem.path)
                  ? "bg-muted text-foreground font-semibold border-l-4 border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              role="button"
              tabIndex={0}
              aria-current={isActive(menuItem.path) ? "page" : undefined}
              onKeyDown={(e) => { if (e.key === "Enter") navigate(menuItem.path); }}
            >
              {menuItem.icon}
              <span>{menuItem.label}</span>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default AdminSideBar;
