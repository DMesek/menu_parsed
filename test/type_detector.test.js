const typeDetector = require("../src/type_detector");


describe('typeDetector.detect', () => {
    test("should return 'integer' when an integer is passed", () => {
        expect(typeDetector.detectData(2)).toBe('integer');
    });

    test("should return 'float' when a float is passed", () => {
        expect(typeDetector.detectData(2.2)).toBe('float');
    });

    test("should return 'text' when a string is passed", () => {
        expect(typeDetector.detectData('im a string')).toBe('text');
    });

    test("should return 'datetime' when 1.1.2021 passed", () => {
        expect(typeDetector.detectData('1.1.2021')).toBe('datetime');
    });

    test("should return 'datetime' when 21.12.2021 passed", () => {
        expect(typeDetector.detectData('21.12.2021')).toBe('datetime');
    });

    test("should return 'datetime' when 21/12/2021 passed", () => {
        expect(typeDetector.detectData('21/12/2021')).toBe('datetime');
    });
});

