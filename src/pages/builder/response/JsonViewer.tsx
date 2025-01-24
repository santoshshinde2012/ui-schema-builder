import React, { useMemo } from "react";
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import { Item } from "../../../types";
import { createDynamicSchema } from "../../../helpers";
import 'react-json-view-lite/dist/index.css';

interface IJsonViewer {
  items: Item[];
}

const JsonViewer: React.FC<IJsonViewer> = ({ items }) => {
  const jsonSchema = useMemo(() => {
    if (!items || items.length === 0) {
      return {};
    }
    return createDynamicSchema(items);
  }, [items]);

  return (
    <div className="json-viewer">
      {Object.keys(jsonSchema).length > 0 ? (
          <React.Fragment>
          <JsonView data={jsonSchema} shouldExpandNode={allExpanded} style={defaultStyles} />
        </React.Fragment>
      ) : (
        <p className="text-center p-10">No data available to display.</p>
      )}
    </div>
  );
};

export default JsonViewer;
