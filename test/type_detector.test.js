const typeDetector = require("../src/type_detector");


describe('typeDetector.detectData', () => {
    test("should return 'integer' when an integer is passed", () => {
        expect(typeDetector.detectData(2)).toBe('integer');
    });

    test("should return 'float' when a float is passed", () => {
        expect(typeDetector.detectData(2.2)).toBe('float');
    });

    test("should return 'text' when a string is passed", () => {
        expect(typeDetector.detectData('im a string')).toBe('text');
    });

    test("should return type: 'datetime', year: 2021, month:1 when 1.1.2021 passed", () => {
        expect(typeDetector.detectData('1.1.2021')).toBe('datetime');
    });

    test("should return 'datetime' when 21.12.2021 passed", () => {
        expect(typeDetector.detectData('21.12.2021')).toBe('datetime');
    });

    test("should return 'datetime' when 21/12/2021 passed", () => {
        expect(typeDetector.detectData('21/12/2021')).toBe('datetime');
    });

});

describe('typeDetector.detectHeader', () => {
    test("should return 'text' when a string is passed", () => {
        expect(typeDetector.detectHeader('sth')).toBe('text');
    });

    test("should return 'datetime' when '1-2020' is passed", () => {
        expect(typeDetector.detectHeader('1-2020')).toBe('datetime');
    });

    test("should return 'text' when a '1' is passed", () => {
        expect(typeDetector.detectHeader('1')).toBe('text');
    });
});

describe('typeDetector.getDateDetails', () => {
    test("should return year: 1997, month: 4, dateFormat: DD.MM.YYYY when date 21.4.1997 is passed", () => {
        expect(typeDetector.getDateDetails('21.4.1997')).toStrictEqual({ year: '1997', month: '4', dateTimeFormat: 'DD.MM.YYYY', });
    });

    test("should return year: 1997, month: 04, dateFormat: MM/DD/YYYY when date 04/21/1997 is passed", () => {
        expect(typeDetector.getDateDetails('04/21/1997')).toStrictEqual({ year: '1997', month: '04', dateTimeFormat: 'MM/DD/YYYY', });
    });

    test("should return year: 1997, month: 4, dateFormat: YYYY/MM/DD when date 1997/4/21 is passed", () => {
        expect(typeDetector.getDateDetails('1997/4/21')).toStrictEqual({ year: '1997', month: '4', dateTimeFormat: 'YYYY/MM/DD', });
    });

    test("should return year: 1997, month: 4, dateFormat: YYYY/MM/DD when date 1997/4/21 is passed", () => {
        expect(typeDetector.getDateDetails('1997/4/21')).toStrictEqual({ year: '1997', month: '4', dateTimeFormat: 'YYYY/MM/DD', });
    });

    test("should return year: 1997, month: 4, dateFormat: YYYY-MM when date 1997-4 is passed", () => {
        expect(typeDetector.getDateDetails('1997-4')).toStrictEqual({ year: '1997', month: '4', dateTimeFormat: 'YYYY-MM', });
    });

    test("should return year: 1997, month: 04, dateFormat: MM/YYYY when date 04/1997 is passed", () => {
        expect(typeDetector.getDateDetails('04/1997')).toStrictEqual({ year: '1997', month: '04', dateTimeFormat: 'MM/YYYY', });
    });
});

