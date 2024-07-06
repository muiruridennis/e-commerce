
import { initiateSTKPush } from "../../../../Utils/stkPush";
import type { BeforeChangeHook } from 'payload/dist/collections/config/types'


export const initiateMpesaPayment: BeforeChangeHook = async ({ data, operation }) => {
  if (operation === 'create' && data.paymentMethod === 'mpesa') {
    try {
      const { phoneNumber, total, id: orderId } = data;
      const transactionDesc = `Payment for order ${orderId}, total: ${total}`;
      const response = await initiateSTKPush(total, phoneNumber, orderId, transactionDesc);

      data.paymentStatus = 'pending';
      data.callbackData = response;

    } catch (error) {
      console.error('Error initiating M-Pesa payment:', error);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }
  return data;
};
