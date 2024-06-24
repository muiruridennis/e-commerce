import type { AfterDeleteHook } from 'payload/dist/collections/config/types';
import type { Product } from '../../../payload-types';

export const deleteProductFromWishlist: AfterDeleteHook<Product> = async ({ req, id }) => {
  const usersWithProductInWishlist = await req.payload.find({
    collection: 'users',
    overrideAccess: true,
    where: {
      'wishlist.items.product': {
        equals: id,
      },
    },
  });

  if (usersWithProductInWishlist.totalDocs > 0) {
    await Promise.all(
      usersWithProductInWishlist.docs.map(async (user) => {
        const wishlist = user.wishlist;
        const itemsWithoutProduct = wishlist.items.filter((item) => item.product !== id);
        const wishlistWithoutProduct = {
          ...wishlist,
          items: itemsWithoutProduct,
        };

        return req.payload.update({
          collection: 'users',
          id: user.id,
          data: {
            wishlist: wishlistWithoutProduct,
          },
        });
      }),
    );
  }
};
