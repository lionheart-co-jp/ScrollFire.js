export const isJQuery = (
  arg: HTMLElement | JQuery | NodeList
): arg is JQuery => {
  return (arg as JQuery).each !== undefined;
};
