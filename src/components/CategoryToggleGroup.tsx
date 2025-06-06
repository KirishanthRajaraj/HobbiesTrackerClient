import React, { useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
  selectedCategories: Category[];
  onChange: (selected: Category[]) => void;
}

export default function CategoryToggleGroup({
  categories,
  selectedCategories,
  onChange,
}: Props) {
  const toggleCategory = (category: Category) => {
    if (selectedCategories !== undefined) {
      if (selectedCategories.some((c) => c.id === category.id)) {
        onChange(selectedCategories.filter((c) => c.id !== category.id));
      } else {
        onChange([...selectedCategories, category]);
      }
    } else {
      const temp: Category[] = [];
      temp.push(category);
      onChange(temp);
    }

  }

  return (
    <div className="mt-6" style={{ display: "flex", gap: 8 }}>
      {categories.map((category) => {
        let selected;
        if (selectedCategories !== undefined && selectedCategories !== null) {
          selected = selectedCategories.some((c) => c.id === category.id);
        } else {
          const temp: Category[] = [];
          temp.push(category);
          onChange(temp);
        }

        return (
          <button
            key={category.id}
            onClick={() => toggleCategory(category)}
            style={{
              padding: "6px 12px",
              margin: "0 6px 5px 0",
              borderRadius: 4,
              border: "1px solid white",
              backgroundColor: "black",
              cursor: "pointer",
              color: "white",
              boxShadow: selected ? "3px 3px 0px white" : "none",
              transition: "box-shadow 0.2s ease, border 0.2s ease"
            }}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}