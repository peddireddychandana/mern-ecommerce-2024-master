import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function FilterSection({ title, children, defaultOpen = true, activeCount = 0 }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors duration-150"
        aria-expanded={isOpen}
        aria-controls={`filter-section-${title}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#6B1E2E] text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        id={`filter-section-${title}`}
        role="region"
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="pb-3 px-1 space-y-0.5">{children}</div>
      </div>
    </div>
  );
}

export default FilterSection;
