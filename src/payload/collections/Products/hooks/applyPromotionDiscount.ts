import type { BeforeChangeHook } from 'payload/dist/collections/config/types';
export const applyPromotionDiscount: BeforeChangeHook = async ({ data, originalDoc, req }) => {
  if (data.promotion) {
    const promotion = await req.payload.findByID({
      collection: 'promotions',
      id: data.promotion
    });

    if (promotion && promotion.status === 'active') {
      const discountType = promotion.discount.type;
      const discountValue = promotion.discount.value;
      const originalPrice = originalDoc.price;

      let newPrice = originalPrice;

      if (discountType === 'percentage') {
        newPrice = originalPrice - (originalPrice * discountValue / 100);
      } else if (discountType === 'fixedAmount') {
        newPrice = originalPrice - discountValue;
      }

      data.price = newPrice;
    }
  }

  return data;
};
