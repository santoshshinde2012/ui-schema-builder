import React from "react";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

interface IJsonViewer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonSchema: object | Array<any>;
}

const JsonViewer: React.FC<IJsonViewer> = ({ jsonSchema }) => {
  return (
    <div className="json-viewer">
      {Object.keys(jsonSchema).length > 0 ? (
        <React.Fragment>
          <JsonView
            data={jsonSchema}
            shouldExpandNode={allExpanded}
            style={defaultStyles}
          />
        </React.Fragment>
      ) : (
        <p className="text-center p-10">No data available to display.</p>
      )}
    </div>
  );
};

export default JsonViewer;
