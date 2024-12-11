import React, { useState } from "react";
import { Select } from "antd";

interface FiltroCategoriaProps {
  categories: { id_category: number; name: string }[];
  onCategorySelect: (selectedCategories: number[]) => void;
}
 
const FiltroCategoria: React.FC<FiltroCategoriaProps> = ({
  categories,
  onCategorySelect,
}) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleChange = (value: number[]) => {
    setSelectedItems(value);
    onCategorySelect(value);
  };

  return (
    <div>
      <Select
        mode="multiple"
        showSearch
        className="input rounded-xl border-gray-300 px-5 py-3 shadow-lg transition-all w-64 focus:border dark:bg-dark-4"
        placeholder="Selecciona categorías"
        value={selectedItems}
        onChange={handleChange}
        style={{
          width: "100%",
          borderColor: "#5750f1",
          color: "#5750f1",
        }}
        filterOption={(input, option) =>
          (option?.children as unknown as string)
            .toLowerCase()
            .includes(input.toLowerCase())
        }
      >
        {categories.map((category) => (
          <Select.Option
            key={category.id_category}
            value={category.id_category}
            style={{ color: "#5750f1" }}
          >
            {category.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default FiltroCategoria;
