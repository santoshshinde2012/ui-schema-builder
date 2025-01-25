import React, { useMemo, useState } from "react";
import ItemGrid from "./response/ItemGrid";
import JsonViewer from "./response/JsonViewer";
import BuilderForm from "./form";
import { FaCheck, FaDownload, FaShareAlt } from "react-icons/fa";
import { IFormField, Item } from "../../types";
import { convertItemToFormField, createDynamicSchema } from "../../helpers";
import { Link } from "react-router-dom";
import { downloadJsonSchema, validateSchema } from "../../helpers/validate";
import { message } from "antd";

const SchemaBuilder: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [nextId, setNextId] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>();

  const jsonSchema = useMemo(() => {
    if (!items || items.length === 0) {
      return {};
    }
    return createDynamicSchema(items);
  }, [items]);

  const addItem = (values: IFormField) => {
    const newItem: Item = {
      id: nextId,
      name: values.name,
      dataType: values.dataType,
      minLength: values.minLength,
      maxLength: values.maxLength,
      minimum: values.minNumber,
      maximum: values.maxNumber,
      pattern: values.pattern,
      uniqueItems: values.uniqueItems,
      default: values.defaultValue,
      children: [],
      isOptional: values.isOptional || false,
    };

    setNextId((prevId) => prevId + 1);

    setItems((prevItems) => {
      if (values.parentId) {
        const addChild = (items: Item[]): Item[] =>
          items.map((item) =>
            item.id === values.parentId
              ? { ...item, children: [...item.children, newItem] }
              : { ...item, children: addChild(item.children) }
          );
        return addChild(prevItems);
      } else {
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (id: number) => {
    const removeRecursive = (items: Item[]): Item[] =>
      items
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          children: removeRecursive(item.children),
        }));

    setItems((prevItems) => removeRecursive(prevItems));
  };

  const onSelectItem = (item: Item) => {
    setSelectedItem((prevItem) =>
      prevItem?.id === item.id ? undefined : item
    );
  };

  const onUpdateItem = (values: IFormField) => {
    const updatedItem: Item = {
      id: selectedItem!.id,
      name: values.name,
      dataType: values.dataType,
      minLength: values.minLength,
      maxLength: values.maxLength,
      minimum: values.minNumber,
      maximum: values.maxNumber,
      pattern: values.pattern,
      uniqueItems: values.uniqueItems,
      default: values.defaultValue,
      children: selectedItem?.children || [],
      isOptional: values.isOptional || false,
    };

    setItems((prevItems) => {
      const updateItemRecursively = (items: Item[]): Item[] =>
        items.map((item) =>
          item.id === selectedItem?.id
            ? updatedItem
            : { ...item, children: updateItemRecursively(item.children) }
        );

      return updateItemRecursively(prevItems);
    });

    setSelectedItem(undefined);
  };

  const onDownload = () => {
    try {
      downloadJsonSchema(jsonSchema, "user-schema.json");
    } catch (error) {
      message.error(`Error during download:, ${JSON.stringify(error)}`);
    }
  };

  const onValidate = async () => {
    try {
      const isValid = await validateSchema(jsonSchema);
      message.success(`Schema is valid: ${isValid}`);
    } catch (error) {
      message.error(`Error during download:, ${JSON.stringify(error)}`);
    }
  };

  const onShare = () => {};

  return (
    <div className="h-screen">
      <div className="sticky top-0 bg-white z-10 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="text-lg font-bold hover:underline">
            Schema Builder
          </Link>
        </h1>
        <div className="flex space-x-4">
          <button
            key="download"
            className={`bg-blue-500 text-white p-2 rounded-md`}
            onClick={onDownload}
          >
            <FaDownload size={20} />
          </button>
          <button
            key="validate"
            className={`bg-green-500 text-white p-2 rounded-md`}
            onClick={onValidate}
          >
            <FaCheck size={20} />
          </button>
          <button
            key="validate"
            className={`bg-yellow-500 text-white p-2 rounded-md`}
            onClick={onShare}
          >
            <FaShareAlt size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-screen">
        <div className="bg-gray-600 md:w-1/4 w-full h-1/3 md:h-full flex flex-col overflow-y-auto">
          <div className="bg-gray-200 p-4 flex">
            <h4 className="text-md font-bold text-left">Define Schema Field</h4>
          </div>
          <BuilderForm
            items={items}
            selectedItem={convertItemToFormField(selectedItem)}
            onAddItem={addItem}
            onUpdateItem={onUpdateItem}
          />
        </div>

        <div className="bg-gray-100 md:w-1/2 w-full h-1/3 md:h-full p-2 flex flex-col overflow-y-auto shadow-[inset_6px_0px_8px_-4px_rgba(0,0,0,0.2),inset_-6px_0px_8px_-4px_rgba(0,0,0,0.2)]">
          <ItemGrid
            items={items}
            selectedItemId={selectedItem?.id}
            onSelectItem={onSelectItem}
            onRemoveItem={removeItem}
          />
        </div>

        <div className="bg-gray-100 md:w-1/4 w-full h-1/3 md:h-full flex flex-col overflow-y-auto">
          <JsonViewer jsonSchema={jsonSchema} />
        </div>
      </div>
    </div>
  );
};

export default SchemaBuilder;
