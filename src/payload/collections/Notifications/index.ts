import { CollectionConfig } from 'payload/types';

const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'message',
    defaultColumns: [ 'createdAt', 'read'],
  },
  access: {
    read: ({ req: { user } }) => !!user,  // Only logged-in users can read notifications
    create: () => true,
    update: () => true,
    delete: ({ req: { user } }) => user?.roles.includes('admin'), // Only admins can delete notifications
  },
  fields: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Low Stock', value: 'lowStock' },
        { label: 'New Product', value: 'newProduct' },
        { label: 'Product Updated', value: 'productUpdated' },
        // Add more notification types as needed
      ],
      required: true,
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date().toISOString(),
    },
  ],
};

export default Notifications;
