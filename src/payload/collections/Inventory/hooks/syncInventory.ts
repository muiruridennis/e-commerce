import type { AfterChangeHook, BeforeChangeHook } from 'payload/dist/collections/config/types';

export const syncInventory: AfterChangeHook = async ({ doc, req }) => {
  const {inventory } = doc;

  if (inventory) {
    try {
      const inventoryData = await req.payload.findByID({
        collection: 'inventory',
        id: inventory,
      });

      if (inventoryData) {
        await req.payload.update({
          collection: 'inventory',
          id: inventoryData.id,
          data: {
            stockQuantity: inventoryData.stockQuantity,
            stockStatus: inventoryData.stockStatus,
          },
        });
      }
    } catch (error) {
      console.error('Error syncing inventory:', error);
    }
  }
};


export const beforeInventoryChange: BeforeChangeHook = async ({ data, req }) => {
  console.log('Executing beforeInventoryChange hook...');
  if (data.inventory) {
    try {
      const inventoryData = await req.payload.findByID({
        collection: 'inventory',
        id: data.inventory.id,
      });

      if (inventoryData) {
        data.stockQuantity = inventoryData.stockQuantity;
        data.stockStatus = inventoryData.stockStatus;
      }
    } catch (error) {
      console.error('Error before inventory change:', error);
    }
  }
  console.log('beforeInventoryChange hook completed.', data);
};


