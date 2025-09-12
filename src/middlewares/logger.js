import fs from "fs/promises";
import url from "url";
import path from "path";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function logger(req, res, next) {
  const log = `${new Date().toISOString()} - ${req.method} - ${
    req.originalUrl
  }\n`;
  try {
    await fs.appendFile(path.join(__dirname, "../logs/server.log"), log);
  } catch (e) {
    console.error("Failed to write log:", e);
  }
  next();
}
