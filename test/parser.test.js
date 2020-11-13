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
        expect(result.attributes.dataBeginAtRowIndex).toBe(expectedRowStart);
        expect(result.attributes.dataBeginAtColIndex).toBe(expectedColumnStart);
        expect(result.attributes.dataEndsAtRowIndex).toBe(expectedRowEnd);
        expect(result.attributes.dataEndsAtColIndex).toBe(expectedColumnEnd);
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

function testCommonMonth(sheet, expected) {
    const result = parser.parseSheet(sheet);
    test(`should return common month fields: ${expected}`, () => {
        expect(result.attributes.columns.map(c => c.month).toString()).toBe(expected);
    });
}

function testCommonYear(sheet, expected) {
    const result = parser.parseSheet(sheet);
    test(`should return common year fields: ${expected}`, () => {
        expect(result.attributes.columns.map(c => c.year).toString()).toBe(expected);
    });
}

function testCommonDatePattern(sheet, expected) {
    const result = parser.parseSheet(sheet);
    test(`should return common date pattern fields: ${expected}`, () => {
        expect(result.attributes.columns.map(c => c.dateTimeFormat).toString()).toBe(expected);
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
    testCommonMonth(sheet, ',,,1,2,3,4,5,6,7,8,9,10,11,12');
    testCommonYear(sheet, ',,,' + (Array(12).fill('2020')).toString());
    testCommonDatePattern(sheet, ',,,' + Array(12).fill('YYYY-MM').toString());
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
    testDataType(sheet, 'integer,text,text,text,text,text,float,float,text,text,text,text,text,text,text,text,text,datetime')
    testDataContext(sheet, 'values,' + Array(5).fill('identifier').concat(Array(2).fill('values').concat(Array(9).fill('identifier'))).toString() + ',values');
    testCommonMonth(sheet, ',,,,,,,,,,,,,,,,,'); //no common year/month detected
    testCommonYear(sheet, ',,,,,,,,,,,,,,,,,2019');
    testCommonDatePattern(sheet, ',,,,,,,,,,,,,,,,,DD.MM.YYYY');
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
    testDataType(sheet, 'text,datetime,float,text,integer,text,float,float,integer');
    testCommonMonth(sheet, ',01,,,,,,,');
    testCommonYear(sheet, ',2020,,,,,,,');
    testCommonDatePattern(sheet, ',YYYY.MM.DD,,,,,,,');
});

describe('parser test for data/GLoutput.xlsx sheet1', () => {
    const sheet = convertToUnifiedFormat('data/GLoutput.xlsx')[0];

    testSkipRows(sheet, '');
    testSkipColumns(sheet, '');
    testDataSpan({
        sheet: sheet, expectedRowStart: 0, expectedRowEnd: 48,
        expectedColumnStart: 0, expectedColumnEnd: 14,
    })
    testHeaderTitle(sheet, 'Konto,Datum,Partner,Naziv partnera,Datum računa (org.),Dospijeće,Mjesto troška,' +
        'Naziv mjesta troška,Opis knjiženja,Vezni broj,Valuta,Temeljnica,Duguje,Potražuje,Saldo');
    testHeaderType(sheet, Array(15).fill('text').toString());
    testDataType(sheet, 'integer,datetime,text,text,datetime,datetime,text,text,text,text,text,text,float,float,float');
    testCommonMonth(sheet, ',9,,,,,,,,,,,,,');
    testCommonYear(sheet, ',2020,,,2020,2020,,,,,,,,,');
    testCommonDatePattern(sheet, ',DD/MM/YYYY,,,DD/MM/YYYY,DD/MM/YYYY,,,,,,,,,');
});


describe('parser test for data/nekafirmapozicije.xls sheet2', () => {
    const sheet = convertToUnifiedFormat('data/nekafirmapozicije.xls')[1];

    testSkipRows(sheet, '0');
    testSkipColumns(sheet, '');
    testDataSpan({
        sheet: sheet, expectedRowStart: 1, expectedRowEnd: 35,
        expectedColumnStart: 0, expectedColumnEnd: 9,
    })
    testHeaderTitle(sheet, 'unknown,2015.,2016.,% prom. 16./15.,2017.,% prom. 17./16.,2018.,% prom. 18./17.,2019.,% prom. 19./18.');
    testHeaderType(sheet, 'text,datetime,datetime,text,datetime,text,datetime,text,datetime,text');
    testCommonYear(sheet, ',2015,2016,,2017,,2018,,2019,');
    testCommonMonth(sheet, ',,,,,,,,,');
    testCommonDatePattern(sheet, ',YYYY,YYYY,,YYYY,,YYYY,,YYYY,')
});

describe('parser test for data/primjer2-doradjen-obasheeta.xlsx sheet2', () => {
    const sheet = convertToUnifiedFormat('data/primjer2-doradjen-obasheeta.xlsx')[1];

    testSkipRows(sheet, '9,10,20,21,25,35');
    testSkipColumns(sheet, '');
    testDataSpan({
        sheet: sheet, expectedRowStart: 0, expectedRowEnd: 34,
        expectedColumnStart: 0, expectedColumnEnd: 15,
    })
    testHeaderTitle(sheet, 'Proizvod,Regija,Kanal,2020-1,2020-2,2020-3,' +
        '2020-4,2020-5,6,2020-7,2020-8,2020-9,2020-10,2020-11,2020-12,unknown');
    testHeaderType(sheet, 'text,text,text,datetime,datetime,datetime,datetime,datetime,text,' +
        'datetime,datetime,datetime,datetime,datetime,datetime,text');
    testDataType(sheet, Array(3).fill('text').concat(Array(12).fill('float')).toString() + ',text');
});

describe('parser test for data/primjer3.xlsx sheet2 (empty sheet)', () => {
    const sheet = convertToUnifiedFormat('data/primjer3.xlsx')[1];

    testSkipRows(sheet, '');
    testSkipColumns(sheet, '');
    testHasData(sheet, false);
});