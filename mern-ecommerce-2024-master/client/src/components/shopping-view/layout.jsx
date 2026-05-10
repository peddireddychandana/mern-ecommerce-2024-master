import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      <ShoppingHeader />
      <main className="flex flex-col w-full min-h-screen pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ShoppingLayout;
