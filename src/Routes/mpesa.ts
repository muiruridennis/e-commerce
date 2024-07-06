import express from 'express';

import { callback, initiateStkPush, confirmPayment , getOrderUpdates,   } from '../controllers/mpesa';
import getOAuthToken from '../controllers/middleware';


const router = express.Router();

router.post('/mpesa/stkpush', getOAuthToken, initiateStkPush);
router.post('/mpesa/callback/:orderId', callback);
router.get('/mpesa/orders/:orderId', getOrderUpdates );
router.post('/confirmPayment/:CheckoutRequestID', getOAuthToken, confirmPayment );


export default router;