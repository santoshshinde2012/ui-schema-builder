import { Item } from "../../../types";
import ItemCard from "./ItemCard";
import ItemGrid from "./ItemGrid";

const ItemGridItem: React.FC<{
  item: Item;
  selectedItemId: number | undefined;
  onSelectItem: (item: Item) => void;
  onRemoveItem: (id: number) => void;
}> = ({ item, selectedItemId, onSelectItem, onRemoveItem }) => {
  const isSelected = item.id === selectedItemId;

  return (
    <div
      className={
        item.dataType === "object" || item.dataType === "arrayOfObjects"
          ? "col-span-3"
          : "col-span-1"
      }
    >
      <ItemCard
        item={item}
        onSelect={() => onSelectItem(item)}
        onRemove={onRemoveItem}
        isSelected={isSelected}
      />
      {item.children.length > 0 && (
        <div className="mt-2">
          <ItemGrid
            items={item.children}
            selectedItemId={selectedItemId}
            onSelectItem={onSelectItem}
            onRemoveItem={onRemoveItem}
          />
        </div>
      )}
    </div>
  );
};

export default ItemGridItem;
