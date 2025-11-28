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

export const downloadLimiter = () => {
  return rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 3,
    legacyHeaders: false,
    standardHeaders: true,
    message: `You can only download a resume 3 times per day. Please try again tomorrow.`,
  });
};
export default rateLimiter;
