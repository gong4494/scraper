const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('lodash');

const CyclicDB = require('@cyclic.sh/dynamodb')
const db = CyclicDB('tame-mite-houndstoothCyclicDB')
const app = express()
const port = 3000

app.get('/', async (req, res) => {

    const webContent = await getBulletins();
    const $ = cheerio.load(webContent);

    const bulletins = $('.current')
        .map((index, element) => {
            return {
                text: $(element).find('a').text(),
                link: $(element).find('a').attr('href'),
            }
        })
        .toArray();
    await save(bulletins);
    const result = await getAll();
    console.log(`result: ${JSON.stringify(result, null, 2)}`)
    res.send(result)
});

const save = async (list) => {
    let bulletins = db.collection('bulletins')
    list.map(async (bulletin) => {
        let current = await bulletins.set(bulletin.text, {
            link: bulletin.link
        })
    })
}

const getAll = async () => {
    const items = await db.collection('bulletins').list()
    console.log("in get", JSON.stringify(items, null, 2))
    const itemDetails = []
    for(item of items.results){
        const detail = await db.collection('bulletins').get(item.key)
        itemDetails.push(detail)
    }
    return itemDetails
}


const getBulletins = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html')
            .then(function ({ data }) {
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