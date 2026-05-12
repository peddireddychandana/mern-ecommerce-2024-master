import { MapPin, Home, Briefcase, Building2, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "../ui/button";

const typeConfig = {
  Home: { icon: Home, color: "bg-blue-100 text-blue-700" },
  Work: { icon: Briefcase, color: "bg-purple-100 text-purple-700" },
  Other: { icon: Building2, color: "bg-gray-100 text-gray-700" },
};

function getAddressType(notes) {
  if (!notes) return "Home";
  const match = notes.match(/^\[(Home|Work|Other)\]/);
  return match ? match[1] : "Home";
}

function stripTypeFromNotes(notes) {
  if (!notes) return "";
  return notes.replace(/^\[(Home|Work|Other)\]\s*/, "");
}

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
  deletingAddressId,
}) {
  const addressType = getAddressType(addressInfo?.notes);
  const TypeIcon = typeConfig[addressType]?.icon || Home;
  const cleanNotes = stripTypeFromNotes(addressInfo?.notes);
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <div
      onClick={setCurrentSelectedAddress ? () => setCurrentSelectedAddress(addressInfo) : undefined}
      className={`relative group bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected
          ? "border-[#6B1E2E] shadow-md shadow-[#6B1E2E]/10"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-[#6B1E2E]">
          <Star className="absolute -top-[30px] -right-[2px] w-3.5 h-3.5 text-white fill-white" />
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${typeConfig[addressType]?.color || typeConfig.Home.color}`}>
              <TypeIcon className="w-3 h-3" />
              {addressType}
            </span>
            {isSelected && (
              <span className="text-[10px] font-semibold text-[#6B1E2E] bg-[#6B1E2E]/5 px-2 py-0.5 rounded-full">Default</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => { e.stopPropagation(); handleEditAddress({ ...addressInfo, notes: cleanNotes }); }}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addressInfo); }}
              className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              title="Delete"
              disabled={deletingAddressId === addressInfo?._id}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Address details */}
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700 leading-snug">{addressInfo?.address}</p>
          </div>
          <p className="text-sm text-gray-500 pl-6">
            {addressInfo?.city}{addressInfo?.city && addressInfo?.pincode ? " - " : ""}{addressInfo?.pincode}
          </p>
          <p className="text-sm text-gray-500 pl-6">{addressInfo?.phone}</p>
          {cleanNotes && (
            <p className="text-xs text-gray-400 pl-6 italic">{cleanNotes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddressCard;
