import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton";
import FilterSidebar from "@/components/shopping-view/filter-sidebar";
import FilterChips from "@/components/shopping-view/filter-chips";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { ArrowUpDownIcon, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import gsap from "gsap";

function ShoppingListing() {
  const dispatch = useDispatch();

  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const { toast } = useToast();

  // refs for animation
  const containerRef = useRef(null);
  const productRefs = useRef([]);
  const addingRef = useRef(false);
  const initialSyncDone = useRef(false);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock, selectedSize, selectedColor) {
    if (addingRef.current) return;
    addingRef.current = true;
    setCartLoading(true);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId && item.selectedSize === (selectedSize || "") && item.selectedColor === (selectedColor || "")
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity allowed`,
            variant: "destructive",
          });
          setCartLoading(false);
          return;
        }
      }
    }

    return dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        selectedSize,
        selectedColor,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    }).finally(() => { addingRef.current = false; setCartLoading(false); });
  }

  function handleBuyNow(getCurrentProductId, getTotalStock, selectedSize, selectedColor) {
    if (buyLoading) return;
    setBuyLoading(true);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId && item.selectedSize === (selectedSize || "") && item.selectedColor === (selectedColor || "")
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity allowed`,
            variant: "destructive",
          });
          setBuyLoading(false);
          return;
        }
      }
    }

    return dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        selectedSize,
        selectedColor,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        navigate("/shop/checkout");
      }
    }).finally(() => setBuyLoading(false));
  }

  // PAGE LOAD ANIMATION
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  // PRODUCT STAGGER ANIMATION
  useEffect(() => {
    if (productList?.length > 0) {
      gsap.fromTo(
        productRefs.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }
  }, [productList]);

  // INIT STATE FROM URL ON MOUNT
  useEffect(() => {
    const savedFilters = JSON.parse(sessionStorage.getItem("filters"));
    const categoryParam = searchParams.get("category");
    if (savedFilters && Object.keys(savedFilters).length > 0) {
      setFilters(savedFilters);
    } else if (categoryParam) {
      const fromUrl = { category: categoryParam.split(",") };
      setFilters(fromUrl);
      sessionStorage.setItem("filters", JSON.stringify(fromUrl));
    }
    setSort(searchParams.get("sort") || "price-lowtohigh");
    const productParam = searchParams.get("product");
    if (productParam) dispatch(fetchProductDetails(productParam));
    initialSyncDone.current = true;
  }, []);

  // SYNC FILTERS → URL
  useEffect(() => {
    if (!initialSyncDone.current) return;
    const params = new URLSearchParams(searchParams);
    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([k, v]) => params.set(k, v.join(",")));
    } else {
      params.delete("category");
    }
    if (!openDetailsDialog) params.delete("product");
    setSearchParams(params);
  }, [filters, openDetailsDialog]);

  // SYNC SORT → URL
  useEffect(() => {
    if (!initialSyncDone.current) return;
    const params = new URLSearchParams(searchParams);
    if (sort) params.set("sort", sort);
    setSearchParams(params);
  }, [sort]);

  // FETCH PRODUCTS
  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  // OPEN DIALOG + SYNC product PARAM
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
      const params = new URLSearchParams(searchParams);
      params.set("product", productDetails._id);
      if (filters && Object.keys(filters).length > 0) {
        Object.entries(filters).forEach(([k, v]) => params.set(k, v.join(",")));
      }
      if (sort) params.set("sort", sort);
      setSearchParams(params);
    }
  }, [productDetails]);

  function handleOpenDetailsDialogChange(open) {
    if (!open) {
      const params = new URLSearchParams(searchParams);
      params.delete("product");
      setSearchParams(params);
      dispatch(setProductDetails());
    }
    setOpenDetailsDialog(open);
  }

  // HOVER EFFECT (delegated animation helper)
  function handleHover(i, enter) {
    gsap.to(productRefs.current[i], {
      scale: enter ? 1.05 : 1,
      y: enter ? -5 : 0,
      duration: 0.2,
      ease: "power2.out",
    });
  }

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* FILTER SIDEBAR - Desktop inline */}
        <div className="hidden md:block">
          {showFilters && (
            <FilterSidebar
              filters={filters}
              onApply={(appliedFilters) => {
                setFilters(appliedFilters);
                sessionStorage.setItem("filters", JSON.stringify(appliedFilters));
                setShowFilters(false);
              }}
              onClear={() => {
                setFilters({});
                sessionStorage.removeItem("filters");
              }}
            />
          )}
        </div>

        {/* FILTER SIDEBAR - Mobile sheet */}
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 md:hidden">
            <FilterSidebar
              filters={filters}
              onApply={(appliedFilters) => {
                setFilters(appliedFilters);
                sessionStorage.setItem("filters", JSON.stringify(appliedFilters));
                setShowFilters(false);
              }}
              onClear={() => {
                setFilters({});
                sessionStorage.removeItem("filters");
              }}
            />
          </SheetContent>
        </Sheet>

        {/* PRODUCTS */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* HEADER */}
          <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 rounded-t-xl">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <h2 className="text-lg font-bold text-gray-900">
                All Products
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Filters"}
              </Button>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDownIcon className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={handleSort}
                  >
                    {sortOptions.map((s) => (
                      <DropdownMenuRadioItem key={s.id} value={s.id}>
                        {s.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* FILTER CHIPS */}
          <div className="px-4 pt-3">
            <FilterChips
              filters={filters}
              handleFilter={handleFilter}
              onClear={() => {
                setFilters({});
                sessionStorage.removeItem("filters");
              }}
            />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={`skeleton-${i}`}>
                    <ProductTileSkeleton />
                  </div>
                ))
              : productList?.map((productItem, i) => (
                  <div
                    key={productItem._id}
                    ref={(el) => (productRefs.current[i] = el)}
                    onMouseEnter={() => handleHover(i, true)}
                    onMouseLeave={() => handleHover(i, false)}
                    className="transition-transform"
                  >
                    <ShoppingProductTile
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                      handleBuyNow={handleBuyNow}
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* DETAILS MODAL */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={handleOpenDetailsDialogChange}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;