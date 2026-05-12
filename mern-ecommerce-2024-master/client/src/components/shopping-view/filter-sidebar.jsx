import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import FilterSection from "./filter-section";
import CheckboxFilter from "./checkbox-filter";
import { filterOptions } from "@/config";
import toast from "react-hot-toast";

function FilterSidebar({
  filters,
  onApply,
  onClear,
}) {
  const [localFilters, setLocalFilters] = useState({});

  useEffect(() => {
    setLocalFilters(structuredClone(filters || {}));
  }, [filters]);

  function toggleLocalFilter(sectionId, optionId) {
    setLocalFilters((prev) => {
      const cpy = { ...prev };
      const idx = Object.keys(cpy).indexOf(sectionId);
      if (idx === -1) {
        cpy[sectionId] = [optionId];
      } else {
        const optIdx = cpy[sectionId].indexOf(optionId);
        if (optIdx === -1) cpy[sectionId].push(optionId);
        else cpy[sectionId].splice(optIdx, 1);
        if (!cpy[sectionId].length) delete cpy[sectionId];
      }
      return cpy;
    });
  }

  function handleApply() {
    onApply?.(localFilters);
    const count = Object.values(localFilters).reduce((s, a) => s + a.length, 0);
    if (count > 0) toast.success(`${count} filter${count > 1 ? "s" : ""} applied`);
  }

  function handleClear() {
    setLocalFilters({});
    onClear?.();
  }

  const totalActiveFilters = Object.values(localFilters).reduce((s, a) => s + a.length, 0);

  function getActiveCountForParent(parent) {
    if (!localFilters.category) return 0;
    const parentIds = filterOptions.category
      .filter((o) => o.parent === parent)
      .map((o) => o.id);
    return localFilters.category.filter((id) => parentIds.includes(id)).length;
  }

  const parents = [...new Set(filterOptions.category.map((o) => o.parent))];

  function renderFilterOptions(groupOptions) {
    return groupOptions.map((option) => {
      const isChecked = localFilters?.category?.includes(option.id);
      return (
        <CheckboxFilter
          key={option.id}
          id={option.id}
          label={option.label}
          checked={isChecked}
          onChange={() => toggleLocalFilter("category", option.id)}
        />
      );
    });
  }

  const sidebarContent = (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-700" />
          <h2 className="text-base font-bold text-gray-900">Filters</h2>
          {totalActiveFilters > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#6B1E2E] text-white text-[11px] font-bold">
              {totalActiveFilters}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {parents.map((parent) => (
          <FilterSection
            key={parent}
            title={parent}
            activeCount={getActiveCountForParent(parent)}
          >
            {renderFilterOptions(
              filterOptions.category.filter((o) => o.parent === parent)
            )}
          </FilterSection>
        ))}
      </div>

      <div className="border-t border-gray-100 p-4 space-y-2">
        <Button
          onClick={handleApply}
          className="w-full bg-[#6B1E2E] hover:bg-[#5a1a27] text-white rounded-lg h-10 text-sm font-medium"
        >
          Apply Filters
          {totalActiveFilters > 0 && ` (${totalActiveFilters})`}
        </Button>
        {totalActiveFilters > 0 && (
          <button
            onClick={handleClear}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>
    </div>
  );

  return (
    <aside className="w-full md:w-[240px] shrink-0">
      <div className="sticky top-4 max-h-[calc(100vh-2rem)] bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {sidebarContent}
      </div>
    </aside>
  );
}

export default FilterSidebar;
