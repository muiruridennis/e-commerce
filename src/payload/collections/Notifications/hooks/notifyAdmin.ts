// hooks/notifyAdmin.js
import payload from 'payload';

const notifyAdmin = async ({ doc, operation }) => {
  let message = '';
  let type = '';

  if (operation === 'create') {
    message = `New product added: ${doc.title}`;
    type = 'newProduct';
  } else if (operation === 'update') {
    message = `Product updated: ${doc.title}`;
    type = 'productUpdated';
  }

  if (message) {
    await payload.create({
      collection: 'notifications',
      data: {
        message,
        type,
        read: false,
        createdAt: new Date().toISOString(),
      },
    });
  }
};

export default notifyAdmin;
