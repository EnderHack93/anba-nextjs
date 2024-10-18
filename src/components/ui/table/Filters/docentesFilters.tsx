import { fetchEntidades } from "@/services/common/apiService";
import { useEffect, useState } from "react";

interface ValueOption {
  key: string;
  label: string;
}
interface Column {
  key: string;
  label: string;
  entidad?: string;
  values?: ValueOption[];
}
interface FilterComponentProps {
  columns: Column[];
  onApplyFilters: (filters: Record<string, string>) => void;
  onClose: () => void;
  initialFilters: Record<string, string>;
}

export const FilterComponent: React.FC<FilterComponentProps> = ({
  columns,
  onApplyFilters,
  onClose,
  initialFilters,
}) => {
  const [filters, setFilters] =
    useState<Record<string, string>>(initialFilters);
  const [options, setOptions] = useState<Record<string, any[]>>({});

  const fetchOptions = async () => {
    const fetchedOptions: Record<string, any[]> = {};

    for (const column of columns) {
      if (column.entidad) {
        try {
          const response = await fetchEntidades({ entidad: column.entidad });

          const options = response.data.map((elemento: any) => ({
            key: elemento.nombre,
            label: elemento.nombre,
          }));

          fetchedOptions[column.key] = options;
        } catch (err) {
          console.log(err);
        }
      }

      if (column.values) {
        if (column.values.length > 0) {
          fetchedOptions[column.key] = column.values.map((value) => value);
        }
      }
    }
    setOptions(fetchedOptions);
  };

  useEffect(() => {
    fetchOptions();
  }, [columns]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Aplicar Filtros</h2>
        {columns.map((column) => (
          <div key={column.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {column.label}
            </label>
            <select
              value={filters[`filter.${column.key}`] || ""}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
              onChange={(e) =>
                handleFilterChange(`filter.${column.key}`, e.target.value)
              }
            >
              <option key={0} value="" disabled>
                Seleccione {column.label.toLowerCase()}
              </option>
              {options[column.key]?.map((option) => (
                <option key={option.key} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-royalBlue text-white py-2 px-4 rounded-md hover:bg-blue-700"
            onClick={handleApply}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
