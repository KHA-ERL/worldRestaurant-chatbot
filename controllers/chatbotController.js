const { getMenu, findItemById } = require('../models/menu');
const { addToOrder, placeOrder, cancelOrder } = require('../models/order');
const { processPayment } = require('./paymentController');

const validateInput = (msg) => {
  const choice = parseInt(msg);
  return !isNaN(choice) ? choice : null;
};

const formatMenu = (menu) => {
  return (
    'Menu:\n' +
    menu.map((item) => `${item.id}. ${item.name} - ₦${item.price}`).join('\n')
  );
};

const formatOrder = (order) => {
  if (!order || order.length === 0) return 'No items in order.';
  const total = order.reduce((sum, item) => sum + item.price, 0);
  return (
    'Current Order:\n' +
    order.map((item) => `${item.name} - ₦${item.price}`).join('\n') +
    `\nTotal: ₦${total}`
  );
};

const formatOrderHistory = (history) => {
  if (!history || history.length === 0) return 'No order history.';
  return (
    'Order History:\n' +
    history
      .map((order, i) => {
        const total = order.items.reduce((sum, item) => sum + item.price, 0);
        return `#${i + 1}: ${order.items
          .map((item) => item.name)
          .join(', ')} - Total: ₦${total}`;
      })
      .join('\n')
  );
};

const formatReceipt = (order, reference) => {
  const total = order.items.reduce((sum, item) => sum + item.price, 0);
  return `
✅ Payment Successful!
📝 Order Receipt:
${order.items.map((item) => `${item.name} - ₦${item.price}`).join('\n')}
💰 Total: ₦${total}
📋 Reference: ${reference}
⏰ Time: ${new Date().toLocaleString()}
  `;
};

exports.handleMessage = async (req, res) => {
  const session = req.session;
  const msg = req.body.message?.trim();

  if (!msg) {
    return res.json({ message: 'Please enter a valid option.' });
  }

  const choice = validateInput(msg);
  let reply = '';
  let paymentUrl = null;
  let showMenu = false;
  let isPaymentSuccess = false;
  let paymentReference = null;

  // Handle payment success callback
  if (req.query.status === 'success' && req.query.reference) {
    isPaymentSuccess = true;
    paymentReference = req.query.reference;
    const lastOrder = session.orderHistory[session.orderHistory.length - 1];
    if (lastOrder) {
      reply = formatReceipt(lastOrder, paymentReference);
      return res.json({
        message: reply,
        isPaymentSuccess,
      });
    }
  }

  switch (msg) {
    case '1':
      showMenu = true;
      reply = 'Please select an item from the menu by entering its number:';
      break;

    case '99':
      if (session.currentOrder && session.currentOrder.length > 0) {
        try {
          const paymentResponse = await processPayment(req, res);
          if (paymentResponse && paymentResponse.data) {
            paymentUrl = paymentResponse.data.authorization_url;
            reply = '✅ Order placed successfully! Proceed with payment.';
          } else {
            reply = '⚠️ Failed to process payment. Please try again.';
          }
        } catch (error) {
          reply = '⚠️ Payment processing failed. Please try again.';
        }
      } else {
        reply = '⚠️ No current order to place.';
      }
      break;

    case '98':
      reply = formatOrderHistory(session.orderHistory);
      break;

    case '97':
      reply = formatOrder(session.currentOrder);
      break;

    case '0':
      if (session.currentOrder && session.currentOrder.length > 0) {
        cancelOrder(session);
        reply = '❌ Order cancelled.';
      } else {
        reply = '⚠️ No order to cancel.';
      }
      break;

    default:
      if (choice !== null) {
        const menuItem = findItemById(choice);
        if (menuItem) {
          addToOrder(session, menuItem);
          reply = `✅ ${menuItem.name} added to your order.\n${formatOrder(
            session.currentOrder
          )}\n\nType 99 to checkout or continue adding items.`;
        } else {
          reply = '⚠️ Invalid menu item. Please select a valid option.';
        }
      } else {
        reply = '⚠️ Invalid input. Please select a valid option.';
      }
  }

  res.json({
    message: reply,
    paymentUrl,
    showMenu: showMenu ? formatMenu(getMenu()) : null,
    isPaymentSuccess,
  });
};