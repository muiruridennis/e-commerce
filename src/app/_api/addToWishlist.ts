import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import payload from 'payload';

const AddToWishlistMutation = {
  type: new GraphQLObjectType({
    name: 'AddToWishlist',
    fields: {
      message: { type: GraphQLString },
    },
  }),
  args: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    productId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { userId, productId }, { req }) => {
    try {
      const existingWishlist = await payload.find({
        collection: 'wishlists',
        where: {
          user: {
            equals: userId,
          },
        },
      });

      if (existingWishlist.docs.length > 0) {
        const wishlist = existingWishlist.docs[0];
        wishlist.products.push(productId);
        await payload.update({
          collection: 'wishlists',
          id: wishlist.id,
          data: { products: wishlist.products },
        });
      } else {
        await payload.create({
          collection: 'wishlists',
          data: {
            user: userId,
            products: [productId],
          },
        });
      }

      return { message: 'Product added to wishlist successfully' };
    } catch (error) {
      return { message: `Error: ${error.message}` };
    }
  },
};

export default AddToWishlistMutation;
