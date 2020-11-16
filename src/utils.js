const XLSX = require('xlsx');

function convertToUnifiedFormat(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetCount = workbook.SheetNames.length;

    const unifiedFormat = [];
    for (var i = 0; i < sheetCount; i++) {
        const sheet = workbook.Sheets[workbook.SheetNames[i]];
        const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, blankrows: true });
        const table = {
            name: workbook.SheetNames[i],
            data: aoa,
        };
        unifiedFormat.push(table);
        console.log(aoa);
    }
    return unifiedFormat;
}

module.exports.convertToUnifiedFormat = convertToUnifiedFormat;