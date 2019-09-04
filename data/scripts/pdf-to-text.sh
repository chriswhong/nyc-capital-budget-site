#!/bin/bash
cd $1
mkdir -p ../txt
for file in *; do
  filename="${file%.*}"
  pdftotext -fixed 5.3 -layout $file ../txt/$filename.txt
done
