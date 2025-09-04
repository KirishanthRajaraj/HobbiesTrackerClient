import { useEffect } from "react";

interface BaseProps<T> {
  items: T[];
  getKey: (item: T) => string | number;
  getLabel: (item: T) => string;
}

interface MultiProps<T> extends BaseProps<T> {
  multiple: true;
  selected: T[];
  onChange: (selected: T[]) => void;
}

interface SingleProps<T> extends BaseProps<T> {
  multiple?: false;
  selected: T | null;
  onChange: (selected: T | null) => void;
}

export type ToggleGroupProps<T> = MultiProps<T> | SingleProps<T>;

export default function ToggleGroup<T>(props: ToggleGroupProps<T>) {
  const { items, getKey, getLabel } = props;

  useEffect(() => {
    if (props?.selected) {
      if (Array.isArray(props.selected)) {
        props.selected.forEach(item => handleToggle(item));
      } else {
        handleToggle(props.selected);
      }
    }

  }, []);

  const handleToggle = (item: T) => {
    if (props.multiple) {
      const selectedArray = props.selected;
      if (selectedArray.some((s) => getKey(s) === getKey(item))) {
        props.onChange(selectedArray.filter((s) => getKey(s) !== getKey(item)));
      } else {
        props.onChange([...selectedArray, item]);
      }
    } else {
      props.onChange(item); // single-choice
    }
  };

  const isSelected = (item: T) => {
    if (props.multiple) {
      return props.selected.some((s) => getKey(s) === getKey(item));
    }
    return props.selected != null && getKey(props.selected) === getKey(item);
  };

  return (
    <div className="mt-6" style={{ display: "flex", gap: 8 }}>
      {items.map((item) => {
        const selectedState = isSelected(item);
        return (
          <button
            key={getKey(item)}
            onClick={() => handleToggle(item)}
            style={{
              padding: "6px 12px",
              margin: "0 6px 5px 0",
              borderRadius: 4,
              border: "1px solid white",
              backgroundColor: "black",
              cursor: "pointer",
              color: "white",
              boxShadow: selectedState ? "3px 3px 0px white" : "none",
              transition: "box-shadow 0.2s ease, border 0.2s ease",
            }}
          >
            {getLabel(item)}
          </button>
        );
      })}
    </div>
  );
}
