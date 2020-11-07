const parser = require("../src/parser");
const { convertToUnifiedFormat } = require("../src/utils.js");

function testSkipRows(sheet, expected) {
    test(`should return [${expected}] skiprows for sheet`, () => {
        const result = parser.parseSheet(sheet);
        expect(result.attributes.skiprows.toString()).toBe(expected);
    });
}

function testSkipColumns(sheet, expected) {
    test(`should return [${expected}] skipcolumns for sheet`, () => {
        const result = parser.parseSheet(sheet);
        expect(result.attributes.skipcolumns.toString()).toBe(expected);
    });
}

function testDataSpan({ sheet, expectedRowStart, expectedRowEnd, expectedColumnStart, expectedColumnEnd, }) {
    const result = parser.parseSheet(sheet);
    test(`data span should be rows: ${expectedRowStart} - ${expectedRowEnd}, 
            columns: ${expectedColumnStart} - ${expectedColumnEnd}`, () => {
        expect(result.attributes.dataSpan.dataBeginAtRowIndex).toBe(expectedRowStart);
        expect(result.attributes.dataSpan.dataBeginAtColIndex).toBe(expectedColumnStart);
        expect(result.attributes.dataSpan.dataEndsAtRowIndex).toBe(expectedRowEnd);
        expect(result.attributes.dataSpan.dataEndsAtColIndex).toBe(expectedColumnEnd);
    });
}

function testHasData(sheet, expected) {
    const result = parser.parseSheet(sheet);
    test(`hasData should be ${expected}`, () => {
        expect(result.attributes.hasData).toBe(expected);
    });
}

function testHeaderTitle(sheet, expected) {
    const result = parser.parseSheet(sheet);
    test(`should return header titles: ${expected}`, () => {
        expect(result.attributes.columns.map(c => c.name).toString()).toBe(expected);
    });
}

function testHeaderType(sheet, expected) {
    const result = parser.parseSheet(sheet);
    test(`should return header types: ${expected}`, () => {
        expect(result.attributes.columns.map(c => c.headerType).toString()).toBe(expected);
    });
}

function testDataType(sheet, expected) {
    const result = parser.parseSheet(sheet);
    test(`should return data types: ${expected}`, () => {
        expect(result.attributes.columns.map(c => c.dataType).toString()).toBe(expected);
    });
}

function testDataContext(sheet, expected) {
    const result = parser.parseSheet(sheet);
    test(`should return context types: ${expected}`, () => {
        expect(result.attributes.columns.map(c => c.dataContext).toString()).toBe(expected);
    });
}

describe('parser test for data/primjer.xlsx sheet1', () => {
    const sheet = convertToUnifiedFormat('data/primjer.xlsx')[0];

    testSkipRows(sheet, '0,1,2');
    testSkipColumns(sheet, '15,16');
    testDataSpan({
        sheet: sheet, expectedRowStart: 3, expectedRowEnd: 33,
        expectedColumnStart: 0, expectedColumnEnd: 14,
    })
    testHeaderTitle(sheet, 'Proizvod,Regija,Kanal,2020-1,2020-2,2020-3,' +
        '2020-4,2020-5,2020-6,2020-7,2020-8,2020-9,2020-10,2020-11,2020-12');
    testHeaderType(sheet, Array(3).fill('text').concat(Array(12).fill('datetime')).toString());
    testDataType(sheet, Array(3).fill('text').concat(Array(12).fill('float')).toString());
    testDataContext(sheet, Array(3).fill('identifier').concat(Array(12).fill('values')).toString());
});

describe('parser test for data/primjer2.xlsx sheet2', () => {
    const sheet = convertToUnifiedFormat('data/primjer2.xlsx')[1];

    testSkipRows(sheet, '9,10,20,21,35');
    testSkipColumns(sheet, '15');
    testDataSpan({
        sheet: sheet, expectedRowStart: 0, expectedRowEnd: 34,
        expectedColumnStart: 0, expectedColumnEnd: 14,
    })
    testHeaderTitle(sheet, 'Proizvod,Regija,Kanal,2020-1,2020-2,2020-3,' +
        '2020-4,2020-5,6,2020-7,2020-8,2020-9,2020-10,2020-11,2020-12');
    testHeaderType(sheet, 'text,text,text,datetime,datetime,datetime,datetime,datetime,text,' +
        'datetime,datetime,datetime,datetime,datetime,datetime');
    testDataType(sheet, Array(3).fill('text').concat(Array(12).fill('float')).toString());
    testDataContext(sheet, Array(3).fill('identifier').concat(Array(12).fill('values')).toString());
});

describe('parser test for data/primjer3.xlsx sheet1', () => {
    const sheet = convertToUnifiedFormat('data/primjer3.xlsx')[0];

    testSkipRows(sheet, '');
    testSkipColumns(sheet, '');
    testDataSpan({
        sheet: sheet, expectedRowStart: 0, expectedRowEnd: 748,
        expectedColumnStart: 0, expectedColumnEnd: 17,
    })
    testHeaderTitle(sheet, 'Broj naloga,Naziv,Adresa, ulica i broj,Mjesto,Broj računa,Poziv na broj,' +
        'Isplata (Duguje),Uplata (Potražuje),Valuta,Hitno,IBAN ili broj računa,Poziv na broj,Naziv,Adresa, ulica i broj,' +
        'Mjesto,Šifra namjene,Opis plaćanja,Datum izvršenja');
    testHeaderType(sheet, Array(18).fill('text').toString());
    // should maybe change - first one integer?
    testDataType(sheet, 'text,text,text,text,text,text,float,integer,text,text,text,text,text,text,text,text,text,datetime')
    testDataContext(sheet, Array(6).fill('identifier').concat(Array(2).fill('values').concat(Array(9).fill('identifier'))).toString() + ',values');
});

describe('parser test for data/primjer4.xlsx sheet1', () => {
    const sheet = convertToUnifiedFormat('data/primjer4.xlsx')[0];

    testSkipRows(sheet, '31');
    testSkipColumns(sheet, '');
    testDataSpan({
        sheet: sheet, expectedRowStart: 0, expectedRowEnd: 30,
        expectedColumnStart: 0, expectedColumnEnd: 8,
    })
    testHeaderTitle(sheet, 'Partner,Datum,Sati,Opis,Tip posla,Zaposlenik,EUR po satu,TOTAL EUR,Nenaplatno');
    testHeaderType(sheet, Array(9).fill('text').toString());
    testHasData(sheet, true);
    testDataType(sheet, 'text,datetime,integer,text,integer,text,integer,integer,integer');
});

describe('parser test for data/primjer3.xlsx sheet2 (empty sheet)', () => {
    const sheet = convertToUnifiedFormat('data/primjer3.xlsx')[1];

    testSkipRows(sheet, '');
    testSkipColumns(sheet, '');
    testHasData(sheet, false);
});