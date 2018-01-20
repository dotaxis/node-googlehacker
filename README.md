# node-googlehacker
NodeJS project to scrape Google dorks from Exploit-DB and come back with a list of vulnerable websites from Google. Uses Puppeteer for Headless Chrome to bypass captcha and other roadblocks faced when using request or axios.

**NOTE: Speed has been sacrificed in favour of functionality. Puppeteer should stop us from getting 503'd by Google or IP banned by Exploit-DB, so be patient.**

## Usage
- scrape.js
```
node scrape.js
```
Running scrape.js will take a LONG time. Please be patient and don't abuse the script.
It should only be run once to populate dorks.txt

After scrape.js populates the dorks.txt file, run search.js
```
node search.js
```
Check links.txt for output

## To Do
- Better error handling
- ????
