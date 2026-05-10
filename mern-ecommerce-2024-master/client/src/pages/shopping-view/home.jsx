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
import { getFeatureImages } from "@/store/common-slice";

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

  const { featureImageList } = useSelector(
    (state) => state.commonFeature
  );

  const { user } = useSelector((state) => state.auth);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const fallbackImages = [
    { image: bannerOne },
    { image: bannerTwo },
    { image: bannerThree },
  ];

  const validApiImages =
    featureImageList?.filter((item) => item.image) || [];

  const images =
    validApiImages.length > 0 ? validApiImages : fallbackImages;

  /* -------------------- AUTO SLIDER -------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    dispatch(getFeatureImages());

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

  function handleAddtoCart(productId) {
    dispatch(
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
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ---------------- HERO SECTION ---------------- */}
      <div className="relative w-full h-[50vh] sm:h-[70vh] lg:h-screen overflow-hidden bg-black">

        {images.map((slide, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0"
            }`}
            animate={{ scale: index === currentSlide ? 1.05 : 1 }}
            transition={{ duration: 1 }}
          >
            <img
              src={slide.image}
              alt="banner"
              className="w-full h-full object-cover"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/50" />

            {/* HERO CONTENT */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl pl-10 md:pl-20 lg:pl-32 text-white">

                {/* TAGLINE */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="uppercase tracking-[3px] sm:tracking-[6px] text-xs md:text-sm text-yellow-300 font-light mb-4"
                >
                  Premium Fashion Collection
                </motion.p>

                {/* TITLE */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-extralight leading-[1.05]"
                >
                  Discover Your
                  <span className="block text-yellow-400 font-semibold italic">
                    Perfect Style
                  </span>
                </motion.h1>

                {/* LINE */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 96 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-[2px] bg-yellow-400 my-6"
                />

                {/* DESCRIPTION */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-gray-200 text-sm md:text-base max-w-md leading-relaxed mb-8"
                >
                  Curated fashion pieces designed to elevate your everyday look with elegance and confidence.
                </motion.p>

                {/* BUTTONS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex gap-4 flex-wrap"
                >

                  <Button
                    onClick={() =>
                      productsRef.current?.scrollIntoView({
                        behavior: "smooth",
                      })
                    }
                    className="bg-yellow-400 text-black px-8 py-6 rounded-full font-medium hover:scale-105 transition"
                  >
                    Shop Now
                  </Button>

                  <Button
                    onClick={() => navigate("/shop/listing")}
                    variant="outline"
                    className="border-white text-black px-8 py-6 rounded-full hover:bg-white hover:text-black transition"
                  >
                    Explore
                  </Button>

                </motion.div>

              </div>
            </div>
          </motion.div>
        ))}

        {/* ARROWS */}
        <Button
          onClick={() =>
            setCurrentSlide((p) =>
              p === 0 ? images.length - 1 : p - 1
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30"
        >
          <ChevronLeftIcon />
        </Button>

        <Button
          onClick={() =>
            setCurrentSlide((p) =>
              p === images.length - 1 ? 0 : p + 1
            )
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30"
        >
          <ChevronRightIcon />
        </Button>
      </div>

      {/* ---------------- CATEGORY ---------------- */}
      <FadeUp>
        <section className="py-14 bg-gray-50">
          <div className="container mx-auto px-4">

            <h2 className="text-3xl font-bold text-center mb-10">
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
        <section ref={productsRef} className="py-14">
          <div className="container mx-auto px-4">

            <h2 className="text-3xl font-bold text-center mb-10">
              Featured Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {productList?.map((product) => (
                <motion.div key={product._id} whileHover={{ scale: 1.03 }}>
                  <ShoppingProductTile
                    product={product}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddtoCart={handleAddtoCart}
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