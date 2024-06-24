// import { useMutation } from 'payload'

// // Define a custom hook to update inventory
// const useUpdateInventory = () => {
//   const [updateInventory] = useMutation('inventory');

//   const reduceStockQuantity = async (productId: string, quantity: number) => {
//     try {
//       await updateInventory({
//         id: productId,
//         data: {
//           stockQuantity: {
//             $inc: -quantity,
//           },
//         },
//       });
//     } catch (error) {
//       console.error(`Error updating inventory for product ${productId}: ${error.message}`);
//     }
//   };

//   return reduceStockQuantity;
// };

// // Then, in your checkout form or wherever you handle purchases
// const reduceStockQuantity = useUpdateInventory();

// // Inside your handleSubmit function
// for (const { product, quantity } of cartItems) {
//   const productId = typeof product === 'string' ? product : product.id;

//   reduceStockQuantity(productId, quantity);
// }
