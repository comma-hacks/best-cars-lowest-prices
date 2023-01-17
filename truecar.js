const fs = require('fs');
const util = require('util');

const checkIfFileExists = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function getFileContent(filename, promise) {
  try {
    const fileExists = await checkIfFileExists(filename);
    if (fileExists) {
      let data = await readFile(filename, 'utf8');
      return JSON.parse(data.toString());
    } else {
      const promiseResult = await (await promise()).json()
      await writeFile(filename, JSON.stringify(promiseResult, null, 4));
      return promiseResult;
    }
  } catch (err) {
    console.error(err);
  }
}

let makes = null
async function getMakes() {
  if (makes) return makes.data.makes
  makes = await getFileContent('truecar-makes.json', ()=> fetch("https://www.truecar.com/abp/api/graphql/", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "apollographql-client-name": "abp-frontend",
      "authorization-mode": "consumer",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "cookie": "tcip=172.58.20.121; flag-abt-search-on-homepage=challenger1; flag-abt-ev-incentives-lp=true; flag-trade-partner=true; tc_v=b5208f16-e4e6-4cc8-9530-2dc9c25320dc; _abp_auth_s=lAr0StgIlcgJUBusIuMPrm3IiByq4ygzXOilQBH0hR4; _abp_auth_p=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5Zjk5NDc3MC1mZjkzLTQwNzctOTEzOS1kZjIxNDljNGJhYTkiLCJpYXQiOjE2NzM5NDU0MDUsImV4cCI6MTY4OTk0NTQwNSwianRpIjoiMWNjNjkzNTktY2FkOS00MWYxLWEwMTQtYWM1NWQxYjVmYjYwIiwiYXV0aGVudGljYXRlZCI6ZmFsc2UsInByZXNldCI6eyJhZmZpbGlhdGlvbnMiOltdfSwiYXVkIjoiaHR0cHM6Ly93d3cudHJ1ZWNhci5jb20ifQ; referrer=ZTC0000000; flag-abt-showroom-vdp-conversion=control2; flag-abt-true-car-plus-global-nav-removal=control2; flag-abt-plus-landing-page-refresh=true; flag-abt-save-comparison-test=false; u=rBEAAmPGYT0adAASTJSaAg==; tealium_test_field=Test_C; cookieConsent=true; user_zip_code_anaheim-ca=92804; capselaPreferredPostalCode=92804; utag_main=v_id:0185beebb403000fff08152449130506f001806701328$_sn:1$_se:37$_ss:0$_st:1673948647824$ses_id:1673945396235%3Bexp-session$_pn:3%3Bexp-session$dc_visit:1$dc_event:28%3Bexp-session",
      "Referer": "https://www.truecar.com/used-cars-for-sale/",
      "Referrer-Policy": "no-referrer-when-downgrade"
    },
    "body": "{\"operationName\":\"usedLanding\",\"variables\":{},\"query\":\"query usedLanding {\\n  makes(active: USED_INVENTORY) {\\n    id\\n    name\\n    slug\\n    logo {\\n      url\\n      __typename\\n    }\\n    __typename\\n  }\\n  seoLists {\\n    popularCities {\\n      items {\\n        name\\n        usedInventory {\\n          routeParams\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  listingSearch(filters: {condition: USED}) {\\n    totalCount\\n    __typename\\n  }\\n}\\n\"}",
    "method": "POST"
  }))
  return makes.data.makes
}

