import { AfterChangeHook } from 'payload/dist/collections/config/types';

export const updateProductsInPromotion: AfterChangeHook = async ({ doc, req }) => {
    console.log("updateProductsInPromotion hook called")
  if (doc.status === 'active') {
    const promotion = doc;
    const productIds = promotion.product;

    for (const productId of productIds) {
      const product = await req.payload.findByID({
        collection: 'products',
        id: productId
      });

      if (product) {
        const discountType = promotion.discount.type;
        const discountValue = promotion.discount.value;
        const originalPrice = product.price;

        let discountedPrice  = originalPrice;

        if (discountType === 'percentage') {
          discountedPrice  = originalPrice - (originalPrice * discountValue / 100);
        } else if (discountType === 'fixedAmount') {
          discountedPrice  = originalPrice - discountValue;
        }

        await req.payload.update({
          collection: 'products',
          id: productId,
          data: {
             discountedPrice 
          }
        });
      }
    }
  }
};
