import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import FilterSection from "./filter-section";
import CheckboxFilter from "./checkbox-filter";
import { cn } from "@/lib/utils";
import { filterOptions } from "@/config";

function FilterSidebar({
  filters,
  handleFilter,
  isMobileOpen,
  setIsMobileOpen,
  onApply,
  onClear,
}) {
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    },
    [isMobileOpen, setIsMobileOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const totalActiveFilters =
    filters && Object.keys(filters).length > 0
      ? Object.values(filters).reduce((sum, arr) => sum + arr.length, 0)
      : 0;

  function getActiveCountForParent(parent) {
    if (!filters || !filters.category) return 0;
    const parentIds = filterOptions.category
      .filter((o) => o.parent === parent)
      .map((o) => o.id);
    return filters.category.filter((id) => parentIds.includes(id)).length;
  }

  const parents = [...new Set(filterOptions.category.map((o) => o.parent))];

  function renderFilterOptions(groupOptions) {
    return groupOptions.map((option) => {
      const isChecked = filters?.category?.includes(option.id);
      return (
        <CheckboxFilter
          key={option.id}
          id={option.id}
          label={option.label}
          checked={isChecked}
          onChange={() => handleFilter("category", option.id)}
        />
      );
    });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
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
        <button
          onClick={() => setIsMobileOpen(false)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
          aria-label="Close filters"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
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
          onClick={() => {
            onApply?.();
            setIsMobileOpen(false);
          }}
          className="w-full bg-[#6B1E2E] hover:bg-[#5a1a27] text-white rounded-lg h-10 text-sm font-medium"
        >
          Apply Filters
          {totalActiveFilters > 0 && ` (${totalActiveFilters})`}
        </Button>
        {totalActiveFilters > 0 && (
          <button
            onClick={() => onClear?.()}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors md:hidden"
        >
          Close Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-[240px] shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {sidebarContent}
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl md:hidden transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        {sidebarContent}
      </div>
    </>
  );
}

export default FilterSidebar;
