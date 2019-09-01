Use pdftotext on the command line to turn the capital commitment plan pdf into text.

`pdftotext -fixed 5.3 -layout ccp-10-18a.pdf ccp-10-18a.txt`

5.3 seems to be the magic number to get the output txt to have predictable and uniform columns on each lines

run  `node scrape path-to-pdftotext-output.txt`

There seems to be an anomaly on the last page of the pdf where the 3-digit number next to a commit `001` is only two digits.  The leading zero was filled in manually to make sure this data was included in the output.
