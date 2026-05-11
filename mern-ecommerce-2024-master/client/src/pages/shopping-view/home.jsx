import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShirtIcon,
  CloudLightning,
  BabyIcon,
  SparklesIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";

import ShoppingProductTile from "@/components/shopping-view/product-tile";
import Testimonials from "@/components/shopping-view/testimonials";
import BestSellers from "@/components/shopping-view/best-sellers";
import { useNavigate } from "react-router-dom";

import {
  addToCart,
  fetchCartItems,
} from "@/store/shop/cart-slice";

import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

import bannerOne from "../../assets/pexels2.jpg";
import bannerTwo from "../../assets/yellow.jpg";
import bannerThree from "../../assets/pexels4.jpg";

import { motion } from "framer-motion";

/* -------------------- ANIMATION WRAPPER -------------------- */
const FadeUp = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

/* -------------------- CATEGORY DATA -------------------- */
const categoriesWithIcon = [
  { id: "women-sarees", label: "Sarees", icon: SparklesIcon },
  { id: "men-shirts", label: "Shirts", icon: ShirtIcon },
  { id: "women-kurtis", label: "Kurtis", icon: CloudLightning },
  { id: "kids-shorts", label: "Shorts", icon: BabyIcon },
];

function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const productsRef = useRef(null);

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const { user } = useSelector((state) => state.auth);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  const images = [
    { image: bannerOne },
    { image: bannerTwo },
    { image: bannerThree },
  ];

  /* -------------------- AUTO SLIDER -------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  function goToSlide(index) {
    setCurrentSlide(index);
  }

  function prevSlide() {
    setCurrentSlide((p) => (p === 0 ? images.length - 1 : p - 1));
  }

  function nextSlide() {
    setCurrentSlide((p) => (p === images.length - 1 ? 0 : p + 1));
  }

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  /* -------------------- PRODUCT DETAILS -------------------- */
  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  function handleNavigateToListingPage(item, section) {
    sessionStorage.setItem(
      "filters",
      JSON.stringify({ [section]: [item.id] })
    );

    navigate("/shop/listing");
  }

  function handleGetProductDetails(id) {
    dispatch(fetchProductDetails(id));
  }

  const { cartItems } = useSelector((state) => state.shopCart);

  function handleAddtoCart(productId) {
    if (cartLoading) return;
    setCartLoading(true);
    return dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Added to cart" });
      }
    }).finally(() => setCartLoading(false));
  }

  function handleBuyNow(productId) {
    if (buyLoading) return;
    setBuyLoading(true);
    return dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        navigate("/shop/checkout");
      }
    }).finally(() => setBuyLoading(false));
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ---------------- HERO CAROUSEL ---------------- */}
      <div className="relative w-full h-[50vh] sm:h-[70vh] lg:h-screen overflow-hidden bg-black">

        {images.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt="banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl px-6 sm:pl-10 md:pl-20 lg:pl-32 text-white">
                <p className="uppercase tracking-[3px] sm:tracking-[6px] text-xs md:text-sm text-yellow-300 font-light mb-4">
                  Premium Fashion Collection
                </p>
                <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extralight leading-[1.05]">
                  Discover Your
                  <span className="block text-yellow-400 font-semibold italic">Perfect Style</span>
                </h1>
                <div className="h-[2px] bg-yellow-400 my-6 w-24" />
                <p className="text-gray-200 text-xs sm:text-sm md:text-base max-w-md leading-relaxed mb-8">
                  Curated fashion pieces designed to elevate your everyday look with elegance and confidence.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Button
                    onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })}
                    className="bg-yellow-400 text-black px-6 sm:px-8 py-4 sm:py-6 rounded-full font-medium hover:scale-105 transition text-sm sm:text-base"
                  >
                    Shop Now
                  </Button>
                  <Button
                    onClick={() => navigate("/shop/listing")}
                    variant="outline"
                    className="border-white text-black px-6 sm:px-8 py-4 sm:py-6 rounded-full hover:bg-white hover:text-black transition text-sm sm:text-base"
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ARROWS */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 text-white" />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "bg-yellow-400 scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ---------------- CATEGORY ---------------- */}
      <FadeUp>
        <section className="py-10 sm:py-14 bg-gray-50">
          <div className="container mx-auto px-4">

            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
              Shop by Category
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {categoriesWithIcon.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-xl transition"
                    onClick={() =>
                      handleNavigateToListingPage(item, "category")
                    }
                  >
                    <CardContent className="flex flex-col items-center p-8">
                      <item.icon className="w-12 h-12 mb-3" />
                      <span>{item.label}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

            </div>
          </div>
        </section>
      </FadeUp>

      {/* ---------------- PRODUCTS ---------------- */}
      <FadeUp>
        <section ref={productsRef} className="py-10 sm:py-14">
          <div className="container mx-auto px-4">

            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
              Featured Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {productList?.map((product) => (
                <motion.div key={product._id} whileHover={{ scale: 1.03 }}>
                  <ShoppingProductTile
                    product={product}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddtoCart={handleAddtoCart}
                    handleBuyNow={handleBuyNow}
                  />
                </motion.div>
              ))}

            </div>
          </div>
        </section>
      </FadeUp>

      {/* ---------------- EXTRA SECTIONS ---------------- */}
      <FadeUp>
        <BestSellers />
      </FadeUp>

      <FadeUp delay={0.1}>
        <Testimonials />
      </FadeUp>

      {/* ---------------- PRODUCT DIALOG ---------------- */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;