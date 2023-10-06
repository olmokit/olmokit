/**
 * Adapt data into contact format
 *
 * 1. Transform checkbox boolean values into readable format
 */
export function adaptDataForContact(formData: Record<string, string | number>) {
  return transformCheckboxesInReadableFormat(formData);
}

/**
 * Transform checkboxes in readable format
 */
export function transformCheckboxesInReadableFormat(
  formData: Record<string, string | number>,
): object {
  for (const name in formData) {
    const value = formData[name];
    if (value === 1 || value === 0) {
      formData[name] = value ? "true" : "false";
    }
  }

  return formData;
}
