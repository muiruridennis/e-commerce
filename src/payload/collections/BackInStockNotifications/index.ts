import { CollectionConfig } from 'payload/types';

const BackInStockNotifications: CollectionConfig = {
  slug: 'back-in-stock-notifications',
  labels: {
    singular: 'Back In Stock Notification',
    plural: 'Back In Stock Notifications',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const existingNotification = await req.payload.find({
            collection: 'back-in-stock-notifications',
            where: {
              email: { equals: data.email },
              product: { equals: data.product },
            },
          });

          if (existingNotification.docs.length > 0) {
            throw new Error('A notification for this product and email already exists.');
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'notified',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
};

export default BackInStockNotifications;