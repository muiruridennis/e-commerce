import type { AfterChangeHook } from 'payload/dist/collections/config/types';

function formatDateTime(dateTime: string | Date): string {
  const date = new Date(dateTime);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };

  return date.toLocaleDateString('en-US', options);
}

export const sendOrderEmail: AfterChangeHook = async ({ doc, operation, req }) => {
  const { orderedBy, items, total, deliveryCharge, totalDiscount, totalTax, paymentMethod, status, createdAt } = doc
  const { email, name } = orderedBy

  if (operation === 'create') {
    const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .order-summary, .shipping-info, .payment-info {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .order-summary th, .shipping-info th, .payment-info th, .order-summary td, .shipping-info td, .payment-info td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        .order-summary th, .shipping-info th, .payment-info th {
          background-color: #f2f2f2;
          text-align: left;
        }
        .total {
          font-size: 1.2em;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 0.9em;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank you for your order, ${name}!</h1>
        </div>
        <p>We appreciate your business and hope you enjoy your purchase. Here is a summary of your order:</p>

        <!-- Order Summary -->
        <h2>Order Summary</h2>
        <table class="order-summary">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.product?.title}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr>
              <td class="total">Subtotal</td>
              <td></td>
              <td></td>
              <td class="total">${(items.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(2)}</td>
            </tr>
            <tr>
              <td class="total">Delivery Charge</td>
              <td></td>
              <td></td>
              <td class="total">${deliveryCharge.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="total">Discount</td>
              <td></td>
              <td></td>
              <td class="total">${totalDiscount.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="total">Estimated Taxes</td>
              <td></td>
              <td></td>
              <td class="total">${totalTax.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="total">Grand Total</td>
              <td></td>
              <td></td>
              <td class="total">${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Shipping Information -->
        <h2>Shipping Information</h2>
        <table class="shipping-info">
          <tbody>
            <tr>
              <td><strong>Recipient:</strong></td>
              <td>${doc?.name || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Address:</strong></td>
              <td>${doc.city || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Phone:</strong></td>
              <td>${doc.shippingContactNumber || 'N/A'}</td>
            </tr>
          </tbody>
        </table>

        <!-- Payment Information -->
        <h2>Payment Information</h2>
        <table class="payment-info">
          <tbody>
            <tr>
              <td><strong>Method:</strong></td>
              <td>${paymentMethod}</td>
            </tr>
            <tr>
              <td><strong>Status:</strong></td>
              <td>${status}</td>
            </tr>
            <tr>
              <td><strong>Ordered On:</strong></td>
              <td>${formatDateTime(createdAt)}</td>
            </tr>
            ${paymentMethod === 'Mpesa' ? `
              <tr>
                <td><strong>Mpesa Receipt Number:</strong></td>
                <td>${(doc.payment).mpesaReceiptNumber || 'N/A'}</td>
              </tr>
            ` : ''}
          </tbody>
        </table>

        <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tech Heavens. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    req.payload.sendEmail({
      to: email,
      from: 'purchase.techheavens.com',
      subject: 'Order Confirmation - Tech Heavens',
      html: emailContent
    });
  }
}
