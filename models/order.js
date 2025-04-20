function addToOrder(session, item) {
    session.currentOrder.push(item);
  }
  
  function placeOrder(session) {
    if (session.currentOrder.length === 0) return false;
    session.orderHistory.push({ items: [...session.currentOrder], timestamp: new Date() });
    session.currentOrder = [];
    return true;
  }
  
  function cancelOrder(session) {
    session.currentOrder = [];
  }
  
  module.exports = { addToOrder, placeOrder, cancelOrder };