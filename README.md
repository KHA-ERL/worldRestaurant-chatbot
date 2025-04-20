# restaurant-chatbot
A restaurant chatbot that will assist customers in placing orders for their preferred meals. The main idea is that we want customers to send options and the backend would have a chat app that would respond to the options.

## Features
- Chat interface for placing orders
- Session-based order management (30-minute timeout)
- Menu browsing and item selection
- Order history and current order viewing
- Payment processing with Paystack
- Order cancellation

## Prerequisites
- Node.js (v20 or higher)
- npm (v6 or higher)
- Paystack test account

## Setup
1. Clone the repository:

   ```bash
   git clone https://github.com/KHA-ERL-worldRestaurant-chatbot.git
   ```
     cd worldRestaurant-chatbot
   
3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory based on `.env.example`:
   ```
   PORT=3000
   PAYSTACK_SECRET_KEY=your_paystack_test_key
   NODE_ENV=development
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage

Open the chat interface in your browser.

Use the following commands:

1 - View menu and place order

99 - Checkout current order

98 - View order history

97 - View current order

0 - Cancel current order

## API Endpoints

- `POST /api/c`: Handle chat messages.
- `GET /api/c/payment/callback`: Payment callback.

## Deployment

# Deployment

- To deploy on Render:

- Push the repository to GitHub.

- Create a new Web Service on Render, connect to the repository.

Set environment variables:
```
PORT: 3000
PAYSTACK_SECRET_KEY: Your Paystack test key
NODE_ENV: production
```
- Set Build Command: npm install
- Set Start Command: npm start

Access the app at the provided Render URL here:
## License

This project is licensed under the ISC License.
ISC

---

## How to Run Locally

1. **Prerequisites:**

   - Install [Node.js](https://nodejs.org/) (v20 or higher).
   - Obtain a Paystack test secret key from the [Paystack Dashboard](https://dashboard.paystack.com/).

2. **Setup:**

   - Create the directory structure and save the files as shown.
   - Navigate to the project directory:
     ```bash
     cd worldRestaurant-chatbot
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file based on `.env.example`:
     ```
     PORT=3000
     PAYSTACK_SECRET_KEY=your_paystack_test_key
     NODE_ENV=development
     ```
   - Start the server:
     ```bash
     npm run dev
     ```
   - Open `http://localhost:3000` in a browser.

3. **Usage:**
   - Interact via the chat interface:
     - `1`: View menu and select items by number.
     - `99`: Checkout and initiate payment.
     - `98`: View order history.
     - `97`: View current order.
     - `0`: Cancel current order.
   - Use Paystack test credentials for payments.
