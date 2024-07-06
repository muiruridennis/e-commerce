import { CollectionConfig } from 'payload/types';
import { admins } from '../../access/admins';
import { adminsOrLoggedIn } from '../../access/adminsOrLoggedIn';
import { adminsOrOrderedBy } from '../Orders/access/adminsOrOrderedBy';

const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'mpesaReceiptNumber',
    defaultColumns: [ "createdAt"],
  },
  access: {
    read: adminsOrOrderedBy,
    update: adminsOrOrderedBy,
    create: adminsOrLoggedIn,
    delete: admins,
  },
  fields: [
    {
      name: "order",
      label: "Order",
      type: "relationship",
      relationTo: 'orders',
      required: true,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "text",
      required: true,

    },
    {
      name: 'status',
      label: 'Payment Status',
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
      name: 'amount',
      label: 'Amount',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'mpesaReceiptNumber',
      label: 'Receipt Number',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'checkoutRequestId',
      label: ' Checkout Request',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      options: [
        { label: 'Mpesa', value: 'Mpesa' },
        { label: 'Cash', value: 'cash' },
        { label: 'Others', value: 'others' },
      ],
      defaultValue: 'Mpesa',
      required: true,
    },
  ],
};
export default Payments;
