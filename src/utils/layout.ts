export const getGridLayout = (type: string): { cols: number; rows: number } => {
  const match = type.match(/(\d+)x(\d+)/);
  if (match) {
    return { cols: parseInt(match[1]), rows: parseInt(match[2]) };
  }
  return { cols: 2, rows: 2 };
};

export const getGridClass = (type: string): string => {
  const { cols } = getGridLayout(type);
  return `grid-cols-${cols}`;
};
