import { Router } from 'express';
import payload from 'payload';

const router = Router();

router.post('/mpesa/callback', async (req, res) => {
  const { Body: { stkCallback } } = req.body;
  const { MerchantRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

  if (ResultCode === 0) {
    const { Item } = CallbackMetadata;
    const transactionId = Item.find(i => i.Name === 'MpesaReceiptNumber').Value;

    await payload.update({
      collection: 'payments',
      where: { transactionId: MerchantRequestID },
      data: {
        status: 'completed',
        transactionId: transactionId,
      },
    });
  } else {
    await payload.update({
      collection: 'payments',
      where: { transactionId: MerchantRequestID },
      data: {
        status: 'failed',
        transactionId: ResultDesc,
      },
    });
  }

  res.status(200).json({ message: 'Callback received' });
});

export default router;
