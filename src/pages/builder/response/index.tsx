import React from "react";
import { Item } from "../../../types";
import DataTable from "./DataTable";

const renderNoItemsMessage = () => (
  <div className="flex justify-center items-center h-full bg-gray-100 text-center text-gray-600">
    <span>No records or fields available.</span>
  </div>
);

interface IProps {
  items: Item[];
  onReorder: (items: Item[]) => void;
  onSelect: (item: Item | undefined) => void;
  onRemove: (id: number) => void;
}

const ResponseView: React.FC<IProps> = ({
  items,
  onSelect,
  onRemove,
}) => {
  return (
    <>
      {items.length === 0 ? (
        renderNoItemsMessage()
      ) : (
        <DataTable items={items} onRemove={onRemove} onSelect={onSelect} />
      )}
    </>
  );
};

export default ResponseView;
