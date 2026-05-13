import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminSizesColorsPicker from "@/components/admin-view/sizes-colors-picker";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  sizes: [],
  colors: [],
  fabric: "",
  length: "",
  typeOfPiece: "",
  occasion: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const resetState = useCallback(() => {
    setFormData(initialFormData);
    setImageFiles([]);
    setUploadedImageUrls([]);
    setCurrentEditedId(null);
    setOpenCreateProductsDialog(false);
  }, []);

  function onSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);

    const images = uploadedImageUrls.filter(Boolean);
    const payload = {
      ...formData,
      image: images[0] || formData.image || "",
      images,
      sizes: formData.sizes || [],
      colors: formData.colors || [],
    };

    const action = currentEditedId !== null
      ? dispatch(editProduct({ id: currentEditedId, formData: payload }))
      : dispatch(addNewProduct(payload));

    action.then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        resetState();
        toast({
          title: data?.payload?.message || (currentEditedId !== null ? "Product updated successfully" : "Product added successfully"),
        });
      }
    }).finally(() => setLoading(false));
  }

  function handleDelete(getCurrentProductId) {
    if (deletingId) return;
    setDeletingId(getCurrentProductId);
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    }).finally(() => setDeletingId(null));
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => !["averageReview", "salePrice", "fabric", "length", "typeOfPiece", "occasion"].includes(currentKey))
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (currentEditedId && openCreateProductsDialog) {
      const product = productList.find((p) => p._id === currentEditedId);
      if (product) {
        const existing = product.images?.filter(Boolean)?.length
          ? product.images.filter(Boolean)
          : product.image
          ? [product.image]
          : [];
        setUploadedImageUrls(existing);
        setImageFiles(existing.map(() => null));
      }
    }
  }, [currentEditedId, openCreateProductsDialog, productList]);

  function handleSheetOpenChange(open) {
    if (!open) resetState();
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)} className="w-full sm:w-auto min-h-[44px]">
          Add New Product
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
                deletingId={deletingId}
              />
            ))
          : null}
      </div>
      <Sheet open={openCreateProductsDialog} onOpenChange={handleSheetOpenChange}>
        <SheetContent side="right" className="overflow-auto w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <AdminSizesColorsPicker
            sizes={formData.sizes || []}
            setSizes={(sizes) => setFormData((prev) => ({ ...prev, sizes }))}
            colors={formData.colors || []}
            setColors={(colors) => setFormData((prev) => ({ ...prev, colors }))}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
              isLoading={loading}
              loadingText={currentEditedId !== null ? "Updating..." : "Adding..."}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;