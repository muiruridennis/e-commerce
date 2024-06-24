import axios from 'axios';
import dotenv from 'dotenv';
import formatPhoneNumber from "./PhoneNumberUtil "

dotenv.config();

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortcode = process.env.MPESA_SHORTCODE;
const passkey = process.env.MPESA_PASSKEY;
const authUrl = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const stkPushUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

// Function to get OAuth token
export const getOAuthToken = async (): Promise<string> => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const response = await axios.get(authUrl, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  return response.data.access_token;
};

// Function to initiate STK Push
export const initiateSTKPush = async (amount: number, phoneNumber: string): Promise<any> => {
  const token = await getOAuthToken();
  const formattedPhoneNumber =formatPhoneNumber(phoneNumber);

  const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, -4);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  const response = await axios.post(stkPushUrl, {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: formattedPhoneNumber,
    PartyB: shortcode,
    PhoneNumber: formattedPhoneNumber,
    CallBackURL: 'https://your-domain.com/api/mpesa/callback',
    AccountReference: 'Test123',
    TransactionDesc: 'Payment for goods',
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
