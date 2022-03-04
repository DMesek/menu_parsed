const XLSX = require('xlsx');

function convertToUnifiedFormat(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetCount = workbook.SheetNames.length;

    const unifiedFormat = [];
    for (var i = 0; i < sheetCount; i++) {
        const sheet = workbook.Sheets[workbook.SheetNames[i]];
        const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, blankrows: true });
        unifiedFormat.push({
            data: aoa.filter(r => r.length != 0),
            language: workbook.SheetNames[i]
        });
    }
    return unifiedFormat;
}

module.exports.convertToUnifiedFormat = convertToUnifiedFormat;