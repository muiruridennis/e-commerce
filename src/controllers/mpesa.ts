import express from 'express';
import axios from 'axios';
import formatPhoneNumber from "../Utils/PhoneNumberUtil "
import moment from 'moment';
import payload from 'payload'
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const shortcode = process.env.MPESA_SHORTCODE;
const passkey = process.env.MPESA_PASS_KEY;
const stkPushUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';


// @desc initiate stk push
// @method POST
// @route /stkPush
// @access public
const stkPush = async (req, phoneNumber: string, amount: number, orderId: string): Promise<any> => {
    const token = req.accessToken;
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    const timestamp = moment().format("YYYYMMDDHHmmss")
    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

    const response = await axios.post(stkPushUrl, {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhoneNumber,
        PartyB: shortcode,
        PhoneNumber: formattedPhoneNumber,
        CallBackURL: `https://2sdgrbnj-3000.uks1.devtunnels.ms/api/mpesa/callback/${orderId}`,
        AccountReference: "Tech Heavens",
        TransactionDesc: "Paid online",
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const initiateStkPush = async (req, res) => {
    const { phoneNumber, amount, orderId } = req.body;
    try {
        const response = await stkPush(req, phoneNumber, amount, orderId);
        if (response.ResponseCode !== '0') {
            return res.status(500).json({
                message: response.message || 'Failed to initiate STK push'
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error initiating STK Push', error });
    }
};

// @desc callback route Safaricom will post transaction status
// @method POST
// @route /stkPushCallback/:Order_ID
// @access public
export const callback = async (req, res) => {
    const { orderId } = req.params
    const resultCode = req.body.Body.stkCallback.ResultCode;

    if (resultCode === 0) {
        const callbackMetadata = req.body.Body.stkCallback.CallbackMetadata.Item;
        const mpesaTransaction = {
            transactionDate: callbackMetadata[3].Value,
            phoneNumber: callbackMetadata[4].Value,
            mpesaReceiptNumber: callbackMetadata[1].Value,
            paidAmount: callbackMetadata[0].Value,
            merchantRequestId: req.body.Body.stkCallback.MerchantRequestID,
            checkoutRequestID: req.body.Body.stkCallback.CheckoutRequestID,
        };
        // Save the payment to the database and capture the payment ID
        try {
            const payment = await payload.create({
                collection: 'payments',
                data: {
                    order: orderId,
                    status: 'completed',
                    amount: mpesaTransaction.paidAmount,
                    phoneNumber: `${mpesaTransaction.phoneNumber}`,
                    checkoutRequestId: mpesaTransaction.checkoutRequestID,
                    mpesaReceiptNumber: mpesaTransaction.mpesaReceiptNumber,
                },
            });
            console.log(" payment saved to the database")
            try {
                await payload.update({
                    collection: 'orders',
                    id: orderId,
                    data: {
                        payment: payment.id as unknown as string, // Ensure TypeScript understands this is a string
                        status:'completed',
                        paymentMethod: 'Mpesa',

                    },
                    depth: 2,
                });
                console.log('Order updated successfully');
            } catch (updateError) {
                console.log('Unable to update order:', updateError);
                res.status(500).json({ message: 'Error updating order with payment', error: updateError });
            }
        } catch (saveError) {
            console.error('Error saving payment:', saveError);
            res.status(500).json({ message: 'Error saving payment', error: saveError });
        }
    } else {
        console.error('Transaction failed', req.body.Body.stkCallback);
        res.status(500).json({ message: 'Transaction failed' });
    }
};
export const getOrderUpdates = async (req, res) => {
    try {
        const order = await payload.findByID({
            collection: 'orders',
            id: req.params.orderId,
            depth: 2,
        })
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
          }
        res.status(200).json(order)
    } catch (error) {
        console.error('Error fetching order:', error)
        res.status(500).json({ message: 'Error fetching order', error })
    }
};

// @desc Check from safaricom servers the status of a transaction
// @method GET
// @route /confirmPayment/:CheckoutRequestID
// @access public
export const confirmPayment = async (req, res) => {
    const token = req.accessToken;
    const { CheckoutRequestID } = req.params

    const timestamp = moment().format("YYYYMMDDHHmmss")
    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"
    const requestBody = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: CheckoutRequestID,
    };

    try {
        const { data } = await axios.post(url, requestBody, { headers: { "Authorization": `Bearer ${token}` } });
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error fetching transaction status', error });
    }
};

export default router;
