const typeDetector = require("./type_detector");
const dateFormats = require("./date_formats");

/***************************
CONSTANTS
****************************/

const skipRowFactor = 0.25;
const skipColumnFactor = 0.04;

/***************************
EXPORT
****************************/

module.exports.parseSheet = function (sheet) {
	const attributes = new Attributes(sheet);
	if (!attributes.hasData) return { attributes, sheet };

	const rowInfo = getRowInfo(sheet);
	const skipcolumns = detectSkipColumns(sheet, rowInfo.maxRowLength);
	const dataSpan = detectDataSpan({
		maxColumnIndex: rowInfo.maxRowLength,
		maxRowIndex: sheet.data.length,
		skiprows: rowInfo.skiprows,
		skipcolumns: skipcolumns
	});
	attributes.dataBeginAtRowIndex = dataSpan.dataBeginAtRowIndex;
	attributes.dataBeginAtColIndex = dataSpan.dataBeginAtColIndex;
	attributes.dataEndsAtRowIndex = dataSpan.dataEndsAtRowIndex;
	attributes.dataEndsAtColIndex = dataSpan.dataEndsAtColIndex;
	attributes.skiprows = rowInfo.skiprows;
	attributes.skipcolumns = skipcolumns;
	attributes.columns = collectColumnDescriptions(sheet, dataSpan);
	return { attributes, sheet };
}

/***************************
FUNCTIONS
****************************/

function getRowInfo(sheet) {
	const skiprows = [];
	let maxRowLength = 0;
	for (var rowIndex = 0; rowIndex < sheet.data.length; rowIndex++) {
		const row = sheet.data[rowIndex];
		if (row.length > maxRowLength) maxRowLength = row.length;
		if (isSkipRow(row, maxRowLength)) skiprows.push(rowIndex);
	}
	return {
		skiprows: skiprows,
		maxRowLength: maxRowLength,
	}
}

function detectSkipColumns(sheet, maxRowLength) {
	let skipcolumns = [];
	for (var columnIndex = 0; columnIndex < maxRowLength; columnIndex++) {
		let definedCount = 0;
		for (var rowIndex = 0; rowIndex < sheet.data.length; rowIndex++) {
			if (sheet.data[rowIndex][columnIndex] != undefined) definedCount++;
		}
		if (definedCount < sheet.data.length * skipColumnFactor) skipcolumns.push(columnIndex);
	}
	return skipcolumns;
}

function detectDataSpan({ maxColumnIndex, maxRowIndex, skiprows, skipcolumns }) {
	let beginRow = 0, beginColumn = 0, endRow = maxRowIndex - 1, endColumn = maxColumnIndex - 1;
	while (skiprows.includes(beginRow)) beginRow++;
	while (skipcolumns.includes(beginColumn)) beginColumn++;
	while (skiprows.includes(endRow)) endRow--;
	while (skipcolumns.includes(endColumn)) endColumn--;
	return {
		dataBeginAtRowIndex: beginRow,
		dataBeginAtColIndex: beginColumn,
		dataEndsAtRowIndex: endRow,
		dataEndsAtColIndex: endColumn,
	};
}

function parseColumn(sheet, columnIndex, startDataRowIndex, dataEndRowIndex) {
	let tableCell;
	const columnDescription = new ColumnDescription();
	for (var rowIndex = startDataRowIndex; rowIndex <= dataEndRowIndex; rowIndex++) {
		tableCell = sheet.data[rowIndex][columnIndex];
		if (tableCell == undefined) continue;
		columnDescription.dataType = typeDetector.detectData(tableCell);
		if (columnDescription.dataType == 'integer') continue;
		if (columnDescription.dataType != 'datetime') break;

		const dateDetails = typeDetector.getDateDetails(tableCell);
		if (rowIndex == startDataRowIndex) {
			columnDescription.year = dateDetails.year;
			columnDescription.month = dateDetails.month;
			columnDescription.dateTimeFormat = dateDetails.dateTimeFormat;
		}
		if (columnDescription.year != dateDetails.year) columnDescription.year = null;
		if (columnDescription.month != dateDetails.month) columnDescription.month = null;
		if (columnDescription.dateTimeFormat != dateDetails.dateTimeFormat) {
			dateFormats.changeFormatPriority();
			return parseColumn(sheet, columnIndex, startDataRowIndex, dataEndRowIndex);
		}
	}
	return columnDescription;
}

function collectColumnDescriptions(sheet, dataSpan) {
	const columnDescriptions = [];
	let columnDetails;
	for (var columnIndex = dataSpan.dataBeginAtColIndex; columnIndex <= dataSpan.dataEndsAtColIndex; columnIndex++) {
		columnDetails = parseColumn(sheet, columnIndex, dataSpan.dataBeginAtRowIndex + 1, dataSpan.dataEndsAtRowIndex);

		let title = sheet.data[dataSpan.dataBeginAtRowIndex][columnIndex];
		columnDetails.name = title != undefined ? title : 'unknown';
		columnDetails.dataContext = columnDetails.dataType == 'text' ? 'identifier' : 'values';

		columnDetails.headerType = typeDetector.detectHeader(columnDetails.name);
		if (columnDetails.headerType == 'datetime') {
			const dateDetails = typeDetector.getDateDetails(columnDetails.name);
			columnDetails.year = dateDetails.year;
			columnDetails.month = dateDetails.month;
			columnDetails.dateTimeFormat = dateDetails.dateTimeFormat;
		}
		columnDescriptions.push(columnDetails);
	}
	return columnDescriptions;
}

const getDefinedCount = row => row.filter(value => value != undefined).length;
const isSkipRow = (row, maxRowLength) => (getDefinedCount(row) == 0 || getDefinedCount(row) < skipRowFactor * maxRowLength);


function Attributes(sheet) {
	this.hasData = sheet.data.length > 0;
	this.columns = [];
	this.skiprows = [];
	this.skipcolumns = [];
	this.dataBeginAtRowIndex = -1;
	this.dataBeginAtColIndex = -1;
	this.dataEndsAtRowIndex = -1;
	this.dataEndsAtColIndex = -1;
}

function ColumnDescription() {
	this.name = '';
	this.dataType = '';
	this.headerType = '';
	this.dataContext = '';
	this.year = null;
	this.month = null;
	this.dateTimeFormat = null;
}


