export const getDataAttributeAsNumber = (
  target: HTMLElement,
  dataKey: string,
  _default: number | null = null
) => {
  if (!(dataKey in target.dataset)) {
    return _default;
  }

  const value = parseFloat(target.dataset[dataKey] || "");
  if (isNaN(value)) {
    return _default;
  }

  return value;
};
