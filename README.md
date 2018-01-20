# node-googlehacker
NodeJS project to scrape Google dorks from Exploit-DB and come back with a list of vulnerable websites from Google.

## Usage
```
python scrape.py
python search.py
```
Running both of these commands should populate dorks.txt with a list of Google Dorks
and links.txt with a list of potentionally vulnerable websites

## To Do
- Better error handling
- Switch to Headless Chrome using Puppeteer for Google Searching (reCAPTCHA is busting my balls)
