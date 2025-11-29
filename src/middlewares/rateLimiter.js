import rateLimit from "express-rate-limit";

const rateLimiter = () => {
  return rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000,
    legacyHeaders: false,
    standardHeaders: true,
    message: `Too many request, please try again later`,
  });
};

export const downloadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 2,
  message: {
    success: false,
    message:
      "You can only download a resume 2 times per day. Please try again tomorrow.  ",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 2,
  message: {
    success: false,
    message:
      "You can only request password reset 2 times per day. Please try again tomorrow.  ",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export default rateLimiter;
