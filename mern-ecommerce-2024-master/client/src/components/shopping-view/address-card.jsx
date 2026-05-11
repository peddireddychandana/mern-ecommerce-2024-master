import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
  deletingAddressId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer border-red-700 ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-[4px]"
          : "border-black"
      }`}
    >
      <CardContent className="grid p-3 sm:p-4 gap-2 sm:gap-4 break-words">
        <Label className="text-sm sm:text-base">Address: {addressInfo?.address}</Label>
        <Label className="text-sm sm:text-base">City: {addressInfo?.city}</Label>
        <Label className="text-sm sm:text-base">pincode: {addressInfo?.pincode}</Label>
        <Label className="text-sm sm:text-base">Phone: {addressInfo?.phone}</Label>
        <Label className="text-sm sm:text-base">Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex flex-col sm:flex-row gap-2 sm:justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)} className="w-full sm:w-auto min-h-[2.75rem]">Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)} className="w-full sm:w-auto min-h-[2.75rem]"
          loading={deletingAddressId === addressInfo?._id}
          loadingText="Deleting..."
        >Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
