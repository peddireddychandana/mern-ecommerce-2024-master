import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatPrice } from "@/lib/format-price";

function getDiscountPercent(price, salePrice) {
  if (!salePrice || salePrice <= 0 || !price || price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
  deletingId,
}) {
  const discount = getDiscountPercent(product?.price, product?.salePrice);
  const mainImage = product?.images?.[0] || product?.image || "";
  const imageCount = product?.images?.length || (product?.image ? 1 : 0);

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={mainImage}
            alt={product?.title}
            className="w-full h-[200px] sm:h-[300px] object-cover rounded-t-lg"
          />
          {product?.salePrice > 0 && discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
              {discount}% OFF
            </Badge>
          )}
          {imageCount > 1 && (
            <Badge className="absolute top-2 right-2 bg-black/60 hover:bg-black/70 text-white border-0">
              +{imageCount - 1} more
            </Badge>
          )}
        </div>
        <CardContent>
          <h2 className="text-lg sm:text-xl font-bold mb-2 mt-2 line-clamp-2">{product?.title}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {product?.salePrice > 0 ? (
              <>
                <span className="text-lg font-bold">{formatPrice(product?.salePrice)}</span>
                <span className="text-sm line-through text-muted-foreground">{formatPrice(product?.price)}</span>
                {discount > 0 && (
                  <span className="text-xs font-medium text-green-600">Save {formatPrice(product?.price - product?.salePrice)}</span>
                )}
              </>
            ) : (
              <span className="text-lg font-semibold text-primary">{formatPrice(product?.price)}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center gap-2">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
            size="sm"
            className="flex-1 min-h-[44px] text-xs sm:text-sm"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(product?._id)}
            size="sm"
            className="flex-1 min-h-[44px] text-xs sm:text-sm"
            loading={deletingId === product?._id}
            loadingText="Deleting..."
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
