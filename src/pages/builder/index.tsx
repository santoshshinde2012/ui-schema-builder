import React, { useMemo, useState, useCallback } from "react";
import BuilderForm from "./form";
import { IFormField, Item } from "../../types";
import { convertItemToFormField, createDynamicSchema } from "../../helpers";
import { Link } from "react-router-dom";
import { downloadJsonSchema, validateSchema } from "../../helpers/validate";
import { Button, message } from "antd";
import DataTable from "../../components/DataTable";
import DrawerComponent from "../../components/Drawer";
import {
  CheckCircleOutlined,
  DownloadOutlined,
  FundViewOutlined,
} from "@ant-design/icons";

const SchemaBuilder: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [nextId, setNextId] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>();
  const [jsonVisible, setJsonVisible] = useState(false);
  const [ajvVisible, setAjvVisible] = useState(false);

  const jsonSchema = useMemo(() => {
    return items.length > 0 ? createDynamicSchema(items) : {};
  }, [items]);

  const addItem = useCallback(
    (values: IFormField) => {
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
        }
        return [...prevItems, newItem];
      });
    },
    [nextId]
  );

  const removeItem = useCallback((id: number) => {
    const removeRecursive = (items: Item[]): Item[] =>
      items
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          children: removeRecursive(item.children),
        }));

    setItems((prevItems) => removeRecursive(prevItems));
  }, []);

  const onUpdateItem = (values: IFormField) => {
    if (!selectedItem) return;

    const updatedItem: Item = {
      ...selectedItem,
      ...values,
      children: selectedItem.children || [],
    };

    setItems((prevItems) => {
      const updateItemRecursively = (items: Item[]): Item[] =>
        items.map((item) =>
          item.id === selectedItem.id
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(`Error during download: ${error?.message}`);
    }
  };

  // Validate the schema
  const onValidate = async () => {
    try {
      const isValid = await validateSchema(jsonSchema);
      message.success(`Schema is valid: ${isValid}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(`Validation failed: ${error?.message}`);
    }
  };

  const closeDrawer = () => {
    setJsonVisible(false);
    setAjvVisible(false);
  }

  const renderNoItemsMessage = () => (
    <div className="flex justify-center items-center h-full bg-gray-100 text-center text-gray-600">
      <span>No records or fields available.</span>
    </div>
  );

  return (
    <div className="h-screen">
      <div className="sticky top-0 bg-white z-10 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="text-lg font-bold hover:underline">
            Schema Builder
          </Link>
        </h1>
        <div className="flex space-x-4">
          <Button icon={<DownloadOutlined />} className="p-2 rounded-md" onClick={onDownload} />
          <Button icon={<CheckCircleOutlined />} className="p-2 rounded-md" onClick={onValidate} />
          <Button icon={<FundViewOutlined />} className="p-2 rounded-md" onClick={() => setAjvVisible(true)} />
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

        <div className="bg-gray-100 flex-grow h-full p-2 flex flex-col overflow-y-auto shadow-[inset_6px_0px_8px_-4px_rgba(0,0,0,0.2),inset_-6px_0px_8px_-4px_rgba(0,0,0,0.2)]">
          {items.length === 0 ? (
            renderNoItemsMessage()
          ) : (
            <DataTable
              items={items}
              onRemove={removeItem}
              onSelect={setSelectedItem}
              showJsonSchema={() => setJsonVisible(true)}
            />
          )}
        </div>
      </div>
      <DrawerComponent title={jsonVisible ? "JSON Schema Viewer" : "AJV Schema Viewer"} visible={jsonVisible || ajvVisible} jsonSchema={ajvVisible ? jsonSchema: (selectedItem ? JSON.parse(JSON.stringify(selectedItem)) : {})} onClose={closeDrawer} />
    </div>
  );
};

export default SchemaBuilder;
