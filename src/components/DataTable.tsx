import React, { useState } from "react";
import { Table, Button, Tooltip, Radio, Modal } from "antd";
import { DeleteOutlined, FolderViewOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import classNames from "classnames";
import { Item } from "../types";

interface TableComponentProps {
  items: Item[];
  onSelect: (item: Item | undefined) => void;
  onRemove: (id: number) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({
  items,
  onSelect,
  onRemove,
}) => {
  const [selectedRowKey, setSelectedRowKey] = useState<React.Key | null>(null);
  const [jsonSchema, setJsonSchema] = useState<object | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const handleRowSelection = (key: React.Key) => {
    setSelectedRowKey((prevKey) => (prevKey === key ? null : key));
  };

  const handleRowClick = (record: Item) => {
    const selectedItem = selectedRowKey === record.id ? null : record.id;
    setSelectedRowKey(selectedItem);
    onSelect(selectedItem ? record : undefined);
  };

  const renderBoolean = (value: boolean): string => (value ? "Yes" : "No");

  const dynamicColumns = Object.keys(items[0] || {})
    .filter(
      (key) =>
        key !== "children" &&
        key !== "default" &&
        key !== "uniqueItems" &&
        key !== "pattern"
    )
    .map((key) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataIndex: key,
      key: key,
      render: (value: string | number | boolean | object | undefined) => {
        if (typeof value === "boolean") {
          return renderBoolean(value);
        }
        return value;
      },
    }));

  const columns: ColumnsType<Item> = [
    {
      title: "Select",
      key: "select",
      render: (_text, record) => (
        <Radio
          checked={selectedRowKey === record.id}
          onClick={() => handleRowSelection(record.id)}
        />
      ),
    },
    ...dynamicColumns,
    {
      title: "Action",
      key: "action",
      render: (_text: string, record: Item) => (
        <div className="flex space-x-2">
          <Tooltip title="Remove">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemove(record.id)}
            />
          </Tooltip>
          <Tooltip title="JSON Schema">
            <Button
              icon={<FolderViewOutlined />}
              onClick={() => {
                setJsonSchema(record);
                setVisible(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={items}
        pagination={false}
        rowKey="id"
        rowClassName={(record) =>
          classNames("cursor-pointer", {
            "bg-blue-100": selectedRowKey === record.id,
          })
        }
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />

      <Modal
        title="JSON Schema"
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
      >
        <pre>{JSON.stringify(jsonSchema, null, 2)}</pre>
      </Modal>
    </div>
  );
};

export default TableComponent;
