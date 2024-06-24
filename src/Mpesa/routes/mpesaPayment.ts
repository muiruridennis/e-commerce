import { Router } from 'express';
import { initiateSTKPush } from '../utils/mpesa';
import { PayloadRequest } from 'payload/types';

const router = Router();

router.post('/mpesa/payment', async (req: PayloadRequest, res) => {
  const { amount, phoneNumber } = req.body;

  try {
    const response = await initiateSTKPush(amount, phoneNumber);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
