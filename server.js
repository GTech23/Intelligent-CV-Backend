import express from "express";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import { logger } from "./src/middlewares/logger.js";

config();
const PORT = process.env.PORT;

import authRouter from "./src/routes/Auth.js";
import resumeRouter from "./src/routes/Resume.js";

const app = express();
await connectDB();

// global middlewares
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(logger);

// routes
app.get("/", (req, res) => {
  res.send(`
            <h3>Welcome to Intelligent CV Backend</h3>
            <p>Visit our  <a href=""> documentation site </a> to know more about the project, and consume our API </p>
        
        `);
});
app.use("/api/auth", authRouter);
app.use('/api/resume', resumeRouter)
app.listen(PORT, () => {
  console.log(`Server connected to ${process.env.BASE_URL}/${PORT}`);
});
