import payload from 'payload';

const checkLowStock = async ({ data, previousData }) => {
  const { stockQuantity, stockThreshold, product } = data;

  if (stockQuantity <= stockThreshold) {
    // Check if a low stock alert already exists for this product
    const existingAlert = await payload.find({
      collection: 'notifications',
      where: {
        'type': {
          equals: 'lowStock'
        },
        'product': {
          equals: product,
        },
      },
    });

    if (!existingAlert.docs.length) {
      // Create a new low stock notification
      await payload.create({
        collection: 'notifications',
        data: {
          message: `Low stock alert for product: ${product.title}. Only ${stockQuantity} left in stock.`,
          type: 'lowStock',
          read: false,
          createdAt: new Date().toISOString(),
        },
      });
    }
  }
};

export default checkLowStock;
