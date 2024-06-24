import type { BeforeChangeHook } from 'payload/dist/collections/config/types';

export const logStockHistory: BeforeChangeHook = async ({ data, originalDoc }) => {
  // Ensure originalDoc is defined before accessing its properties
  if (originalDoc && data.stockQuantity !== undefined && data.stockQuantity !== originalDoc.stockQuantity) {
    const change = data.stockQuantity - originalDoc.stockQuantity;
    const historyEntry = {
      date: new Date().toISOString(),
      change,
      note: data.note || 'Stock quantity updated',
    };

    return {
      ...data,
      stockHistory: [...(originalDoc.stockHistory || []), historyEntry], 
    };
  }

  return data;
};
