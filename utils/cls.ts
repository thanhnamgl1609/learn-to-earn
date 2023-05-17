export const cls = (...classNames: (string | Record<string, any>)[]) => {
  const [lastItem] = classNames.splice(-1);

  if (lastItem !== null && typeof lastItem === 'object') {
    const optional = Object.keys(lastItem).filter((key) => lastItem![key]);

    return [...classNames, ...optional].filter(Boolean).join(' ');
  } else {
    return [...classNames, lastItem].filter(Boolean).join(' ');
  }
};
