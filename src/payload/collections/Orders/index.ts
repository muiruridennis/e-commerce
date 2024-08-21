import { CollectionConfig } from 'payload/types';
import { admins } from '../../access/admins';
import { adminsOrLoggedIn } from '../../access/adminsOrLoggedIn';
import { adminsOrOrderedBy } from './access/adminsOrOrderedBy';
import { clearUserCart } from './hooks/clearUserCart';
import { populateOrderedBy } from './hooks/populateOrderedBy';
import { updateUserPurchases } from './hooks/updateUserPurchases';
import { sendOrderEmail } from './hooks/sendOrderEmail';
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'createdAt',
    defaultColumns: ['createdAt', 'orderedBy'],
    preview: doc => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`,
  },
  hooks: {
    afterChange: [updateUserPurchases, clearUserCart, sendOrderEmail],
  },
  access: {
    read: adminsOrOrderedBy,
    update: admins,
    create: adminsOrLoggedIn,
    delete: admins,
  },
  fields: [
    {
      name: 'orderedBy',
      type: 'relationship',
      relationTo: 'users',
      hooks: {
        beforeChange: [populateOrderedBy],
      },
    },
    {
      name: 'payment',
      label: 'Payment',
      type: 'relationship',
      relationTo: 'payments',
    },
    {
      name: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      options: [
        { label: 'Mpesa', value: 'Mpesa' },
        { label: 'Cash On Delivery', value: 'CashOnDelivery' },
        { label: 'Others', value: 'others' },
      ],
      defaultValue: 'Mpesa',
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'totalDiscount',
      type: 'number',
      min: 0,
    },
    {
      name: 'deliveryCharge',
      type: 'number',
      min: 0,
    },
    {
      name: 'totalTax',
      type: 'number',
      min: 0,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
        },
        {
          name: 'quantity',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      name: 'shippingMethod',
      label: 'Shipping Method',
      type: 'select',
      options: [
        { label: 'Delivery', value: 'delivery' },
        { label: 'Pickup', value: 'pickup' },
      ],
      required: true,
    },
    {
      name: 'county',
      label: 'County',
      type: 'text',
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
    },
    {
      name: 'shippingContactNumber',
      label: 'Shipping Contact Number',
      type: 'text',
      required: true,
    },
  ],
};
