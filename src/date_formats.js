const DDMMYYYY = {
    regex: /^(\d{1,2})([./-])(\d{1,2})[./-](\d{4})[./-]{0,1}$/,
    pattern: ['DD', 'MM', 'YYYY'],
    monthIndex: 3,
    yearIndex: 4,
    dayIndex: 1,
    splitIndex: 2,
}
const MMDDYYYY = {
    regex: /^(\d{1,2})([./-])(\d{1,2})[./-](\d{4})[./-]{0,1}$/,
    pattern: ['MM', 'DD', 'YYYY'],
    monthIndex: 1,
    dayIndex: 3,
    yearIndex: 4,
    splitIndex: 2,
}
const YYYYMMDD = {
    regex: /^(\d{4})([./-])(\d{1,2})[./-](\d{1,2})[./-]{0,1}$/,
    pattern: ['YYYY', 'MM', 'DD'],
    monthIndex: 3,
    yearIndex: 1,
    splitIndex: 2,
    dayIndex: 4,
}

const YYYYMM = {
    regex: /^(\d{4})([./-])(\d{1,2})[./-]{0,1}$/,
    pattern: ['YYYY', 'MM'],
    monthIndex: 3,
    yearIndex: 1,
    splitIndex: 2,
}

const MMYYYY = {
    regex: /^(\d{1,2})([./-])(\d{4})[./-]{0,1}$/,
    pattern: ['MM', 'YYYY'],
    monthIndex: 1,
    yearIndex: 3,
    splitIndex: 2,
}

const YYYY = {
    regex: /^(\d{4})/,
    pattern: ['YYYY'],
    yearIndex: 1,
}

const daysFirstSupportedFormats = [DDMMYYYY, YYYYMMDD, MMDDYYYY];
const monthsFirstSupportedFormats = [MMDDYYYY, YYYYMMDD, DDMMYYYY];

let currentSupportedFormats = daysFirstSupportedFormats;

module.exports.supportedDataDateFormats = currentSupportedFormats;
module.exports.supportedHeaderDateFormats = [YYYYMM, MMYYYY, YYYY];

module.exports.daysFirstFormats = daysFirstSupportedFormats
module.exports.monthsFirstFormats = monthsFirstSupportedFormats

module.exports.changeFormatPriority = function (format) {
    currentSupportedFormats = format;
}