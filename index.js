const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('lodash');
const app = express()
const port = 3000

app.get('/', async (req, res) => {

    const webContent = await getBulletins();
    const $ = cheerio.load(webContent);

    const bulletins = $('.current')
        .map((index, element) => {
            return {
                link: $(element).find('a').text(),
                href: $(element).find('a').attr('href'),
            }
        })
        .toArray();
    console.log(bulletins)

    res.send(bulletins.map((bulletin) => {
        return `${bulletin.link} is available`
    }))
});

const getBulletins = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html')
            .then(function ({ data }) {
                console.log(data, 'data');
                resolve(data);
            })
            .catch(function (error) {
                resolve();
            });
    });
}
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})