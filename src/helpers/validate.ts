import Ajv from "ajv";

const ajv = new Ajv();

/**
 * Validates a JSON Schema against the JSON Schema Draft-07 meta-schema.
 *
 * @param schema - The JSON Schema to validate.
 * @returns A boolean indicating whether the schema is valid or not.
 * @throws An error if the schema is invalid, with details about the errors.
 */
export async function validateSchema(schema: object): Promise<boolean> {
  const metaSchema = ajv.getSchema("http://json-schema.org/draft-07/schema");

  if (!metaSchema) {
    throw new Error("Meta-schema for JSON Schema Draft-07 is not loaded.");
  }

  try {
    const result = metaSchema(schema);

    if (result instanceof Promise) {
      // If the result is a promise, await it.
      await result;
    }

    return true;
  } catch {
    throw new Error(
      `Schema validation failed: ${metaSchema.errors
        ?.map((error) => `${error.instancePath} ${error.message}`)
        .join(", ")}`
    );
  }
}

/**
 * Downloads a JSON file containing the given schema.
 *
 * @param jsonSchema - The JSON Schema to be downloaded.
 * @param fileName - The name of the file to be downloaded (default: "schema.json").
 * @throws Error if the input schema is not a valid JSON object.
 */
export function downloadJsonSchema(
  jsonSchema: object,
  fileName: string = "schema.json"
): void {
  try {
    // Validate the input to ensure it's a valid JSON object
    if (typeof jsonSchema !== "object" || jsonSchema === null) {
      throw new Error("Invalid JSON schema: Input must be a non-null object.");
    }

    // Convert the JSON schema to a string
    const jsonString = JSON.stringify(jsonSchema, null, 2);

    // Create a Blob object from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a temporary anchor element to trigger the download
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob); // Create a URL for the Blob
    anchor.download = fileName; // Set the file name for the download
    anchor.style.display = "none"; // Hide the anchor element

    // Append the anchor to the document, trigger the click, and remove it
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(anchor.href);
  } catch (error) {
    console.error("Failed to download JSON schema:", error);
    throw error; // Optionally re-throw the error to handle it upstream
  }
}
