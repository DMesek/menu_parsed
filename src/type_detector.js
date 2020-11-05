const dateRegex = /^\d{1,2}[./]\d{1,2}[./]\d{4}$/;

const isInt = input => typeof input == 'number' && !input.toString().includes('.');
const isFloat = input => typeof input == 'number' && input.toString().includes('.');
const isDate = date => date.match(dateRegex) != null;

function detect(data) {
    let type = 'text';
    if (isInt(data)) type = 'integer';
    else if (isFloat(data)) type = 'float';
    else if (isDate(data)) type = 'datetime';
    return type;
}

module.exports.detect = detect;




