const google = require('google');
const fs = require('fs');
const LineByLine = require('line-by-line'),
    lr = new LineByLine('dorks.txt', {skipEmptyLines: true});
google.resultsPerPage = 25;
var nextCounter = 0;
var maxPages = 4;
dorks = [];
links = [];
// this splits up 100 results into 4 pages which is probably better than trying to
// grab them all on one page

// reset links.txt when we start script. I should change this later.
fs.writeFile('links.txt', '', (error) => {
    if (error) return console.log(error);
    else console.log('Wiped links.txt');
});



lr.on('error', function (err) {
	console.log(err);
});

lr.on('line', function (line) {
    lr.pause();
	setTimeout(() => {
        dorks.push(line);
        console.log(`[+] Read dork:  ${line}`);
        lr.resume();
    }, 100); //this is sloppy but it should be enough time to push to the array?
});

lr.on('end', function () {
    for (var i = 0; i < dorks.length; i++) {
        google(dorks[i], (error, response) => {
            if(!error) {
                for (var l = 0; l < response.links.length; l++) {
                    links.push(response.links[l].link);
                }

                if (nextCounter < 4) {
                    nextCounter += 1;
                    if (response.next) response.next();
                } else {
                    return saveLinks(links);
                }
            }

            if (error.message.includes('Error on response (503)')) {
                console.log('Error 503: Busted');
                console.log('Try getting a new IP.');
                process.exit(1); //this again? It works, though..
            } else {
                console.log('Error handling sucks here so if you want to dig through it, uncomment the next line');
                //console.log(error.message);
                process.exit(1);
            }


        });
    }
});

function saveLinks(links) {
    for (var i = 0; i < links.length; i++) {
        fs.appendFile('links.txt', links[i], (error) => {
            if (error) console.log(error);
            else console.log(`Added ${links[i]} to files.txt`);
        })
    }
    console.log('All done! Check links.txt for potential victims.');
}
