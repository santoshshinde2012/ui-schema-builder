import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  Input,
  InputNumber,
  Checkbox,
  Row,
  Col,
  Button,
  message,
} from "antd";
import { IFormField, Item } from "../../../types";
import { jsonDataTypes } from "../../../constants";
import { getFilteredParentOptions, validateJsonKey } from "../../../helpers";

const { Option, OptGroup } = Select;

interface IProps {
  items: Item[];
  onAddItem: (values: IFormField) => void;
  selectedItem?: IFormField | undefined;
  onUpdateItem?: (values: IFormField) => void;
}

const BuilderForm: React.FC<IProps> = ({
  items,
  onAddItem,
  selectedItem,
  onUpdateItem,
}) => {
  const [form] = Form.useForm();
  const [selectedDataType, setSelectedDataType] = useState<string | undefined>(
    selectedItem?.dataType
  );

  const filteredParentOptions = getFilteredParentOptions(items);

  useEffect(() => {
    if (selectedItem) {
      form.setFieldsValue(selectedItem);
      setSelectedDataType(selectedItem.dataType);
    } else {
      form.resetFields();
    }
  }, [form, selectedItem]);

  const isKeyExist = (keyName: string, items: Item[], parentId?: number) => {
    if (parentId) {
      const parentItem = items.find((item) => item.id === parentId);
      return (
        parentItem?.children?.some((child) => child.name === keyName) ?? false
      );
    }
    return items.some((item) => item.name === keyName);
  };

  const handleFinish = (values: IFormField) => {
    if (isKeyExist(values.name, items, values.parentId)) {
      message.error("Key name already exists! Please choose a different name.");
      return;
    }

    if (selectedItem && onUpdateItem) {
      onUpdateItem(values);
    } else {
      onAddItem(values);
    }
    form.resetFields();
  };

  const renderMinMaxFields = (type: string | undefined) => {
    const isString = type === "string";
    const isNumber = type === "number";

    return (
      <>
        {isString && (
          <>
            <Col span={12}>
              <Form.Item label="Min Length" name="minLength">
                <InputNumber
                  min={0}
                  placeholder="Min length"
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Max Length" name="maxLength">
                <InputNumber
                  min={0}
                  placeholder="Max length"
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </>
        )}
        {isNumber && (
          <>
            <Col span={12}>
              <Form.Item label="Min Number" name="minNumber">
                <InputNumber
                  min={0}
                  placeholder="Min number"
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Max Number" name="maxNumber">
                <InputNumber
                  min={0}
                  placeholder="Max number"
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </>
        )}
      </>
    );
  };

  const renderUniqueItemsField = (type: string | undefined) => {
    const isArray =
      type === "array" ||
      type === "arrayOfStrings" ||
      type === "arrayOfNumbers" ||
      type === "arrayOfObjects" ||
      type === "arrayOfBooleans";

    return (
      isArray && (
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="uniqueItems"
              valuePropName="checked"
              initialValue={selectedItem?.uniqueItems ?? false}
            >
              <Checkbox>Is Unique Array Items</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      )
    );
  };

  return (
    <div className="p-0 bg-gray-100 w-full min-h-screen">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="bg-white p-6 rounded shadow-md"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Data Type"
              name="dataType"
              rules={[
                { required: true, message: "Please select a data type!" },
              ]}
            >
              <Select
                showSearch
                placeholder="Select and search data type"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(value) => setSelectedDataType(value)}
              >
                {jsonDataTypes.map((type) =>
                  type.options ? (
                    <OptGroup key={type.value} label={type.label}>
                      {type.options.map((subType) => (
                        <Option key={subType.value} value={subType.value}>
                          {subType.label}
                        </Option>
                      ))}
                    </OptGroup>
                  ) : (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Key Name"
              name="name"
              rules={[
                { required: true, message: "Please enter the key name!" },
                { validator: validateJsonKey },
              ]}
            >
              <Input placeholder="Enter key name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Parent ID" name="parentId">
              <Select
                showSearch
                placeholder="Select and search parent key"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {filteredParentOptions.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.parentId
                      ? `${item.parentId} - ${item.name}`
                      : item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="isOptional"
              valuePropName="checked"
              initialValue={selectedItem?.isOptional ?? false}
            >
              <Checkbox>Is Optional</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        {renderUniqueItemsField(selectedDataType)}
        {renderMinMaxFields(selectedDataType)}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {selectedItem ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BuilderForm;
