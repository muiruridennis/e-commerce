import express from 'express'
const router = express.Router();

router.post('/mpesa/callback', (req, res) => {
  const resultCode = req.body.Body.stkCallback.ResultCode;
  if (resultCode === 0) {
    const callbackMetadata = req.body.Body.stkCallback.CallbackMetadata.Item;
    const mpesaTransaction = {
      transactionDate: callbackMetadata[3].Value,
      payingPhoneNumber: callbackMetadata[4].Value,
      MpesaReceiptNumber: callbackMetadata[1].Value,
      paidAmount: callbackMetadata[0].Value,
      merchantRequestId: req.body.Body.stkCallback.MerchantRequestID,
      checkoutRequestID: req.body.Body.stkCallback.CheckoutRequestID,
    };
    console.log(mpesaTransaction)  

    // {
    //   transactionDate: 20240629160300,
    //   payingPhoneNumber: 254723032500,
    //   MpesaReceiptNumber: 'SFT512PTUX',
    //   paidAmount: 1,
    //   merchantRequestId: 'f1e2-4b95-a71d-b30d3cdbb7a7628555',
    //   checkoutRequestID: 'ws_CO_29062024160249565723032500'
    // }
} else {
    return {
      ResponseCode: `${resultCode}`,
      ResponseDesc: 'fail',
    };

  }
});


export default router;
