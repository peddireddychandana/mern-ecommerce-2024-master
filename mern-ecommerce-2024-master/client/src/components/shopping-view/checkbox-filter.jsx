import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

function CheckboxFilter({ checked, label, count, onChange, id }) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
        "hover:bg-gray-50 group",
        checked && "bg-[#6B1E2E]/5 hover:bg-[#6B1E2E]/10"
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shrink-0",
          checked
            ? "bg-[#6B1E2E] border-[#6B1E2E]"
            : "border-gray-300 group-hover:border-gray-400"
        )}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        aria-checked={checked}
      />
      <span
        className={cn(
          "text-sm flex-1",
          checked ? "font-medium text-[#6B1E2E]" : "text-gray-700"
        )}
      >
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-gray-400">{count}</span>
      )}
    </label>
  );
}

export default CheckboxFilter;
