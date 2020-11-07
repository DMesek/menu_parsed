const dataYearLastDateRegex = /^\d{1,2}[./-]\d{1,2}[./-]\d{4}$/;
const dataYearFirstDateRegex = /^\d{2,4}[./-]\d{1,2}[./-]\d{1,2}$/;

const headerDateRegex = /^\d{0,2}[./-]{0,1}\d{1,4}[./-]\d{1,4}$/;

const isInt = input => typeof input == 'number' && !input.toString().includes('.');
const isFloat = input => typeof input == 'number' && input.toString().includes('.');
const isDataDate = date => date.toString().match(dataYearLastDateRegex) != null ||
    date.toString().match(dataYearFirstDateRegex) != null
const isHeaderDate = date => date.toString().match(headerDateRegex) != null;

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

module.exports.detectData = detectData;
module.exports.detectHeader = detectHeader;




