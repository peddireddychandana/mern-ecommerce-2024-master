const requestCounts = new Map();

const CLEANUP_INTERVAL = 60000;
const WINDOW_MS = 2000;
const MAX_REQUESTS = 5;

setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of requestCounts.entries()) {
    if (now - timestamp > WINDOW_MS) {
      requestCounts.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

function rateLimiter(req, res, next) {
  const key = `${req.ip}-${req.originalUrl}`;
  const now = Date.now();

  if (requestCounts.has(key)) {
    const count = requestCounts.get(key);
    if (now - count.last < WINDOW_MS) {
      if (count.attempts >= MAX_REQUESTS) {
        return res.status(429).json({
          success: false,
          message: "Please wait a moment before trying again.",
        });
      }
      count.attempts++;
    } else {
      requestCounts.set(key, { last: now, attempts: 1 });
    }
  } else {
    requestCounts.set(key, { last: now, attempts: 1 });
  }

  next();
}

module.exports = { rateLimiter };
