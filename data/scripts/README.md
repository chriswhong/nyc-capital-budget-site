Use pdftotext on the command line to turn the capital commitment plan pdf into text.

The command for a single pdf looks like:
`pdftotext -fixed 5.3 -layout ccp-10-18a.pdf ccp-10-18a.txt`

Use `sh pdf-to-text.sh ../ccp-10-18/pdf` to process a whole directory of pdfs, which will make a corresponding txt file for each in `/txt` under the same directory



5.3 seems to be the magic number to get the output txt to have predictable and uniform columns on each lines

run  `node scrape ../ccp-10-18/txt`

There seems to be an anomaly on the last page of the pdf where the 3-digit number next to a commit `001` is only two digits.  The leading zero was filled in manually to make sure this data was included in the output.


Import to DB
`mongoimport --uri {MONGO_URI} --jsonArray --collection ccp-10-18 --file ../data/ccp-10-18a.json`
