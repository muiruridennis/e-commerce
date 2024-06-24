// src/collections/Payments.ts
import { CollectionConfig } from 'payload/types';

const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'transactionId',
  },
  fields: [
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Amount',
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      label: 'Phone Number',
    },
    {
      name: 'transactionId',
      type: 'text',
      label: 'Transaction ID',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'failed', label: 'Failed' },
      ],
      defaultValue: 'pending',
      label: 'Status',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users', // Collection slug of the related collection
      required: true,
      label: 'User',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products', // Collection slug of the related collection
      required: true,
      label: 'Product',
    },
  ],
};

export default Payments;
