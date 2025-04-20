const axios = require('axios');
require('dotenv').config();

const processPayment = async (req, res) => {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Payment configuration error');
  }

  const orderTotal = req.session.currentOrder.reduce(
    (sum, item) => sum + item.price,
    0
  );

  if (orderTotal <= 0) {
    throw new Error('No items in order');
  }

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: orderTotal * 100,
        email: 'customer@example.com',
        callback_url: `${req.protocol}://${req.get(
          'host'
        )}/api/c/payment/callback`,
        metadata: {
          order_items: req.session.currentOrder.map((item) => ({
            name: item.name,
            price: item.price,
          })),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Payment Error:', error.response?.data || error.message);
    throw error;
  }
};

const paymentCallback = async (req, res) => {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  const reference = req.query.reference;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    );

    if (response.data.data.status === 'success') {
      const order = {
        items: [...req.session.currentOrder],
        paymentStatus: 'completed',
        paymentReference: reference,
        timestamp: new Date(),
      };
      req.session.orderHistory.push(order);
      req.session.currentOrder = [];

      const receiptHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Payment Successful</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
              .receipt-container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
              .receipt-header { text-align: center; color: #1E3A8A; margin-bottom: 20px; }
              .receipt-item { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
              .receipt-total { font-weight: bold; margin-top: 20px; padding-top: 10px; border-top: 2px solid #1E3A8A; }
              .receipt-footer { margin-top: 20px; text-align: center; color: #666; }
              .button { display: inline-block; padding: 10px 20px; background: #1E3A8A; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <div class="receipt-header">
                <h1>✅ Payment Successful!</h1>
              </div>
              <div class="receipt-items">
                ${order.items
                  .map(
                    (item) => `
                  <div class="receipt-item">
                    <span>${item.name}</span>
                    <span>₦${item.price}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
              <div class="receipt-total">
                <span>Total</span>
                <span>₦${order.items.reduce(
                  (sum, item) => sum + item.price,
                  0
                )}</span>
              </div>
              <div class="receipt-footer">
                <p>Reference: ${reference}</p>
                <p>Time: ${new Date().toLocaleString()}</p>
                <a href="/" class="button">Return to Chat</a>
              </div>
            </div>
          </body>
        </html>
      `;
      res.send(receiptHtml);
    } else {
      res.redirect('/?status=failed');
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.redirect('/?status=error');
  }
};

module.exports = { processPayment, paymentCallback };