import rateLimit from "express-rate-limit";

const rateLimiter = () => {

  return rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000,
    legacyHeaders: false,
    standardHeaders: true,
    message: `Too many request, please try again later`
  })
}
export default rateLimiter