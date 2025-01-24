import { jsonDataTypes } from "../constants";
import { IFormField, Item, PropertySchema } from "../types";

const getColorByValue = (value: string): string | undefined => {
  const findColor = (dataTypeList: typeof jsonDataTypes) =>
    dataTypeList.find((type) => type.value === value)?.color;

  return (
    findColor(jsonDataTypes) ||
    findColor(
      jsonDataTypes.find((type) => type.value === "array")?.options || []
    )
  );
};
const createDynamicSchema = (items: Item[]) => {
  const properties: Record<string, PropertySchema> = {};
  const required: string[] = [];

  const buildProperties = (
    itemList: Item[],
    parentProperties: Record<string, PropertySchema>
  ) => {
    itemList.forEach((item) => {
      const type = mapDataTypeToSchemaType(item.dataType);
      const propertySchema: PropertySchema = { type };

      if (!item.isOptional) required.push(item.name);

      addStringConstraints(item, propertySchema);
      addNumberConstraints(item, propertySchema);

      if (item.default !== undefined) {
        propertySchema.default = item.default;
      }

      if (type === "object") {
        propertySchema.properties = {};
        buildProperties(item.children, propertySchema.properties);
      } else if (type === "array") {
        propertySchema.items = mapArrayItemType(item.dataType);
        if (item.dataType === "arrayOfObjects") {
          propertySchema.items = { type: "object" };
          propertySchema.properties = {};
          buildProperties(item.children, propertySchema.properties);
        }
        if (item.uniqueItems) {
          propertySchema.uniqueItems = true;
        }
      }

      parentProperties[item.name] = propertySchema;
    });
  };

  buildProperties(items, properties);

  return {
    type: "object",
    properties,
    required,
    additionalProperties: false,
  };
};

const mapDataTypeToSchemaType = (dataType: string): string => {
  switch (dataType) {
    case "string":
    case "number":
    case "boolean":
    case "object":
      return dataType;
    case "array":
    case "arrayOfStrings":
    case "arrayOfNumbers":
    case "arrayOfObjects":
    case "arrayOfBooleans":
      return "array";
    default:
      return "string";
  }
};

const addStringConstraints = (item: Item, schema: PropertySchema) => {
  if (item.dataType === "string") {
    if (item.minLength) schema.minLength = item.minLength;
    if (item.maxLength) schema.maxLength = item.maxLength;
  }
};

const addNumberConstraints = (item: Item, schema: PropertySchema) => {
  if (item.dataType === "number") {
    if (item.minimum) schema.minimum = item.minimum;
    if (item.maximum) schema.maximum = item.maximum;
  }
};

const mapArrayItemType = (dataType: string): PropertySchema | undefined => {
  switch (dataType) {
    case "arrayOfStrings":
      return { type: "string" };
    case "arrayOfNumbers":
      return { type: "number" };
    case "arrayOfBooleans":
      return { type: "boolean" };
    default:
      return undefined;
  }
};

const convertItemToFormField = (
  item: Item | undefined
): IFormField | undefined =>
  item
    ? {
        dataType: item.dataType,
        name: item.name,
        parentId: item.parentId,
        isOptional: item.isOptional ?? false,
        defaultValue: item.default ? String(item.default) : undefined,
        minNumber: item.minimum,
        maxNumber: item.maximum,
        minLength: item.minLength,
        maxLength: item.maxLength,
      }
    : undefined;

const getFilteredParentOptions = (items: Item[]): Item[] => {
  const result: Item[] = [];

  const recurse = (itemList: Item[]) => {
    itemList.forEach((item) => {
      if (["object", "arrayOfObjects"].includes(item.dataType))
        result.push(item);
      if (item.children?.length) recurse(item.children);
    });
  };

  recurse(items);
  return result;
};

const validateJsonKey = (_: unknown, value: string) => {
  const jsonKeyRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return jsonKeyRegex.test(value)
    ? Promise.resolve()
    : Promise.reject(
        new Error(
          "Key name must be a valid JSON key (e.g., no spaces, starts with a letter or underscore)."
        )
      );
};

export {
  getColorByValue,
  validateJsonKey,
  createDynamicSchema,
  getFilteredParentOptions,
  convertItemToFormField,
};
