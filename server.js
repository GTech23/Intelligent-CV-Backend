import express from 'express';
import { config } from 'dotenv';
config()
const PORT = process.env.PORT

const app = express();

app.listen(PORT, () => {
    console.log(`Server connected to http://${process.env.BASE_URL}/${PORT}`)
})