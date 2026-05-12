import { useEffect, useState, useRef } from "react";
import { Plus, MapPin, Building2, Phone, StickyNote, Hash, Home, Briefcase } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";

const ADDRESS_TYPES = [
  { value: "Home", icon: Home, label: "Home" },
  { value: "Work", icon: Briefcase, label: "Work" },
  { value: "Other", icon: Building2, label: "Other" },
];

function extractState(address) {
  if (!address) return { baseAddress: "", state: "" };
  const parts = address.split(", State: ");
  if (parts.length === 2) return { baseAddress: parts[0], state: parts[1] };
  return { baseAddress: address, state: "" };
}

function buildFormFromAddress(addr) {
  const { baseAddress, state } = extractState(addr?.address);
  let addressType = "Home";
  let notes = addr?.notes || "";
  const typeMatch = notes.match(/^\[(Home|Work|Other)\]/);
  if (typeMatch) {
    addressType = typeMatch[1];
    notes = notes.replace(/^\[(Home|Work|Other)\]\s*/, "");
  }
  return {
    address: baseAddress,
    city: addr?.city || "",
    state: state,
    pincode: addr?.pincode || "",
    phone: addr?.phone || "",
    notes: notes,
    addressType: addressType,
  };
}

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    notes: "",
    addressType: "Home",
  });
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (open && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [open]);

  function validate() {
    const errs = {};
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.pincode.trim()) errs.pincode = "Pincode is required";
    if (!formData.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[0-9]{10,}$/.test(formData.phone.replace(/\s/g, "")))
      errs.phone = "Enter a valid phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleOpenAdd() {
    setCurrentEditedId(null);
    setFormData({ address: "", city: "", state: "", pincode: "", phone: "", notes: "", addressType: "Home" });
    setErrors({});
    setOpen(true);
  }

  function handleOpenEdit(addressInfo) {
    setCurrentEditedId(addressInfo._id);
    setFormData(buildFormFromAddress(addressInfo));
    setErrors({});
    setOpen(true);
  }

  function handleManageAddress(event) {
    event.preventDefault();
    if (loading) return;
    if (!validate()) return;

    if (addressList.length >= 3 && currentEditedId === null) {
      toast({ title: "You can add max 3 addresses", variant: "destructive" });
      return;
    }

    setLoading(true);

    const fullAddress = formData.state
      ? `${formData.address}, State: ${formData.state}`
      : formData.address;
    const fullNotes = `[${formData.addressType}] ${formData.notes}`.trim();

    const payload = {
      address: fullAddress,
      city: formData.city,
      pincode: formData.pincode,
      phone: formData.phone,
      notes: fullNotes,
    };

    const action = currentEditedId
      ? dispatch(editaAddress({ userId: user?.id, addressId: currentEditedId, formData: payload }))
      : dispatch(addNewAddress({ ...payload, userId: user?.id }));

    action.then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        setOpen(false);
        setCurrentEditedId(null);
        setFormData({ address: "", city: "", state: "", pincode: "", phone: "", notes: "", addressType: "Home" });
        toast({ title: currentEditedId ? "Address updated successfully" : "Address added successfully" });
      }
    }).finally(() => setLoading(false));
  }

  function handleDeleteAddress(getCurrentAddress) {
    if (deletingAddressId) return;
    setDeletingAddressId(getCurrentAddress._id);
    dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({ title: "Address deleted successfully" });
      }
    }).finally(() => setDeletingAddressId(null));
  }

  function updateField(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#6B1E2E]" />
            Delivery Address
          </h3>
          <p className="text-sm text-gray-500">{addressList?.length || 0} saved addresses</p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-[#6B1E2E] hover:bg-[#5a1928] gap-1.5 text-sm h-9"
        >
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </div>

      {/* Address Cards Grid */}
      {addressList && addressList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addressList.map((item) => (
            <AddressCard
              key={item._id}
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={item}
              handleEditAddress={handleOpenEdit}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
              deletingAddressId={deletingAddressId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-1">No addresses saved yet</p>
          <p className="text-gray-400 text-xs">Add a delivery address to proceed</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#6B1E2E]" />
              {currentEditedId ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleManageAddress} className="space-y-4">
            {/* Address Type */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Address Type</Label>
              <div className="flex gap-2">
                {ADDRESS_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isActive = formData.addressType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateField("addressType", type.value)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        isActive
                          ? "bg-[#6B1E2E] text-white border-[#6B1E2E] shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#6B1E2E] hover:text-[#6B1E2E]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address */}
              <div className="sm:col-span-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Full Address</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Textarea
                    ref={firstInputRef}
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Enter your full address"
                    className={`pl-9 min-h-[60px] ${errors.address ? "border-red-400" : ""}`}
                  />
                </div>
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>

              {/* City */}
              <div>
                <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="Enter city"
                    className={`pl-9 ${errors.city ? "border-red-400" : ""}`}
                  />
                </div>
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>

              {/* State */}
              <div>
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="Enter state"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">Pincode</Label>
                <div className="relative mt-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => updateField("pincode", e.target.value)}
                    placeholder="Enter pincode"
                    className={`pl-9 ${errors.pincode ? "border-red-400" : ""}`}
                  />
                </div>
                {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Enter phone number"
                    className={`pl-9 ${errors.phone ? "border-red-400" : ""}`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Landmark / Notes</Label>
              <div className="relative mt-1">
                <StickyNote className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Nearby landmark, instructions (optional)"
                  className="pl-9"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                loadingText={currentEditedId ? "Updating..." : "Saving..."}
                className="flex-1 bg-[#6B1E2E] hover:bg-[#5a1928]"
              >
                {currentEditedId ? "Update Address" : "Save Address"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Address;
