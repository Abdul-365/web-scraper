import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
const https = require('https');
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

// app.get('/', async function (req, res) {
//     try {
//         const response = await axios.get(
//             `https://www.googleapis.com/customsearch/v1?key=${process.env.API_KEY}&cx=${process.env.CX}&q=${req.query.q}`
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.send(error);
//     }
// })

function getSearchResults(options) {

    return new Promise((resolve, reject) => {
        https.get(options, response => {
            let data = '';

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on('error', error => {
            reject(error);
        });
    });
}

app.get('/', async function (req, res) {

    try {
        const options = {
            hostname: 'www.googleapis.com',
            path: `/customsearch/v1?key=${process.env.API_KEY}&cx=${process.env.CX}&q=${req.query.q}`
        };
        const searchResults = await getSearchResults(options);
        const links = searchResults.items.slice(0, 5).map(item => item.link);
        res.json(links);
    } catch (error) {
        res.send(error);
    }
});



app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);