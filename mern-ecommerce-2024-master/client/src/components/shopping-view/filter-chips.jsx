import { X } from "lucide-react";
import { filterOptions } from "@/config";

function FilterChips({ filters, handleFilter, onClear }) {
  if (!filters || Object.keys(filters).length === 0) return null;

  const chips = [];

  Object.entries(filters).forEach(([section, selectedIds]) => {
    const sectionOptions = filterOptions[section] || [];
    selectedIds.forEach((id) => {
      const option = sectionOptions.find((o) => o.id === id);
      if (option) {
        chips.push({ section, id, label: option.label });
      }
    });
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={() => handleFilter(chip.section, chip.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6B1E2E]/10 text-[#6B1E2E] text-xs font-medium hover:bg-[#6B1E2E]/20 transition-colors group"
          aria-label={`Remove ${chip.label} filter`}
        >
          {chip.label}
          <X className="w-3 h-3 group-hover:scale-110 transition-transform" />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

export default FilterChips;
