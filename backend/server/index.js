import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
require('dotenv').config();
const app = express();
const PORT = 4000;

// bodyparser setup
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);