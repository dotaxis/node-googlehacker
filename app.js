var fs = require('fs');
var axios = require('axios');
var cheerio = require('cheerio');

url = 'http://www.exploit-db.com/google-hacking-database/';
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:59.0) Gecko/20100101 Firefox/59.0',
    'Accept': 'text/html'
}; // set user agent for exploit-db
var dorks = getDorks(25); // will attempt to grab 25 google dorks

function getNumDorks() {
// this function attempts to find the first link in the Google Hacking DB,
// which should give us the highest ID, so we can just loop through the rest of them
// using the link we found as the top end of our array :)

    axios.get(url, headers).then((response) => {
        var $ = cheerio.load(response.data);

        $('tbody', '.category-list').children().first().each((i, elm) => {
            var link = $(elm).find('a').attr('href');
            var id = link.split('/')[4];

            return getDorks(id); //
        });
    }).catch((e) => {
        console.log(e.code);
    });
}

function getDorks(num) {
    fs.writeFile('dorks.txt', '', (error) => {
        if (error) {
            console.log(`Error: ${error}`);
        }
    });
    for (i = 2; i <= num; i++) { // google hacking database starts at ID #2
        axios.get(`http://www.exploit-db.com/ghdb/${i}`, headers).then((response) => {
            var $ = cheerio.load(response.data);

            var dork = $('tbody', '.category-list').children().find('a.external').text();
            console.log(dork);
            fs.appendFileSync('dorks.txt', dork.trim() + '\n', (error) => {
                if (error) {
                    console.log(`Error: ${error}`);
                } else {
                    console.log('?');
                }
            });
        }).catch((e) => {
            if (e.code === 'ETIMEDOUT') {
                console.log('Operation timed out. Our IP may have been blacklisted! :o');
                process.exit(1); // I have mixed feelings about this but don't know how else to break the loop
            }
        });
    }
}
