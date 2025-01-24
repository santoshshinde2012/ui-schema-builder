interface Item {
  id: number;
  name: string;
  dataType: string;
  children: Item[];
  parentId?: number;
  isOptional?: boolean;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  uniqueItems?: boolean;
  default?: string | number | boolean | object;
}

interface DataType {
  value: string;
  label: string;
  color?: string;
  options?: DataType[];
}

interface PropertySchema {
  type?: string;
  properties?: { [key: string]: PropertySchema };
  required?: string[];
  items?: PropertySchema;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  uniqueItems?: boolean;
  default?: unknown;
}

interface IFormField {
  dataType: string;
  name: string;
  uniqueItems?: boolean;
  parentId?: number;
  isOptional: boolean;
  defaultValue?: string;
  minNumber?: number;
  maxNumber?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export type { Item, DataType, IFormField, PropertySchema };
