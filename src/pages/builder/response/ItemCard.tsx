import { Item } from "../../../types";
import { getColorByValue } from "../../../helpers";
import { DeleteOutlined } from "@ant-design/icons";
interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
  onRemove: (id: number) => void;
  isSelected: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onSelect,
  onRemove,
  isSelected,
}) => {
  const backgroundColor = getColorByValue(item.dataType) || "#000000";

  return (
    <div
      onClick={() => onSelect(item)}
      style={{ backgroundColor }}
      className={`relative p-4 h-12 transition-transform duration-200 hover:scale-105 flex flex-col justify-center items-center ${
        isSelected ? "border-2 border-blue-500" : ""
      }`}
    >
      <div className="flex justify-between items-center w-full">
        <span className="text-white text-center">
          {item.name} ({item.dataType})
        </span>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-2 right-2 text-white w-6 h-6 flex items-center justify-center"
      >
        <DeleteOutlined />
      </button>
    </div>
  );
};

export default ItemCard;
