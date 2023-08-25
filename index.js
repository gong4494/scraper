const express = require('express');
const axios = require('axios'); 
const cheerio = require('cheerio'); 
const _ = require('lodash');
const app = express()
const port = 3000

app.get('/', (req, res) => {

 
    axios.get('https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html') 
        .then(({ data }) => { 
            const $ = cheerio.load(data); 
    
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
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})