import React from "react";
import { Drawer } from "antd";
import JsonViewer from "../pages/builder/response/JsonViewer";

interface DrawerComponentProps {
  title: string;
  visible: boolean; // Whether the drawer is visible
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonSchema: object | Array<any>;
  onClose: () => void; // Function to close the drawer
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({
  title,
  visible,
  jsonSchema,
  onClose,
}) => {
  return (
    <Drawer
      title={title}
      placement="right"
      closable={true}
      onClose={onClose}
      open={visible}
      width={400}
    >
      <JsonViewer jsonSchema={jsonSchema} />
    </Drawer>
  );
};

export default DrawerComponent;
