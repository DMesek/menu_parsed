const dateFormats = require("./date_formats");

const isInt = input => checkIfNumber(input) && !input.includes('.');
const isFloat = input => checkIfNumber(input) && input.includes('.');

const isDataDate = function (data) {
    for (format of dateFormats.supportedDataDateFormats()) {
        if (data.toString().match(format.regex) != null) return true;
    }
    return false;
};
const isHeaderDate = function (data) {
    for (format of dateFormats.supportedHeaderDateFormats) {
        if (data.toString().match(format.regex) != null) return true;
    }
    return false;
};

function detectData(data) {
    let type = 'text';
    if (isDataDate(data)) type = 'datetime';
    else if (isInt(data)) type = 'integer';
    else if (isFloat(data)) type = 'float';
    return type;
}

function detectHeader(data) {
    let type = 'text';
    if (isHeaderDate(data)) type = 'datetime';
    return type;
}

function getDateDetails(data) {
    let match = null;
    const supportedFormats = dateFormats.supportedDataDateFormats().concat(dateFormats.supportedHeaderDateFormats);
    for (format of supportedFormats) {
        match = data.toString().match(format.regex);
        if (match == null) continue;

        const month = match[format.monthIndex];
        const day = match[format.dayIndex];

        if (month > 12 || day > 31) continue;
        return {
            year: match[format.yearIndex],
            month: month,
            dateTimeFormat: format.pattern.join(match[format.splitIndex]),
        };
    }
    return match;
}

function checkIfNumber(input) {
    for (let i = 0; i < input.length; i++) {
        if (i == 0 && input[i] == '-') continue;
        if ((input[i] >= '0' && input[i] <= '9')
            || input[i] == '.' || input[i] == ',') continue;
        else return false;
    }
    return true;
}

module.exports.detectData = detectData;
module.exports.detectHeader = detectHeader;
module.exports.getDateDetails = getDateDetails;




