import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, Search } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import toast from "react-hot-toast";

function MenuItems({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleNavigate(menuItem) {
    sessionStorage.setItem("filters", JSON.stringify({}));
    sessionStorage.setItem("activeMenuItem", menuItem.id);
    navigate(menuItem.path);
    if (onNavigate) onNavigate();
  }

  function isActive(menuItem) {
    const saved = sessionStorage.getItem("activeMenuItem");
    if (saved === menuItem.id) return true;
    return location.pathname === menuItem.path;
  }

  return (
    <nav className="flex flex-col lg:flex-row gap-6 lg:items-center">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div key={menuItem.id} className="relative">
          <Label
            onClick={() => handleNavigate(menuItem)}
            className={`
              text-sm font-medium cursor-pointer
              transition-all duration-300
              hover:text-[#6B1E2E]
              hover:scale-105
              ${isActive(menuItem) ? "text-[#6B1E2E] font-semibold" : ""}
            `}
          >
            {menuItem.label}
          </Label>

          {isActive(menuItem) && (
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#6B1E2E] rounded-full transition-all duration-300"></span>
          )}
        </div>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logoutUser());
    toast.success("Logged out successfully");
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex items-center gap-4">

      {/* CART */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative min-h-[44px] min-w-[44px] transition-all duration-300 hover:scale-105"
            aria-label={`Shopping cart with ${cartItems?.items?.length || 0} items`}
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-[-5px] right-[2px] text-sm font-bold">
              {cartItems?.items?.length || 0}
            </span>
          </Button>
        </SheetTrigger>

        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      {/* PROFILE */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer min-h-[44px] min-w-[44px] transition-all duration-300 hover:scale-110">
            <AvatarFallback className="bg-black text-white font-bold text-base">
              {user?.userName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>{user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}

function ShoppingHeader() {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const closeMobileSidebar = () => setOpenMobileSidebar(false);

  function handleSearch(e) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/shop/search?keyword=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <header className="fixed top-0 z-50 w-full bg-white border-b shadow-sm animate-slideDown overflow-hidden">
      <div className="flex h-16 items-center gap-2 sm:gap-4 px-2 sm:px-4 md:px-6 max-w-full">

        {/* LOGO */}
        <Link
          to="/shop/home"
          className="flex items-center gap-1 sm:gap-2 shrink-0 transition-all duration-300 hover:opacity-80"
          onClick={closeMobileSidebar}
        >
          <HousePlug className="h-5 w-5 sm:h-6 sm:w-6 text-[#6B1E2E]" />
          <span className="font-bold tracking-wide text-xs sm:text-sm md:text-base truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
            SRI RAMAKRISHNA TEXTILES
          </span>
        </Link>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-9 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1E2E] focus:bg-white transition-colors"
            />
          </div>
        </form>

        {/* DESKTOP NAV */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* RIGHT: CART + PROFILE + MOBILE MENU */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile search icon */}
          <button
            onClick={() => navigate("/shop/search")}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          <HeaderRightContent />

          <Sheet open={openMobileSidebar} onOpenChange={setOpenMobileSidebar}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden min-h-[44px] min-w-[44px]"
                aria-label={openMobileSidebar ? "Close navigation menu" : "Open navigation menu"}
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[280px] sm:w-[350px] overflow-y-auto"
              aria-label="Navigation menu"
            >
              <div className="flex flex-col h-full py-6">
                <MenuItems onNavigate={closeMobileSidebar} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}

export default ShoppingHeader;