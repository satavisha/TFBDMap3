import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function FiltersSidebar({ filters, setFilters }: any) {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      {/* Filter Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={toggleSidebar}
          className="shadow-sm"
        >
          Filters
        </Button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={toggleSidebar}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Type */}
          <div>
            <h3 className="text-sm font-medium mb-2">Type</h3>
            <div className="flex flex-col gap-2">
              {["Event", "Festival", "Retreat"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.type?.includes(type)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...(filters.type || []), type]
                        : filters.type.filter((t: string) => t !== type);
                      setFilters({ ...filters, type: updated });
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Teachers */}
          <div>
            <h3 className="text-sm font-medium mb-2">Teachers</h3>
            <div className="flex flex-col gap-2">
              {["Moria Chappell", "Zoe Jakes", "Illan Rivière"].map(
                (teacher) => (
                  <label key={teacher} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.teachers?.includes(teacher)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...(filters.teachers || []), teacher]
                          : filters.teachers.filter((t: string) => t !== teacher);
                        setFilters({ ...filters, teachers: updated });
                      }}
                    />
                    {teacher}
                  </label>
                )
              )}
            </div>
          </div>

          {/* Clear */}
          <Button
            variant="outline"
            onClick={() => setFilters({ type: [], teachers: [] })}
            className="w-full"
          >
            Clear All
          </Button>
        </div>
      </div>
    </>
  );
}
