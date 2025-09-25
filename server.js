import express from "express";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import { logger } from "./src/middlewares/logger.js";
import exphbs from "express-handlebars";
import path from "path";
import url from "url";

config();
const PORT = process.env.PORT;

import authRouter from "./src/routes/Auth.js";
import resumeRouter from "./src/routes/Resume.js";
import templateRouter from "./src/routes/Templates.js";

const app = express();
await connectDB();

const hbs = exphbs.create({
  defaultLayout: false,
});
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// global middlewares
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(logger);

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));
// routes
app.get("/", (req, res) => {
  res.send(`
            <h3>Welcome to Intelligent CV Backend</h3>
            <p>Visit our  <a href=""> documentation site </a> to know more about the project, and consume our API </p>
        
        `);
});
app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/template", templateRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server connected to ${process.env.BASE_URL}:${PORT}`);
});