let models = {}
async function getModels(makeSlug) {
  if (models[makeSlug]) return models[makeSlug].data.models.nodes
  models[makeSlug] = await getFileContent('truecar-models-'+makeSlug+'.json', ()=> fetch("https://www.truecar.com/abp/api/graphql/", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "apollographql-client-name": "abp-frontend",
      "authorization-mode": "consumer",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "cookie": "tcip=172.58.20.121; flag-abt-search-on-homepage=challenger1; flag-abt-ev-incentives-lp=true; flag-trade-partner=true; tc_v=b5208f16-e4e6-4cc8-9530-2dc9c25320dc; _abp_auth_s=lAr0StgIlcgJUBusIuMPrm3IiByq4ygzXOilQBH0hR4; _abp_auth_p=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5Zjk5NDc3MC1mZjkzLTQwNzctOTEzOS1kZjIxNDljNGJhYTkiLCJpYXQiOjE2NzM5NDU0MDUsImV4cCI6MTY4OTk0NTQwNSwianRpIjoiMWNjNjkzNTktY2FkOS00MWYxLWEwMTQtYWM1NWQxYjVmYjYwIiwiYXV0aGVudGljYXRlZCI6ZmFsc2UsInByZXNldCI6eyJhZmZpbGlhdGlvbnMiOltdfSwiYXVkIjoiaHR0cHM6Ly93d3cudHJ1ZWNhci5jb20ifQ; referrer=ZTC0000000; flag-abt-showroom-vdp-conversion=control2; flag-abt-true-car-plus-global-nav-removal=control2; flag-abt-plus-landing-page-refresh=true; flag-abt-save-comparison-test=false; u=rBEAAmPGYT0adAASTJSaAg==; tealium_test_field=Test_C; cookieConsent=true; user_zip_code_anaheim-ca=92804; capselaPreferredPostalCode=92804; utag_main=v_id:0185beebb403000fff08152449130506f001806701328$_sn:1$_se:40$_ss:0$_st:1673948915451$ses_id:1673945396235%3Bexp-session$_pn:4%3Bexp-session$dc_visit:1$dc_event:30%3Bexp-session",
      "Referer": "https://www.truecar.com/used-cars-for-sale/",
      "Referrer-Policy": "no-referrer-when-downgrade"
    },
    "body": "{\"operationName\":\"makeModelSelectorModels\",\"variables\":{\"makeSlug\":\""+makeSlug+"\"},\"query\":\"query makeModelSelectorModels($makeSlug: String!) {\\n  models(makeSlug: [$makeSlug], active: USED_INVENTORY, yearDescriptor: LATEST) {\\n    nodes {\\n      id\\n      name\\n      slug\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}",
    "method": "POST"
  }))
  return models[makeSlug].data.models.nodes
}

