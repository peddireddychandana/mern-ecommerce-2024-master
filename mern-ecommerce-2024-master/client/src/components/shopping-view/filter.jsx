import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { X } from "lucide-react";

function ProductFilter({ filters, handleFilter, isMobileOpen, onClose }) {
  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}
      <div className={`
        bg-background rounded-lg shadow-sm
        ${isMobileOpen
          ? 'fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[85vw] overflow-y-auto md:hidden animate-in slide-in-from-left'
          : 'hidden md:block'
        }
      `}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Filters</h2>
          {onClose && (
            <button onClick={onClose} className="md:hidden p-1.5 hover:bg-muted rounded-full" aria-label="Close filters">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => {
          const options = filterOptions[keyItem];
          const hasParent = options.some((o) => o.parent);

          if (hasParent) {
            const parents = [...new Set(options.map((o) => o.parent))];
            return (
              <Fragment key={keyItem}>
                {parents.map((parent) => (
                  <div key={parent}>
                    <h3 className="text-base font-bold">{parent}</h3>
                    <div className="grid gap-2 mt-2">
                      {options
                        .filter((option) => option.parent === parent)
                        .map((option) => (
                          <Label
                            key={option.id}
                            className="flex font-medium items-center gap-2"
                          >
                            <Checkbox
                              checked={
                                filters &&
                                Object.keys(filters).length > 0 &&
                                filters[keyItem] &&
                                filters[keyItem].indexOf(option.id) > -1
                              }
                              onCheckedChange={() =>
                                handleFilter(keyItem, option.id)
                              }
                            />
                            {option.label}
                          </Label>
                        ))}
                    </div>
                  </div>
                ))}
                <Separator />
              </Fragment>
            );
          }

          return (
            <Fragment key={keyItem}>
              <div>
                <h3 className="text-base font-bold">{keyItem}</h3>
                <div className="grid gap-2 mt-2">
                  {options.map((option) => (
                    <Label
                      key={option.id}
                      className="flex font-medium items-center gap-2"
                    >
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() => handleFilter(keyItem, option.id)}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
              <Separator />
            </Fragment>
          );
        })}
      </div>
    </div></>
  );
}

export default ProductFilter;
