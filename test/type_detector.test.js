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

