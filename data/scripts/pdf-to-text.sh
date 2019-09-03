#!/bin/bash
cd $1
for file in *; do
  filename="${file%.*}"
  pdftotext -fixed 5.3 -layout $file ../txt/$filename.txt
done
