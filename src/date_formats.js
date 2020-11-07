const DDMMYYYY = {
    regex: /^\d{1,2}([./-])(\d{1,2})[./-](\d{4})$/,
    pattern: ['DD', 'MM', 'YYYY'],
    monthIndex: 2,
    yearIndex: 3,
    splitIndex: 1,
}
const MMDDYYYY = {
    regex: /^(\d{1,2})([./-])\d{1,2}[./-](\d{4})$/,
    pattern: ['MM', 'DD', 'YYYY'],
    monthIndex: 1,
    yearIndex: 3,
    splitIndex: 2,
}
const YYYYMMDD = {
    regex: /^(\d{4})([./-])(\d{1,2})[./-]\d{1,2}$/,
    pattern: ['YYYY', 'MM', 'DD'],
    monthIndex: 3,
    yearIndex: 1,
    splitIndex: 2,
}

const YYYYMM = {
    regex: /^(\d{4})([./-])(\d{1,2})$/,
    pattern: ['YYYY', 'MM'],
    monthIndex: 3,
    yearIndex: 1,
    splitIndex: 2,
}

const MMYYYY = {
    regex: /^(\d{1,2})([./-])(\d{4})$/,
    pattern: ['MM', 'YYYY'],
    monthIndex: 1,
    yearIndex: 3,
    splitIndex: 2,
}

module.exports.supportedDataDateFormats = [DDMMYYYY, MMDDYYYY, YYYYMMDD];
module.exports.supportedHeaderDateFormats = [YYYYMM, MMYYYY];