import { XIcon, PlusIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";

const PREDEFINED_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function AdminSizesColorsPicker({ sizes, setSizes, colors, setColors }) {
  const [customSize, setCustomSize] = useState("");
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  function toggleSize(size) {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  }

  function addCustomSize() {
    const trimmed = customSize.trim().toUpperCase();
    if (!trimmed) return;
    if (sizes.includes(trimmed)) return;
    setSizes([...sizes, trimmed]);
    setCustomSize("");
  }

  function addColor() {
    const name = colorName.trim();
    if (!name) return;
    if (colors.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;
    setColors([...colors, { name, value: colorHex }]);
    setColorName("");
    setColorHex("#000000");
  }

  function removeColor(index) {
    setColors(colors.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6 mt-6">
      {/* SIZES */}
      <div>
        <Label className="text-lg font-semibold mb-3 block">Available Sizes</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {PREDEFINED_SIZES.map((size) => {
            const selected = sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selected
                    ? "bg-[#6B1E2E] text-white border-[#6B1E2E] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#6B1E2E] hover:text-[#6B1E2E]"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        {sizes.length > 0 && (
          <>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Selected sizes</Label>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#6B1E2E]/10 text-[#6B1E2E] border border-[#6B1E2E]/20"
                >
                  {size}
                  <button type="button" onClick={() => toggleSize(size)} className="hover:text-[#6B1E2E]/70">
                    <XIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-2 mt-3">
          <Input
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            placeholder="Add custom size..."
            className="h-9 text-sm flex-1"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSize(); } }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addCustomSize} className="h-9 shrink-0">
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* COLORS */}
      <div>
        <Label className="text-lg font-semibold mb-3 block">Available Colors</Label>

        {colors.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {colors.map((color, i) => (
              <div key={i} className="relative group">
                <div
                  className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
                <button
                  type="button"
                  onClick={() => removeColor(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                >
                  <XIcon className="w-3 h-3" />
                </button>
                <p className="text-[10px] text-center mt-0.5 text-muted-foreground font-medium truncate max-w-[40px]">
                  {color.name}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1">
            <Label className="text-xs text-muted-foreground">Color Name</Label>
            <Input
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="e.g. Midnight Blue"
              className="h-9 text-sm"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); } }}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Hex</Label>
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={colorHex}
                onChange={(e) => setColorHex(e.target.value)}
                className="w-9 h-9 rounded border border-gray-200 cursor-pointer p-0.5"
              />
              <span className="text-xs text-muted-foreground font-mono w-14">{colorHex}</span>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addColor} className="h-9 shrink-0">
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminSizesColorsPicker;