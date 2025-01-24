import React from "react";
import { Item } from "../../../types";
import ItemGridItem from "./ItemGridItem";

interface ItemGridProps {
  items: Item[];
  selectedItemId: number | undefined;
  onSelectItem: (item: Item) => void;
  onRemoveItem: (id: number) => void;
}

const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  selectedItemId,
  onSelectItem,
  onRemoveItem,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemGridItem
          key={item.id}
          item={item}
          selectedItemId={selectedItemId}
          onSelectItem={onSelectItem}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
};

export default ItemGrid;
