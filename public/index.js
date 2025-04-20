const initialOptions = `
🤖 Welcome to Restaurant ChatBot! Choose an option:
1 - Place an Order
99 - Checkout
98 - Order History
97 - Current Order
0 - Cancel Order
`;

const urlParams = new URLSearchParams(window.location.search);
const paymentStatus = urlParams.get('status');
const paymentReference = urlParams.get('reference');

document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box');

  if (paymentStatus === 'success' && paymentReference) {
    window.history.replaceState({}, document.title, window.location.pathname);
    fetch('/api/c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isPaymentSuccess) {
          chatBox.innerHTML = `
            <div class="bot-message message">
              <div class="receipt">
                ${data.message.split('\n').map((line) => `<p>${line}</p>`).join('')}
              </div>
              <p>Type 1 to place another order or 98 to view order history.</p>
            </div>
          `;
        }
      });
  } else if (paymentStatus === 'failed') {
    chatBox.innerHTML = `
      <div class="bot-message message">
        <p>⚠️ Payment failed. Please try again.</p>
        <p>Type 1 to place another order or 98 to view order history.</p>
      </div>
    `;
  } else if (paymentStatus === 'error') {
    chatBox.innerHTML = `
      <div class="bot-message message">
        <p>⚠️ An error occurred during payment. Please try again.</p>
        <p>Type 1 to place another order or 98 to view order history.</p>
      </div>
    `;
  } else {
    chatBox.innerHTML = `
      <div class="welcome-message">
        <p>Welcome to our Restaurant ChatBot!</p>
      </div>
      <div class="bot-message message">
        <div class="options-list">
          ${initialOptions.split('\n').map((line) => `<p>${line}</p>`).join('')}
        </div>
      </div>
    `;
  }
  chatBox.scrollTop = chatBox.scrollHeight;
});

document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const input = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');
  const message = input.value.trim();

  if (!message) return;

  chatBox.innerHTML += `
    <div class="user-message message">
      <p>${message}</p>
    </div>
  `;

  fetch('/api/c', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
    .then((res) => res.json())
    .then((data) => {
      chatBox.innerHTML += `
        <div class="bot-message message">
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        </div>
      `;

      if (data.showMenu) {
        chatBox.innerHTML += `
          <div class="bot-message message">
            <div class="options-list">
              ${data.showMenu.split('\n').map((line) => `<p>${line}</p>`).join('')}
            </div>
          </div>
        `;
      }

      if (data.paymentUrl) {
        chatBox.innerHTML += `
          <div class="bot-message message">
            <p>Click the button below to proceed with payment:</p>
            <button onclick="window.open('${data.paymentUrl}', '_blank')">Pay Now</button>
          </div>
        `;
      }

      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch((error) => {
      chatBox.innerHTML += `
        <div class="bot-message message">
          <p>⚠️ An error occurred. Please try again.</p>
        </div>
      `;
      chatBox.scrollTop = chatBox.scrollHeight;
    });

  input.value = '';
}