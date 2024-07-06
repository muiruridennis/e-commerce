import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const authUrl = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'; // Ensure this is defined

 const getOAuthToken = async (req, res, next) => {
    try {
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const response = await axios.get(authUrl, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        req.accessToken = response.data.access_token; // Set the token in the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error('Error obtaining access token:', error);
        res.status(500).json({ message: 'Error obtaining access token', error });
    }
};
export default getOAuthToken