import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
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

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [active, setActive] = useState("home");

  function handleNavigate(menuItem) {
    setActive(menuItem.id);
    sessionStorage.setItem("filters", JSON.stringify({}));
    navigate(menuItem.path);
  }

  return (
    <nav className="flex flex-col lg:flex-row gap-6 lg:items-center">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div key={menuItem.id} className="relative">
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="
              text-sm font-medium cursor-pointer
              transition-all duration-300
              hover:text-[#6B1E2E]
              hover:scale-105
            "
          >
            {menuItem.label}
          </Label>

          {active === menuItem.id && (
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
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex items-center gap-4">

      {/* CART */}
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative min-h-[44px] min-w-[44px] transition-all duration-300 hover:scale-105"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] text-sm font-bold">
            {cartItems?.items?.length || 0}
          </span>
        </Button>

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
  return (
    <header className="fixed top-0 z-50 w-full bg-white border-b shadow-sm animate-slideDown overflow-hidden">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-full">

        {/* LOGO */}
        <Link
          to="/shop/home"
          className="flex items-center gap-2 transition-all duration-300 hover:opacity-80"
        >
          <HousePlug className="h-6 w-6 text-[#6B1E2E]" />
          <span className="font-bold tracking-wide text-sm sm:text-base truncate max-w-[180px] sm:max-w-none">
            SRI RAMAKRISHNA TEXTILES
          </span>
        </Link>

        {/* MOBILE */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden min-h-[44px] min-w-[44px]">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-[280px] sm:w-[350px] overflow-y-auto">
            <div className="flex flex-col h-full py-6">
              <MenuItems />
              <div className="mt-8 border-t pt-6">
                <HeaderRightContent />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* DESKTOP */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>

      </div>
    </header>
  );
}

export default ShoppingHeader;