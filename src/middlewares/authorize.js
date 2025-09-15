import jwt from "jsonwebtoken";

export default function authorizeAuth(req, res, next) {
  const header = req.headers;
  const tokenHeader = header["authorization"];
  if (!tokenHeader)
    return res.status(401).json({ message: `Authorization header not sent` });

  if (!tokenHeader.includes("Bearer "))
    return res
      .status(400)
      .json({ message: `Indicate Bearer when sending token` });
  const token = tokenHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded)
    next();
  } catch (error) {
    res.status(400).json({ error, success: false });
  }
}
