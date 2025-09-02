import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "./language-context";

export default function FiltersSidebar({ filters, setFilters }: any) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      {/* Filter Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleSidebar}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
        >
          {t('filters')}
        </button>
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
          <h2 className="text-lg font-semibold">{t('filters')}</h2>
          <button onClick={toggleSidebar}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Type */}
          <div>
            <h3 className="text-sm font-medium mb-2">{t('type')}</h3>
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
            <h3 className="text-sm font-medium mb-2">{t('teachers')}</h3>
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
          <button
            onClick={() => setFilters({ type: [], teachers: [] })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {t('clear_all')}
          </button>
        </div>
      </div>
    </>
  );
}
