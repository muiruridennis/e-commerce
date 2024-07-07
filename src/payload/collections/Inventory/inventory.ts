import { updateStockStatus } from './hooks/updateStockStatus';
import { logStockHistory } from './hooks/logStockHistory';

import type { CollectionConfig } from 'payload/types';
import notifyBackInStock from '../BackInStockNotifications/hooks/notifyBackInStock';
// import checkLowStock from '../Notifications/hooks/checkLowStock';
const Inventory: CollectionConfig = {
  slug: 'inventory',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true
  },
  hooks:{
    beforeChange: [updateStockStatus, logStockHistory,
      //  checkLowStock
      ],
    afterChange: [notifyBackInStock],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'stockQuantity',
      label: 'Stock Quantity',
      type: 'number',
      required: true,
    },
    {
      name: 'stockThreshold',
      label: 'Low Stock Threshold',
      type: 'number',
    },
    {
      name: 'stockStatus',
      label: 'Stock Status',
      type: 'select',
      options: [
        { label: 'In Stock', value: 'inStock' },
        { label: 'Low Stock', value: 'lowStock' },
        { label: 'Out of Stock', value: 'outOfStock' },
      ],
    },
    {
      name: 'stockHistory',
      label: 'Stock History',
      type: 'array',
      fields: [
        {
          name: 'date',
          label: 'Date',
          type: 'date',
          required: true,
        },
        {
          name: 'change',
          label: 'Change',
          type: 'number',
          required: true,
        },
        {
          name: 'note',
          label: 'Note',
          type: 'text',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
};

export default Inventory;
