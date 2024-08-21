export const calculateTotalDiscount = (cartItems) => {
  return cartItems.reduce((totalDiscount, item) => {
    const { quantity, product } = item;
    const originalPrice = product.price;
    const discountedPrice = product.discountedPrice || originalPrice;
    const discountPerItem = originalPrice - discountedPrice;
    const totalItemDiscount = discountPerItem * quantity;

    return totalDiscount + totalItemDiscount;
  }, 0);
};

// Calculate tax based on cart items and tax rate
export const calculateTax = (items, taxRate) => {
  return items.reduce((totalTax, item) => {
    const { quantity, product } = item;
    const { price, discountedPrice } = product;
    const effectivePrice = discountedPrice || price;
    const itemTax = effectivePrice * taxRate;

    return totalTax + (itemTax * quantity);
  }, 0);
};

// Calculate delivery charge based on order, shipping method, and location
export const calculateDeliveryCharge = (
  order: { total: number },
  deliveryLocation: string,
  deliveryOrPickup: 'delivery' | 'pickup'
) => {
  let charge = 0;

  if (deliveryOrPickup === 'pickup') {
    return 0; // No delivery charge for pickups
  }
  // Determine the charge based on the location
  charge = deliveryLocation.toLowerCase() === 'nairobi' ? 200 : 400;

  // Free delivery for orders over a certain amount
  if (order.total > 100000) {
    charge = 0;
  }

  return charge;
};
