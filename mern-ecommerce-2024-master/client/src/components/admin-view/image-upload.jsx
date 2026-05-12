import { UploadCloudIcon, XIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import API_BASE_URL from "@/config/api";

const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

function ProductImageUpload({
  imageFiles,
  setImageFiles,
  uploadedImageUrls,
  setUploadedImageUrls,
  setImageLoadingState,
  imageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [blobUrls, setBlobUrls] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const uploadQueue = useRef([]);
  const isUploading = useRef(false);

  const count = Math.max(imageFiles.length, uploadedImageUrls.length);

  function getDisplayUrl(i) {
    return uploadedImageUrls[i] || blobUrls[i] || "";
  }

  const displayUrls = Array.from({ length: count }, (_, i) => getDisplayUrl(i));
  const previewSrc = displayUrls[activeIndex] || "";
  const hasImages = count > 0;

  useEffect(() => {
    const urls = imageFiles.map((f) => (f ? URL.createObjectURL(f) : ""));
    setBlobUrls(urls);
    return () => urls.forEach((u) => { if (u) URL.revokeObjectURL(u); });
  }, [imageFiles]);

  useEffect(() => {
    if (activeIndex >= count && count > 0) {
      setActiveIndex(count - 1);
    }
  }, [count, activeIndex]);

  const processUploadQueue = useCallback(async () => {
    if (isUploading.current || uploadQueue.current.length === 0) return;
    isUploading.current = true;
    setImageLoadingState(true);

    while (uploadQueue.current.length > 0) {
      const { file, index } = uploadQueue.current.shift();
      try {
        const data = new FormData();
        data.append("my_file", file);
        const response = await axios.post(
          `${API_BASE_URL}/admin/products/upload-image`,
          data
        );
        if (response?.data?.success) {
          setUploadedImageUrls((prev) => {
            const next = [...prev];
            next[index] = response.data.result.url;
            return next;
          });
        }
      } catch (error) {
        console.error("Upload failed for image", index, error);
      }
    }

    isUploading.current = false;
    setImageLoadingState(false);
  }, [setImageLoadingState, setUploadedImageUrls]);

  useEffect(() => {
    if (uploadQueue.current.length > 0 && !isUploading.current) {
      processUploadQueue();
    }
  }, [imageFiles, processUploadQueue]);

  function validateFile(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `"${file.name}" is not a supported image type. Use JPG or PNG.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" exceeds 5MB limit.`;
    }
    return null;
  }

  function addFiles(newFiles) {
    const remaining = MAX_IMAGES - count;
    const valid = [];
    const errors = [];

    for (let i = 0; i < Math.min(newFiles.length, remaining); i++) {
      const error = validateFile(newFiles[i]);
      if (error) {
        errors.push(error);
      } else {
        valid.push(newFiles[i]);
      }
    }

    if (valid.length === 0 && errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const startIndex = count;
    setImageFiles((prev) => [...prev, ...valid]);
    setUploadedImageUrls((prev) => [...prev, ...valid.map(() => "")]);

    valid.forEach((file, i) => {
      uploadQueue.current.push({ file, index: startIndex + i });
    });

    if (!isUploading.current) {
      processUploadQueue();
    }
  }

  function handleFileChange(event) {
    const files = event.target.files;
    if (files?.length) {
      addFiles(Array.from(files));
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragOver(false);
    const files = event.dataTransfer.files;
    if (files?.length) {
      addFiles(Array.from(files));
    }
  }

  function handleRemoveImage(index) {
    setImageFiles((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    setUploadedImageUrls((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    uploadQueue.current = uploadQueue.current.filter((q) => q.index !== index);
    uploadQueue.current.forEach((q) => {
      if (q.index > index) q.index--;
    });
  }

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : ""}`}>
      <Label className="text-lg font-semibold mb-3 block">Product Images</Label>

      {hasImages && (
        <div className="mb-4 space-y-3">
          <div className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200 aspect-square max-h-[280px]">
            {imageLoadingState && !uploadedImageUrls[activeIndex] && imageFiles[activeIndex] && (
              <div className="absolute inset-0 bg-black/10 z-10 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={previewSrc}
              alt={`Product image ${activeIndex + 1}`}
              className="w-full h-full object-contain p-2"
            />
            {count > 1 && (
              <>
                <button
                  onClick={() => setActiveIndex((p) => (p > 0 ? p - 1 : count - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveIndex((p) => (p < count - 1 ? p + 1 : 0))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: count }, (_, i) => {
              const isUploaded = !!uploadedImageUrls[i];
              const isPending = !!imageFiles[i] && !isUploaded;
              const isActive = activeIndex === i;
              return (
                <div key={i} className="relative group">
                  <button
                    onClick={() => setActiveIndex(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      isActive
                        ? "border-[#6B1E2E] ring-1 ring-[#6B1E2E]/30"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={displayUrls[i]}
                      alt={`Thumb ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isPending && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => handleRemoveImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-white bg-[#6B1E2E] px-1 rounded whitespace-nowrap">
                      MAIN
                    </span>
                  )}
                </div>
              );
            })}

            {count < MAX_IMAGES && (
              <button
                onClick={() => inputRef.current?.click()}
                className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#6B1E2E] hover:bg-[#6B1E2E]/5 flex items-center justify-center transition-all flex-shrink-0"
              >
                <UploadCloudIcon className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          dragOver
            ? "border-[#6B1E2E] bg-[#6B1E2E]/5"
            : "border-gray-300 hover:border-gray-400"
        } ${count >= MAX_IMAGES ? "opacity-40 pointer-events-none" : "cursor-pointer"}`}
        onClick={() => count < MAX_IMAGES && inputRef.current?.click()}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
          multiple
          accept="image/jpeg,image/png,image/jpg,image/webp"
        />
        <UploadCloudIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium text-muted-foreground">
          {count >= MAX_IMAGES
            ? "Maximum 4 images reached"
            : "Drag & drop images here, or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {count}/{MAX_IMAGES} images &middot; JPG or PNG &middot; max 5MB each
        </p>
      </div>
    </div>
  );
}

export default ProductImageUpload;