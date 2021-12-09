export const calculateOwnerTime = (x: number, y: number) => {
  if (y === 0) return '0.00';
  return (x / y).toFixed(2);
};
