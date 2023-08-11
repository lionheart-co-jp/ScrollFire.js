export const isNodeList = (
  arg: HTMLElement | JQuery | NodeList
): arg is NodeList => {
  return (arg as NodeList).length !== undefined;
};
