const express = require('express');
const bodyParser = require('body-parser');
const chatbotRoutes = require('./routes/chatbotRoutes');
const sessionMw = require('./auth/session');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(sessionMw);

app.use('/api/c', chatbotRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});