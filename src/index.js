const { addToFirestore } = require("./firebase_interactor.js");
const { parseMenu } = require("./sheet_parser.js");
const { convertToUnifiedFormat } = require("./utils.js");

const fileIndex = 0;
const barIdIndex = 1;

const exitWithMessage = function(message) {
	console.log(message);
	process.exit(1);
}

const myArgs = process.argv.slice(2);
if (myArgs.length < barIdIndex + 1) 
	exitWithMessage("Wrong number of arguments.\nExample: node index.js data/primjer1.xlsx birtija");

const filePath = myArgs[fileIndex];
const barId = myArgs[barIdIndex];

const unifiedData = convertToUnifiedFormat(filePath);

if (!areSupportedLanguages(unifiedData.map(d => d.language))) 
	exitWithMessage('Unsupported language provided. Supported languages: hr, en, de, it.');
let items = parseMenu(unifiedData);
addToFirestore(items, barId).then(function() {
	console.log("All done!");
	process.exit(0);
}).catch(error => {
	exitWithMessage(error);
});

function areSupportedLanguages(languages) {
	for (language of languages) {
		if (language != 'hr' && language != 'en' && language != 'de' && language != 'it')
		return false;
	}
	return true;
}