import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const dispatch = useDispatch();

  // SAFE DEFAULT (prevents undefined errors)
  const { featureImageList = [] } = useSelector(
    (state) => state.commonFeature
  );

  console.log(featureImageList, "featureImageList");

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return;

    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="p-4">

      {/* IMAGE UPLOAD COMPONENT */}
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />

      {/* UPLOAD BUTTON */}
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload Feature Image
      </Button>

      {/* IMAGE GRID */}
      <div className="flex flex-col gap-4 mt-6">

        {featureImageList.length === 0 ? (
          <p className="text-gray-500 text-center mt-5">
            No feature images found
          </p>
        ) : (
          featureImageList.map((featureImgItem, index) => (
            <div
              key={featureImgItem._id || index}
              className="relative group"
            >
              <img
                src={featureImgItem.image}
                alt="feature"
                className="w-full h-[200px] sm:h-[300px] object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
              />

              {/* OPTIONAL overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg"></div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;