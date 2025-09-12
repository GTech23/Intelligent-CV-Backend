import express from 'express';
import { config } from 'dotenv';
import connectDB from './src/config/db.js';
config()
const PORT = process.env.PORT

const app = express();
await connectDB();

app.listen(PORT, () => {
    console.log(`Server connected to http://${process.env.BASE_URL}/${PORT}`)
})