import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-background rounded-lg shadow-sm p-4">
      <div className="pb-3 border-b mb-4">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="space-y-4">
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
    </div>
  );
}

export default ProductFilter;
