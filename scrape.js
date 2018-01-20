const fs = require('fs');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

url = 'http://www.exploit-db.com/google-hacking-database/';


// wipe dorks.txt when we begin
fs.writeFile('dorks.txt', '', (error) => {
    if (error) {
        console.log(`Error: ${error}`);
    }
});


async function getNumDorks() {
// this function attempts to find the first link in the Google Hacking DB,
// which should give us the highest ID, so we can just loop through the rest of them
// using the link we found as the top end of our array :)
    try {
        const browser = await puppeteer.launch({timeout: 10000});
        const page = await browser.newPage();
         try {
             console.log('Loading page...');
             await page.goto('http://www.exploit-db.com/google-hacking-database/');
         } catch (e) {
             console.log(`Error: ${e}`);
             process.exit(1);
         }

        let content = await page.content();
        var $ = cheerio.load(content);
        $('tbody', '.category-list').children().first().each((i, elm) => {
            var link = $(elm).find('a').attr('href');
            var id = link.split('/')[4];
            console.log(`Found ${id-1} dorks to scrape! Let's begin.`);
            browser.close();
            return getDorks(id); //
        });
    } catch (error) {
        console.log(error);
    }
}

async function getDorks(num) {
    console.log(`Scraping ${num-1} dorks...`);
    try {
        for (i = 2; i <= num; i++) { // google hacking database starts at ID #2
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(`http://www.exploit-db.com/ghdb/${i}`);

            let content = await page.content();
            var $ = cheerio.load(content);

            var dork = $('tbody', '.category-list').children().find('a.external').text().trim();
            console.log(`[+] Added #${i-1}: ${dork}`);
            fs.appendFileSync('dorks.txt', dork + '\n', (error) => {
                if (error) {
                    console.log(`Error: ${error}`);
                } else {
                    console.log('?');
                }
            });
            browser.close();
        }
    } catch (error) {
        console.log(error);
    }
}

getNumDorks(); // begin!
