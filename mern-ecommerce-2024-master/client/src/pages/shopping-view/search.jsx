import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ShirtIcon, CloudLightning, BabyIcon, SparklesIcon, SearchIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

import fallbackImg1 from "../../assets/pexels1.jpg";
import fallbackImg2 from "../../assets/pexels2.jpg";
import fallbackImg3 from "../../assets/pexels3.jpg";
import fallbackImg4 from "../../assets/yellow.jpg";

const defaultProducts = [
  { _id: "d1", image: fallbackImg1, title: "Pure Kanchipattu Silk Saree", price: 4999, salePrice: 0, category: "women-sarees", totalStock: 15, averageReview: 5 },
  { _id: "d2", image: fallbackImg2, title: "Festival Dress Material", price: 2499, salePrice: 1999, category: "women-kurtis", totalStock: 20, averageReview: 5 },
  { _id: "d3", image: fallbackImg3, title: "Premium Cotton Formal Shirt", price: 1299, salePrice: 0, category: "men-shirts", totalStock: 25, averageReview: 4 },
  { _id: "d4", image: fallbackImg4, title: "Superfine Cotton Fabric", price: 799, salePrice: 0, category: "kids-shorts", totalStock: 50, averageReview: 4 },
]

const quickCategories = [
  { id: "women-sarees", label: "Sarees", icon: SparklesIcon },
  { id: "men-shirts", label: "Shirts", icon: ShirtIcon },
  { id: "women-kurtis", label: "Kurtis", icon: CloudLightning },
  { id: "kids-shorts", label: "Shorts", icon: BabyIcon },
]

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [searched, setSearched] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const { user } = useSelector((state) => state.auth);

  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" })
    )
  }, [dispatch])

  const { productList } = useSelector((state) => state.shopProducts)
  const displayProducts = !searched ? (productList?.length ? productList : defaultProducts) : searchResults

  useEffect(() => {
    const trimmed = keyword.trim();
    if (trimmed) {
      setSearched(true);
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${trimmed}`));
        dispatch(getSearchResults(trimmed));
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setSearched(false);
      setSearchParams(new URLSearchParams());
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  function handleCategorySearch(catId) {
    setKeyword(catId)
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleBuyNow(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        navigate("/shop/checkout");
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(searchResults, "searchResults");

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="w-full flex items-center relative">
          <SearchIcon className="absolute left-4 size-5 text-gray-400 pointer-events-none" />
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-5 sm:py-6 pl-12 text-base sm:text-sm"
            placeholder="Search products..."
          />
        </div>
      </div>

      {!searched ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Browse Products</h2>
            <p className="text-gray-400 text-sm mt-1">Try searching: men, women, saree, kids, shirts, silk, cotton, etc.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto">
            {quickCategories.map((cat) => (
              <Card
                key={cat.id}
                onClick={() => handleCategorySearch(cat.id)}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <CardContent className="flex flex-col items-center p-3 sm:p-4 min-h-[5rem] sm:min-h-0 justify-center">
                  <cat.icon className="size-6 sm:size-8 mb-1.5 sm:mb-2 text-[#6B1E2E]" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">{cat.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayProducts.map((item) => (
              <ShoppingProductTile
                key={item._id}
                handleAddtoCart={handleAddtoCart}
                product={item}
                handleGetProductDetails={handleGetProductDetails}
                handleBuyNow={handleBuyNow}
              />
            ))}
          </div>
        </>
      ) : isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#6B1E2E] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !searchResults.length ? (
        <div className="text-center py-20">
          <p className="text-2xl font-semibold text-gray-400">No results found</p>
          <p className="text-gray-500 mt-2">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {searchResults.map((item) => (
            <ShoppingProductTile
              key={item._id}
              handleAddtoCart={handleAddtoCart}
              product={item}
              handleGetProductDetails={handleGetProductDetails}
              handleBuyNow={handleBuyNow}
            />
          ))}
        </div>
      )}

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
