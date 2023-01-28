#!/bin/bash
set -euxo pipefail
cd $(dirname $0)
. $HOME/.asdf/asdf.sh
if ! hash node; then
  echo "Node not found"
  exit 1
fi
# Deletes cached data and pushes to github.
rm -f truecar-offers-* CARS.md
wget https://raw.githubusercontent.com/commaai/openpilot/master/docs/CARS.md
. update.sh
rm good-cars.csv
rm CARS.md.csv
git add .
git commit -m "$(date +'%D %r')"
git push origin master
