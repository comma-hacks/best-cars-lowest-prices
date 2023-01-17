const csv = require('csv-parser');
const fs = require('fs');
const ejs = require('ejs');
const util = require('util');
const truecar = require('./truecar');
const { marked } = require('marked');

function markdownToHtml(markdown) {
  return marked(markdown, {
    gfm: true
  });
}

let headers = null

async function parseCsv(filePath) {
  const data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', (headerList) => {
        headers = headerList;
      })
      .on('data', async (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function updateCar(row) {
  let makes = await truecar.getMakes()
  let make = makes.find(a=>a.name.toLowerCase().includes(row.Make.toLowerCase()))
  let models = await truecar.getModels(make.slug)
  let model = models.find(a=>row.Model.toLowerCase().includes(a.name.toLowerCase()))

  if (make && model) {
    let modelOffers = await truecar.getOffers(make.slug, model.slug)
    let matches = row.Model.match(/20(\d+)(?:-)?(\d+)?/)

    let yearMin, yearMax;

    let sYear1 = matches[1]
    yearMin = parseInt('20'+sYear1)
    let sYear2 = matches[2]
    
    if (sYear2) {
      yearMax = parseInt('20'+sYear2)  
    } else {
      yearMax = yearMin
    }

    let yearMatchOffers = []
  
    for (offer of modelOffers) {
      let year = offer.node.vehicle.year
      if (year >= yearMin && year <= yearMax) {
        yearMatchOffers.push(offer)
      }
    }

    console.log(row.Make, row.Model, yearMatchOffers.length)

    for (offer of yearMatchOffers) {

    }

    // process.exit(0)

    // row.Price = offers[0].node.pricing.listPrice
  }

  row['Steering Torque'] = markdownToHtml(row['Steering Torque'])
  row['Resume from stop'] = markdownToHtml(row['Resume from stop'])

  // console.log(row)

  return row;
}

(async () => {
  const cars = await parseCsv('good-cars.csv');
  for (car of cars) {
    await updateCar(car)
  }
  headers.unshift('Price')
  const data = { headers, cars: cars.filter(a=>a.Price) };
  const html = await util.promisify(ejs.renderFile)('index.ejs', data, {})
  await fs.promises.writeFile('index.html', html);
})();
