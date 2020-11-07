const dateFormats = require("./date_formats");

const isInt = input => typeof input == 'number' && !input.toString().includes('.');
const isFloat = input => typeof input == 'number' && input.toString().includes('.');
const isDataDate = function (data) {
    for (format of dateFormats.supportedDataDateFormats) {
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
    if (isInt(data)) type = 'integer';
    else if (isFloat(data)) type = 'float';
    else if (isDataDate(data)) type = 'datetime';
    return type;
}

function detectHeader(data) {
    let type = 'text';
    if (isHeaderDate(data)) type = 'datetime';
    return type;
}

function getDateDetails(data) {
    let match = null;
    for (format of dateFormats.supportedDataDateFormats) {
        match = data.toString().match(format.regex);
        if (match == null) continue;

        const sth = {
            year: match[format.yearIndex],
            month: match[format.monthIndex],
            dateTimeFormat: format.pattern.join(match[format.splitIndex]),
        };
        console.log(sth);
        return sth;
    }
    return match;
}

module.exports.detectData = detectData;
module.exports.detectHeader = detectHeader;
module.exports.getDateDetails = getDateDetails;




