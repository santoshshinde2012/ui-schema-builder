import { DataType } from "../types";

const jsonDataTypes: DataType[] = [
  { value: "string", label: "String", color: "#4A90E2" },
  { value: "number", label: "Number", color: "#E94E77" },
  { value: "object", label: "Object", color: "#50E3C2" },
  { value: "boolean", label: "Boolean", color: "#7ED321" },
  { value: "null", label: "Null", color: "#9B9B9B" },
  {
    value: "array",
    label: "Array",
    color: "#F5A623",
    options: [
      { value: "arrayOfStrings", label: "Array of Strings", color: "#B8E986" },
      { value: "arrayOfNumbers", label: "Array of Numbers", color: "#F8E71C" },
      { value: "arrayOfObjects", label: "Array of Objects", color: "#9013FE" },
      {
        value: "arrayOfBooleans",
        label: "Array of Booleans",
        color: "#D0021B",
      },
    ],
  }
];

export { jsonDataTypes };
