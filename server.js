import express from "express";
import cors from "cors";
import { config } from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import exphbs from "express-handlebars";
import path from "path";
import url from "url";
import cron from 'node-cron';
import https from 'https';

config();

const PORT = process.env.PORT;

import authRouter from "./src/routes/Auth.js";
import resumeRouter from "./src/routes/Resume.js";
import templateRouter from "./src/routes/Templates.js";
import corsOptions from "./src/config/corsConfig.js";
import aiRouter from "./src/routes/Gemini.js";
import rateLimiter from "./src/middlewares/rateLimiter.js";

const app = express();
await connectDB();

app.use(cors(corsOptions));

const hbs = exphbs.create({
  defaultLayout: false,
});
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// global middlewares
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(rateLimiter())
// app.use(logger);

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));
// routes
app.get("/", (req, res) => {
  res.send(`<h3>Welcome to Intelligent CV Backend</h3>`);
});

app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/template", templateRouter);
app.use("/api/ai",  aiRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
  next(err);
});

// Setup cron job to ping server every 14 minutes
cron.schedule('*/14 * * * *', () => {
  https.get(process.env.BASE_URL, (res) => {
    console.log('Server pinged successfully at:', new Date().toISOString());
  }).on('error', (err) => {
    console.error('Error pinging server:', err.message);
  });
});

app.listen(PORT, () => {
  console.log(`Server connected to ${process.env.BASE_URL}:${PORT}`);
  console.log('Cron job setup to ping server every 14 minutes');
});
