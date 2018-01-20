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
    lr.pause();
	setTimeout(() => {
        dorks.push(line);
        console.log(`[+] Loaded dork:  ${line}`);
        lr.resume();
    }, 100); //this is sloppy but it should be enough time to push to the array?
});


lr.on('end', async function () {
    for (var i = 0; i < dorks.length; i++) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        try { await page.goto('https://www.google.com/search?num=100&q=' + dorks[i]); }
        catch (e) { console.log(e); }

        let content = await page.content();
        var $ = cheerio.load(content);
        $('h3.r').each(function(i, element){
            var href = $(element).find('a').attr('href');
            saveLink(href);
        });
        browser.close();
    }
});

function saveLink(url) {
    fs.appendFile('links.txt', url + '\n', (error) => {
        if (error) console.log(error);
        else console.log(`Added ${url} to links.txt`);
    });
}
