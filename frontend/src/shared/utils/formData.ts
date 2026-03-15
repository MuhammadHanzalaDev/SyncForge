export const objectToFormData = (
  obj: Record<string, any>,
  form?: FormData,
  namespace?: string,
): FormData => {
  const formData = form || new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    const formKey = namespace ? `${namespace}[${key}]` : key;

    if (value instanceof File) {
      // Single file
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      // Array of primitives or files
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${formKey}`, item);
        } else if (typeof item === "object" && item !== null) {
          // Nested object inside array
          objectToFormData(item, formData, `${formKey}[${index}]`);
        } else {
          formData.append(`${formKey}`, item);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      // Nested object
      objectToFormData(value, formData, formKey);
    } else if (value !== undefined && value !== null) {
      // Primitive
      formData.append(formKey, value);
    }
  });

  return formData;
};
