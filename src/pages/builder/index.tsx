import React, { useState, useCallback, useMemo } from "react";
import BuilderForm from "./form";
import DrawerComponent from "../../components/Drawer";
import { IFormField, Item } from "../../types";
import { convertItemToFormField, createDynamicSchema } from "../../helpers";
import { downloadJsonSchema, validateSchema } from "../../helpers/validate";
import { Button, message, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  DownloadOutlined,
  FundViewOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ResponseView from "./response";
import TreeComponent from "./response/TreeComponent";

const generateNewItem = (values: IFormField, nextId: number): Item => ({
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
});

const updateItemRecursively = (items: Item[], updatedItem: Item): Item[] =>
  items.map((item) =>
    item.id === updatedItem.id
      ? updatedItem
      : { ...item, children: updateItemRecursively(item.children, updatedItem) }
  );

const removeItemRecursively = (items: Item[], id: number): Item[] =>
  items
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: removeItemRecursively(item.children, id),
    }));

const handleError = (error: unknown, action: string) => {
  if (error instanceof Error) {
    message.error(`${action} failed: ${error.message}`);
  } else {
    message.error(`${action} failed: Unknown error.`);
  }
};

const SchemaBuilder: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [nextId, setNextId] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>();
  const [ajvVisible, setAjvVisible] = useState(false);

  const jsonSchema = useMemo(() => createDynamicSchema(items), [items]);

  const addItem = useCallback(
    (values: IFormField) => {
      const newItem = generateNewItem(values, nextId);
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
    setItems((prevItems) => removeItemRecursively(prevItems, id));
  }, []);

  const onUpdateItem = (values: IFormField) => {
    if (!selectedItem) return;

    const updatedItem: Item = {
      ...selectedItem,
      ...values,
      children: selectedItem.children || [],
    };
    setItems((prevItems) => updateItemRecursively(prevItems, updatedItem));
    setSelectedItem(undefined);
  };

  const onDownload = () => {
    try {
      downloadJsonSchema(jsonSchema, "user-schema.json");
    } catch (error) {
      handleError(error, "Download");
    }
  };

  const onValidate = async () => {
    try {
      const isValid = await validateSchema(jsonSchema);
      message.success(`Schema is valid: ${isValid}`);
    } catch (error) {
      handleError(error, "Validation");
    }
  };

  const onReorder = async (items: Item[]) => {
    setItems(items);
  };

  return (
    <div className="h-screen">
      <div className="sticky top-0 bg-purple-950 text-white z-10 shadow-md p-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="text-lg font-bold hover:underline">
            Schema Builder
          </Link>
        </h1>
        <div className="flex space-x-4">
          <Tooltip title="Download">
            <Button
              icon={<DownloadOutlined />}
              className="p-2 rounded-md"
              onClick={onDownload}
            />
          </Tooltip>
          <Tooltip title="Validate AJV Schema">
            <Button
              icon={<CheckCircleOutlined />}
              className="p-2 rounded-md"
              onClick={onValidate}
            />
          </Tooltip>
          <Tooltip title="View AJV Schema">
            <Button
              icon={<FundViewOutlined />}
              className="p-2 rounded-md"
              onClick={() => setAjvVisible(true)}
            />
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-screen">
        <div className="md:w-[20%] bg-gray-600 flex flex-col overflow-y-auto">
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

        <div className="flex-1 bg-gray-100 p-2 flex flex-col overflow-y-auto shadow-[inset_6px_0px_8px_-4px_rgba(0,0,0,0.2),inset_-6px_0px_8px_-4px_rgba(0,0,0,0.2)]">
          <ResponseView
            items={items}
            onRemove={removeItem}
            onSelect={setSelectedItem}
            onReorder={onReorder}
          />
        </div>

        <div className="md:w-[30%] bg-gray-100 overflow-y-auto">
          <div className="bg-gray-200 p-4 flex">
            <h4 className="text-md font-bold text-left">Schema Tree</h4>
          </div>
          <TreeComponent items={items} setUpdatedItems={setItems} />
        </div>
      </div>
      <DrawerComponent
        title="AJV Schema Viewer"
        visible={ajvVisible}
        jsonSchema={jsonSchema}
        onClose={() => setAjvVisible(false)}
      />
    </div>
  );
};

export default SchemaBuilder;
