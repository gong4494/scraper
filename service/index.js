const express = require('express')
const axios = require('axios'); 
const cheerio = require('cheerio'); 

const app = express()
const port = 3000

app.get('/', (req, res) => {

 
    axios.get('https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html') 
        .then(({ data }) => { 
            const $ = cheerio.load(data); 
    
            const bulletins = $('#recent_bulletins') 
                .map((_, product) => { 
                    const $product = $(product); 
                    return $product.text() 
                }) 
                .toArray(); 
            console.log(bulletins) 
            res.send(`${bulletins}`)
        });
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})