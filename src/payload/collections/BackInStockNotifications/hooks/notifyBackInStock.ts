import payload from 'payload';
import type { AfterChangeHook } from 'payload/dist/collections/config/types';
import generateEmailHTML from '../email/generateEmailHTML';
import { Product, Media } from '../../../payload-types';

const notifyBackInStock: AfterChangeHook = async ({ previousDoc, doc }) => {
  if (previousDoc.stockStatus === 'outOfStock' && doc.stockStatus === 'inStock') {
    try {
      const notifications = await payload.find({
        collection: 'back-in-stock-notifications',
        where: {
          product: { equals: doc.product },  // Ensure correct filter syntax
          notified: { equals: false },
        },
      });

      for (const notification of notifications.docs) {
        try {
          const product = notification.product as Product;
          const productTitle = product?.title;
          const productSlug = product?.slug;
          // Check if product.meta.image is a Media object
          let productImageUrl: string | undefined;
          if (product?.meta?.image && typeof product.meta.image !== 'string') {
            productImageUrl = (product.meta.image as Media).url;
          }
          if (!productTitle || !productSlug) {
            console.error('Notification data missing product details:', notification);
            continue; // Skip this notification if product data is missing
          }

          await payload.sendEmail({
            to: notification.email,
            subject: 'Product Back In Stock',
            html: await generateEmailHTML({
              headline: 'Product Back In Stock',
              content: `<p>The product you were interested in, "${productTitle}", is back in stock. Check it out <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/products/${productSlug}">here</a>.</p>`,
              imageUrl: productImageUrl
            }),
          });

          await payload.delete({
            collection: 'back-in-stock-notifications',
            id: notification.id,
          });


          console.log(`Notification sent to ${notification.email}`);
        } catch (emailError) {
          console.error(`Error sending email to ${notification.email}:`, emailError);
        }
      }
    } catch (error) {
      console.error('Error notifying back-in-stock:', error);
    }
  }
};

export default notifyBackInStock;
