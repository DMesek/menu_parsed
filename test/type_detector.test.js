const typeDetector = require("../src/type_detector");


describe('typeDetector.detectData', () => {
    test("should return 'integer' when an integer is passed", () => {
        expect(typeDetector.detectData(2).type).toBe('integer');
    });

    test("should return 'float' when a float is passed", () => {
        expect(typeDetector.detectData(2.2).type).toBe('float');
    });

    test("should return 'text' when a string is passed", () => {
        expect(typeDetector.detectData('im a string').type).toBe('text');
    });

    test("should return 'datetime' when 1.1.2021 passed", () => {
        expect(typeDetector.detectData('1.1.2021').type).toBe('datetime');
    });

    test("should return 'datetime' when 21.12.2021 passed", () => {
        expect(typeDetector.detectData('21.12.2021').type).toBe('datetime');
    });

    test("should return 'datetime' when 21/12/2021 passed", () => {
        expect(typeDetector.detectData('21/12/2021').type).toBe('datetime');
    });

});

describe('typeDetector.detectHeader', () => {
    test("should return 'text' when a string is passed", () => {
        expect(typeDetector.detectHeader('sth').type).toBe('text');
    });

    test("should return 'datetime' when '1-2020' is passed", () => {
        expect(typeDetector.detectHeader('1-2020').type).toBe('datetime');
    });

    test("should return 'text' when a '1' is passed", () => {
        expect(typeDetector.detectHeader('1').type).toBe('text');
    });
});

