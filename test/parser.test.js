const parser = require("../src/parser");
const { convertToUnifiedFormat } = require("../src/utils.js");

function testSkipRowsColumns(sheet, expected, desc) {
    test(`should return [${expected}] ${desc} for sheet`, () => {
        const result = parser.parseSheet(sheet);
        if (desc == 'skiprows')
            expect(result.attributes.skiprows.toString()).toBe(expected);
        else if (desc == 'skipcolumns')
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

describe('parser test for data/primjer.xlsx sheet1', () => {
    const sheet = convertToUnifiedFormat('data/primjer.xlsx')[0];

    testSkipRowsColumns(sheet, '0,1,2', 'skiprows');
    testSkipRowsColumns(sheet, '15,16', 'skipcolumns');
    testDataSpan({
        sheet: sheet, expectedRowStart: 3, expectedRowEnd: 33,
        expectedColumnStart: 0, expectedColumnEnd: 14,
    })
});

describe('parser test for data/primjer2.xlsx sheet2', () => {
    const sheet = convertToUnifiedFormat('data/primjer2.xlsx')[1];

    testSkipRowsColumns(sheet, '9,10,20,21,35', 'skiprows');
    testSkipRowsColumns(sheet, '15', 'skipcolumns');
    testDataSpan({
        sheet: sheet, expectedRowStart: 0, expectedRowEnd: 34,
        expectedColumnStart: 0, expectedColumnEnd: 14,
    })
});

describe('parser test for data/primjer3.xlsx sheet1', () => {
    const sheet = convertToUnifiedFormat('data/primjer3.xlsx')[0];

    testSkipRowsColumns(sheet, '', 'skiprows');
    testSkipRowsColumns(sheet, '', 'skipcolumns');
    testDataSpan({
        sheet: sheet, expectedRowStart: 0, expectedRowEnd: 748,
        expectedColumnStart: 0, expectedColumnEnd: 17,
    })
});

describe('parser test for data/primjer4.xlsx sheet1', () => {
    const sheet = convertToUnifiedFormat('data/primjer4.xlsx')[0];

    testSkipRowsColumns(sheet, '31', 'skiprows');
    testSkipRowsColumns(sheet, '', 'skipcolumns');
    testDataSpan({
        sheet: sheet, expectedRowStart: 0, expectedRowEnd: 30,
        expectedColumnStart: 0, expectedColumnEnd: 8,
    })
});