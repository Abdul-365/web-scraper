import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
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
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: process.env.CS_API_KEY,
                cx: process.env.CX,
                q: req.query.q
            },
        });
        const searchResults = response.data;
        const links = searchResults.items.slice(0, 5).map(item => item.link);
        res.json(links);
        // const links = [
        //     "https://en.wikipedia.org/wiki/Banana",
        // ]

        // axios.get('https://app.scrapingbee.com/api/v1', {
        //     params: {
        //         'api_key': '5IM18AO798PYGG3NLF6FMNRDZZ4532QH8GDNATJZXH99I90YK0L0VH3HFGTOU5OK16TX3B16JTQJA7TL',
        //         'url': 'http://httpbin.scrapingbee.com/anything?json',
        //     }
        // }).then(function (response) {
        //     console.log(response);
        // })
    } catch (error) {
        res.send(error);
    }
});

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);