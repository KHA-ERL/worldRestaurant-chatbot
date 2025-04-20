const sessions = {};
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

module.exports = (req, res, next) => {
  const userId = req.ip;

  Object.keys(sessions).forEach((key) => {
    if (
      sessions[key].lastActivity &&
      Date.now() - sessions[key].lastActivity > SESSION_TIMEOUT
    ) {
      delete sessions[key];
    }
  });

  if (!sessions[userId]) {
    sessions[userId] = {
      currentOrder: [],
      orderHistory: [],
      lastActivity: Date.now(),
    };
  } else {
    sessions[userId].lastActivity = Date.now();
  }

  req.session = sessions[userId];
  next();
};