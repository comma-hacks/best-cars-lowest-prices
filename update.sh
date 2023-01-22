#!/bin/bash
rm -f truecar-offers-* CARS.md
wget https://raw.githubusercontent.com/commaai/openpilot/master/docs/CARS.md
[ ! -d mdtable2csv ] && git clone git@github.com:BatuhanKucukali/mdtable2csv.git && pushd mdtable2csv && go build . && popd
./mdtable2csv/mdtable2csv convert CARS.md
cat CARS.md | grep 'Make|Model|' | sed 's/|/,/g' | cut -c2- | head -c -2 > good-cars.csv
echo >> good-cars.csv
cat CARS.md.csv | grep star-full | grep -v star-empty | grep 'openpilot,0 mph,0 mph,' | grep -v 'comma,body' >> good-cars.csv 
node process.js
rm good-cars.csv
rm CARS.md.csv
git add .
git commit -m "update"
git push origin master
