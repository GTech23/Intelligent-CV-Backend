import express from "express";
import cors from "cors";
import { config } from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import path from "path";
import url from "url";

config();

const PORT = process.env.PORT;

import authRouter from "./src/routes/Auth.js";
import resumeRouter from "./src/routes/Resume.js";
import templateRouter from "./src/routes/Templates.js";
import corsOptions from "./src/config/corsConfig.js";
import aiRouter from "./src/routes/Gemini.js";
import rateLimiter, { downloadLimiter } from "./src/middlewares/rateLimiter.js";
const app = express();
await connectDB();

app.use(cors(corsOptions));

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// global middlewares
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(rateLimiter());
app.use(downloadLimiter());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
// routes
app.get("/", (req, res) => {
  res.send(`<h3>Welcome to Intelligent CV Backend</h3>`);
});

app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/template", templateRouter);
app.use("/api/ai", aiRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server connected to ${process.env.BASE_URL}:${PORT}`);
});
