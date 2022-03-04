const Item = require('./item.js');

const typeIndex = 0;
const categoryNameIndex = 1;
const nameIndex = 2;
const priceIndex = 3;
const amountIndex = 4;
const descriptionIndex = 5;

module.exports.parseMenu = function(sheets) {
    if (!isHeaderValid(sheets[0].data[0])) 
        throw "Wrong header. The header should be: tip | kategorija | naziv | cijena | kolicina | opis";
    const items = parseInitialSheet(sheets[0].data, sheets[0].language);
    sheets.shift();
    for (sheet of sheets) {
        parseOtherLanguage(items, sheet.data, sheet.language);
    }
    return items;
}

const parseInitialSheet = function(sheet, language) {
    const items = [];
    let timestamp = 0;
    sheet.shift();
    for (row of sheet) {
        timestamp += 100;
        items.push(new Item(
            row[typeIndex],
            row[categoryNameIndex],
            row[nameIndex],
            row[priceIndex],
            row[amountIndex],
            row[descriptionIndex],
            timestamp,
            language
            ));
    }
    return items;
}

function parseOtherLanguage(items, sheet, language) {
    for (var i = 0; i < items.length; i++) {
        if (sheet[i+1] == undefined) continue;
        if (sheet[i+1][nameIndex] != undefined) items[i].name[language] = sheet[i+1][nameIndex];
        if (sheet[i+1][descriptionIndex] != undefined) items[i].description[language] = sheet[i+1][descriptionIndex];
    }
}

function isHeaderValid(header) {
    if (header[typeIndex].toLowerCase() != 'tip' ||
    header[categoryNameIndex].toLowerCase() != 'kategorija' || 
    header[nameIndex].toLowerCase() != 'naziv' ||
    header[priceIndex].toLowerCase() != 'cijena' ||
    (header[amountIndex].toLowerCase() != 'kolicina' && 
    header[categoryNameIndex].toLowerCase() != 'količina') || 
    header[descriptionIndex].toLowerCase() != 'opis') {
        return false;
    }
    return true;
}

function exitWithMessage(message) {
	console.log(message);
	process.exit(1);
}