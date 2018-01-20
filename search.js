const fs = require('fs');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const LineByLine = require('line-by-line'),
    lr = new LineByLine('dorks.txt', {skipEmptyLines: true});

var dorks = [];

// reset links.txt when we start script. I should change this later.
fs.writeFile('links.txt', '', (error) => {
    if (error) return console.log(error);
    else console.log('Wiped links.txt');
});

// error handling
lr.on('error', function (err) {
	console.log(err);
});

// push each line to dorks array
lr.on('line', function (line) {
    dorks.push(line);
    console.log(`[+] Loaded dork:  ${line}`);
});


lr.on('end', async function () {
    console.log(`[*] Loaded ${dorks.length+1} dorks. Let's begin.`);
    console.log(`[*] I'll hang here for a while so be patient. We need over 9000 Chromium threads to get this done.`);
    for (var i = 0; i < dorks.length; i++) {
        const browser = await puppeteer.launch({timeout: 10000});
        const page = await browser.newPage();
        try {
            await page.goto('https://www.google.com/search?num=100&q=' + dorks[i]);
            let content = await page.content();
            if (content.includes("Our systems have detected unusual traffic from your computer network.")) {
                console.log(`We got CAPTCHA'd. -_-`);
                process.exit();
            }
            var $ = cheerio.load(content);

            $('h3.r').each(async function(i, element){
                console.log('Found h3 with r class');
                var href = $(element).find('a').attr('href');
                await fs.appendFile('links.txt', href + '\n', (error) => {
                    if (error) console.log(error);
                    else console.log(`Added ${url} to links.txt`);
                });
            });
        } catch (e) { console.log(e); }
        browser.close();
    }
});
