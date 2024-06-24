import type { BeforeChangeHook } from 'payload/dist/collections/config/types';

export const updateStockStatus: BeforeChangeHook = ({ data, originalDoc }) => {
  const stockQuantity = data.stockQuantity ?? originalDoc.stockQuantity;
  const stockThreshold = data.stockThreshold ?? originalDoc.stockThreshold;

  if (stockQuantity <= 0) {
    data.stockStatus = 'outOfStock';
  } else if (stockQuantity <= stockThreshold) {
    data.stockStatus = 'lowStock';
  } else {
    data.stockStatus = 'inStock';
  }

  return data;
};
