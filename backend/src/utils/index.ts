// normalize a query param that may be string, array, or comma-separated
function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export { toArray };
