import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
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
                num: 5
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
            const $ = cheerio.load(data);
            $('style, script', 'img').remove();
            // Remove HTML comments
            $.root().contents().filter((i, el) => el.type === 'comment').remove();
            return $('body').text().replace(/\n\s*\n/g, '\n');
        });
        res.json(texts);

    } catch (error) {
        res.send(error);
    }
});

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);