let offers = {}
async function getOffers(makeSlug, modelSlug) {
  let slug = makeSlug+'-'+modelSlug;
  if (offers[slug]) return offers[slug].data.listingSearch.edges
  offers[slug] = await getFileContent('truecar-offers-'+slug+'.json', ()=> fetch("https://www.truecar.com/abp/api/graphql/", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "apollographql-client-name": "abp-frontend",
      "authorization-mode": "consumer",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "cookie": "tcip=172.58.20.121; flag-abt-search-on-homepage=challenger1; flag-abt-ev-incentives-lp=true; flag-trade-partner=true; tc_v=b5208f16-e4e6-4cc8-9530-2dc9c25320dc; _abp_auth_s=lAr0StgIlcgJUBusIuMPrm3IiByq4ygzXOilQBH0hR4; _abp_auth_p=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5Zjk5NDc3MC1mZjkzLTQwNzctOTEzOS1kZjIxNDljNGJhYTkiLCJpYXQiOjE2NzM5NDU0MDUsImV4cCI6MTY4OTk0NTQwNSwianRpIjoiMWNjNjkzNTktY2FkOS00MWYxLWEwMTQtYWM1NWQxYjVmYjYwIiwiYXV0aGVudGljYXRlZCI6ZmFsc2UsInByZXNldCI6eyJhZmZpbGlhdGlvbnMiOltdfSwiYXVkIjoiaHR0cHM6Ly93d3cudHJ1ZWNhci5jb20ifQ; referrer=ZTC0000000; flag-abt-showroom-vdp-conversion=control2; flag-abt-true-car-plus-global-nav-removal=control2; flag-abt-plus-landing-page-refresh=true; flag-abt-save-comparison-test=false; u=rBEAAmPGYT0adAASTJSaAg==; tealium_test_field=Test_C; cookieConsent=true; user_zip_code_anaheim-ca=92804; capselaPreferredPostalCode=92804; utag_main=v_id:0185beebb403000fff08152449130506f001806701328$_sn:1$_se:44$_ss:0$_st:1673950505578$ses_id:1673945396235%3Bexp-session$_pn:4%3Bexp-session$dc_visit:1$dc_event:34%3Bexp-session",
      "Referer": "https://www.truecar.com/used-cars-for-sale/",
      "Referrer-Policy": "no-referrer-when-downgrade"
    },
    "body": "{\"operationName\":\"getMarketplaceSearchChallenger\",\"variables\":{\"filters\":{\"withinRadius\":{\"postalCode\":\"92804\",\"distance\":75},\"condition\":\"USED\",\"makeSlug\":[\""+makeSlug+"\"],\"modelSlug\":[\""+modelSlug+"\"],\"fallbackStrategy\":\"SIMPLE\",\"excludeExpandedDelivery\":false},\"sort\":\"BEST_MATCH\",\"first\":30,\"offset\":0,\"galleryImagesCount\":5,\"includeSeoInventorySummaryAndBodyStyles\":true,\"includeSponsoredListings\":true},\"query\":\"query getMarketplaceSearchChallenger($filters: ListingSearchInput, $first: Int, $offset: Int, $sort: ListingsSort, $galleryImagesCount: Int, $includeSeoInventorySummaryAndBodyStyles: Boolean!, $includeSponsoredListings: Boolean!) {\\n  listingSearch(filters: $filters, first: $first, offset: $offset, sort: $sort, createEvent: true) {\\n    filters(includeZeros: true) {\\n      truecarPlus {\\n        options {\\n          count\\n          value\\n          __typename\\n        }\\n        __typename\\n      }\\n      years {\\n        min\\n        max\\n        __typename\\n      }\\n      price {\\n        min\\n        max\\n        __typename\\n      }\\n      __typename\\n    }\\n    seoAggs {\\n      price {\\n        min\\n        max\\n        __typename\\n      }\\n      year {\\n        min\\n        max\\n        __typename\\n      }\\n      bodyStyles {\\n        label\\n        value\\n        count\\n        __typename\\n      }\\n      fuelTypes {\\n        label\\n        value\\n        count\\n        __typename\\n      }\\n      cabTypes {\\n        label\\n        value\\n        count\\n        __typename\\n      }\\n      transmissions {\\n        label\\n        value\\n        count\\n        __typename\\n      }\\n      popularFeatures {\\n        label\\n        value\\n        count\\n        __typename\\n      }\\n      trims {\\n        label\\n        count\\n        avgPrice\\n        __typename\\n      }\\n      years {\\n        edges {\\n          cursor\\n          node {\\n            minPrice\\n            year\\n            excellentPrice\\n            accidentFree\\n            count\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      mileage @include(if: $includeSeoInventorySummaryAndBodyStyles) {\\n        min\\n        max\\n        __typename\\n      }\\n      onlineOnlyDealers @include(if: $includeSeoInventorySummaryAndBodyStyles)\\n      __typename\\n    }\\n    edges {\\n      cursor\\n      node {\\n        vehicle {\\n          vin\\n          condition\\n          make {\\n            slug\\n            name\\n            id\\n            __typename\\n          }\\n          model {\\n            slug\\n            name\\n            id\\n            __typename\\n          }\\n          style {\\n            id\\n            trim {\\n              name\\n              slug\\n              id\\n              __typename\\n            }\\n            name\\n            driveType {\\n              id\\n              acronym\\n              name\\n              __typename\\n            }\\n            __typename\\n          }\\n          year\\n          certifiedPreOwned\\n          mileage\\n          exteriorColorV2 {\\n            __typename\\n            ... on GenericColor {\\n              genericName\\n              name\\n              __typename\\n            }\\n            ... on VehicleColor {\\n              id\\n              genericName\\n              name\\n              __typename\\n            }\\n          }\\n          interiorColorV2 {\\n            __typename\\n            ... on GenericColor {\\n              genericName\\n              name\\n              __typename\\n            }\\n            ... on VehicleColor {\\n              id\\n              genericName\\n              name\\n              __typename\\n            }\\n          }\\n          conditionHistory {\\n            ownerCount\\n            accidentCount\\n            isFleetCar\\n            __typename\\n          }\\n          mpg {\\n            city\\n            highway\\n            __typename\\n          }\\n          transmission\\n          engine\\n          fuelType\\n          bodyStyle\\n          __typename\\n        }\\n        id\\n        dealership {\\n          location {\\n            id\\n            geolocation {\\n              postalCode\\n              city\\n              state\\n              id\\n              __typename\\n            }\\n            __typename\\n          }\\n          databaseId\\n          id\\n          parentDealershipName\\n          __typename\\n        }\\n        isMultiLocation\\n        distanceRetailing\\n        tcplusEligible\\n        galleryImages(first: $galleryImagesCount) {\\n          nodes {\\n            url\\n            width\\n            metadata\\n            __typename\\n          }\\n          __typename\\n        }\\n        pricing {\\n          exclusion\\n          maapOverriddenAt\\n          listPrice\\n          priceBeforeDrop\\n          discountLabel\\n          deliveryFee\\n          transferFee {\\n            amount\\n            fromCity\\n            fromState\\n            distance\\n            __typename\\n          }\\n          totalMsrp\\n          subTotal\\n          __typename\\n        }\\n        consumerProspectedAt\\n        marketAnalysis {\\n          priceQuality\\n          marketAverageAnalysis {\\n            averageSaved\\n            averagePricePercentage\\n            averagePriceRange {\\n              min\\n              max\\n              __typename\\n            }\\n            averagePrice\\n            __typename\\n          }\\n          calloutDifferenceString\\n          calloutPriceSavings\\n          recentOfferAnalysis {\\n            averageSaved\\n            averagePricePercentage\\n            averagePrice\\n            transactionCount\\n            averagePricePercentageRange {\\n              min\\n              max\\n              __typename\\n            }\\n            __typename\\n          }\\n          __typename\\n        }\\n        precalculatedLease {\\n          totalMonthlyPayment\\n          disclaimer\\n          dueAtSigning\\n          mileage\\n          term\\n          __typename\\n        }\\n        precalculatedLoan {\\n          totalMonthlyPayment\\n          disclaimer\\n          downPayment\\n          term\\n          __typename\\n        }\\n        highlightedOptionsOrKeyFeatures\\n        __typename\\n      }\\n      hiddenListingsInfo {\\n        hasHiddenListings\\n        hiddenListingsKey\\n        hiddenListingCount\\n        __typename\\n      }\\n      distance {\\n        miles\\n        __typename\\n      }\\n      __typename\\n    }\\n    displayNames {\\n      make {\\n        name\\n        __typename\\n      }\\n      model {\\n        name\\n        __typename\\n      }\\n      bodyStyle {\\n        name\\n        __typename\\n      }\\n      trim {\\n        name\\n        __typename\\n      }\\n      __typename\\n    }\\n    isFallback\\n    totalCount\\n    sponsoredListings @include(if: $includeSponsoredListings) {\\n      cursor\\n      node {\\n        vehicle {\\n          vin\\n          condition\\n          make {\\n            id\\n            slug\\n            name\\n            __typename\\n          }\\n          model {\\n            id\\n            slug\\n            name\\n            __typename\\n          }\\n          style {\\n            id\\n            trim {\\n              id\\n              name\\n              __typename\\n            }\\n            name\\n            driveType {\\n              id\\n              acronym\\n              __typename\\n            }\\n            __typename\\n          }\\n          year\\n          certifiedPreOwned\\n          mileage\\n          exteriorColorV2 {\\n            __typename\\n            ... on GenericColor {\\n              genericName\\n              name\\n              __typename\\n            }\\n            ... on VehicleColor {\\n              id\\n              genericName\\n              name\\n              __typename\\n            }\\n          }\\n          interiorColorV2 {\\n            __typename\\n            ... on GenericColor {\\n              genericName\\n              name\\n              __typename\\n            }\\n            ... on VehicleColor {\\n              id\\n              genericName\\n              name\\n              __typename\\n            }\\n          }\\n          conditionHistory {\\n            ownerCount\\n            accidentCount\\n            isFleetCar\\n            __typename\\n          }\\n          mpg {\\n            city\\n            highway\\n            __typename\\n          }\\n          transmission\\n          engine\\n          __typename\\n        }\\n        id\\n        isMultiLocation\\n        distanceRetailing\\n        dealership {\\n          databaseId\\n          location {\\n            id\\n            geolocation {\\n              id\\n              city\\n              state\\n              postalCode\\n              __typename\\n            }\\n            __typename\\n          }\\n          id\\n          parentDealershipName\\n          __typename\\n        }\\n        tcplusEligible\\n        galleryImages(first: $galleryImagesCount) {\\n          nodes {\\n            url\\n            width\\n            metadata\\n            __typename\\n          }\\n          __typename\\n        }\\n        pricing {\\n          exclusion\\n          maapOverriddenAt\\n          listPrice\\n          priceBeforeDrop\\n          discountLabel\\n          deliveryFee\\n          transferFee {\\n            amount\\n            fromCity\\n            fromState\\n            distance\\n            __typename\\n          }\\n          totalMsrp\\n          subTotal\\n          __typename\\n        }\\n        consumerProspectedAt\\n        marketAnalysis {\\n          priceQuality\\n          marketAverageAnalysis {\\n            averageSaved\\n            averagePricePercentage\\n            averagePriceRange {\\n              min\\n              max\\n              __typename\\n            }\\n            averagePrice\\n            __typename\\n          }\\n          calloutDifferenceString\\n          calloutPriceSavings\\n          recentOfferAnalysis {\\n            averageSaved\\n            averagePricePercentage\\n            averagePrice\\n            transactionCount\\n            averagePricePercentageRange {\\n              min\\n              max\\n              __typename\\n            }\\n            __typename\\n          }\\n          __typename\\n        }\\n        precalculatedLease {\\n          totalMonthlyPayment\\n          disclaimer\\n          dueAtSigning\\n          mileage\\n          term\\n          __typename\\n        }\\n        precalculatedLoan {\\n          totalMonthlyPayment\\n          disclaimer\\n          downPayment\\n          term\\n          __typename\\n        }\\n        highlightedOptionsOrKeyFeatures\\n        __typename\\n      }\\n      hiddenListingsInfo {\\n        hasHiddenListings\\n        hiddenListingsKey\\n        hiddenListingCount\\n        __typename\\n      }\\n      distance {\\n        miles\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}",
    "method": "POST"
  }))
  return offers[slug].data.listingSearch.edges
}

module.exports = {
  getMakes, 
  getModels,
  getOffers
}