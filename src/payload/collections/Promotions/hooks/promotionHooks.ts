import { CollectionBeforeDeleteHook, CollectionAfterChangeHook } from 'payload/types';

export const afterChangeHook: CollectionAfterChangeHook = async ({ doc, req }) => {
    const { products, id, status } = doc;
    const { payload } = req;

    if (status === 'expired' || status === 'inactive') {
        // Remove promotion reference from products
        await payload.update({
            collection: 'products',
            where: { promotion: { equals: id } },
            data: { promotion: null },
        });
    } else {
        // Update products to reference this promotion
        await payload.update({
            collection: 'products',
            where: { id: { in: products.map((product: any) => product.id) } },
            data: { promotion: id },
        });
    }
};

export const beforeDeleteHook: CollectionBeforeDeleteHook = async ({ req, id }) => {
    const { payload } = req
    // Remove promotion reference from products before deleting the promotion
    await payload.update({
        collection: "products",
        where: { promotion: { equals: id } },
        data: {
            promotion: null
        }
    });
};
