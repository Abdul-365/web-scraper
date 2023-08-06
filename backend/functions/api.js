import express from 'express';
import serverless from 'serverless-http';
import bodyparser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import { convert } from 'html-to-text';
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// bodyparser setup
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.get('/', async function (req, res) {

    try {
        let response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: process.env.CS_API_KEY,
                cx: process.env.CX,
                q: req.query.q,
                num: 1
            },
        });
        const searchResults = response.data;
        const links = searchResults.items.map(item => item.link);

        const responses = await Promise.all(
            links.map(link =>
                axios.get('https://app.scrapingbee.com/api/v1', {
                    params: {
                        'api_key': process.env.SB_API_KEY,
                        'url': link,
                        render_js: false
                    }
                })
            )
        );

        const texts = responses.map(({ data }) => {
            return convert(data);
        });
        res.send(texts);

    } catch (error) {
        res.send(error);
    }
});

exports.handler = serverless(app);