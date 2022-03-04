class Item {
    constructor(type, categoryName, name, price, amount, description, timestamp, language) {
      this.type = type;
      this.categoryName = categoryName;
      this.name = this.defaultMap(name);
      this.price = price;
      this.amount = amount != undefined ? amount : '';
      this.description = this.defaultMap(description);
      this.timestamp = timestamp;
      this.imageUrl = '';
      this.name[language] = name;
      this.description[language] = description != undefined ? description : '';
      this.checkArgumentsValidity();
      this.normalizeType();
    }

    get toString() {
        return this.name['hr'];
    }

    defaultMap(description) {
        return {
            hr: description != undefined ? description : '',
            de: description != undefined ? description : '',
            en: description != undefined ? description : '',
            it: description != undefined ? description : ''
        }
    }

    normalizeType() {
        if (this.type.toLowerCase() == 'hrana') this.type = 'food';
        else if (['pice', 'piće'].includes(this.type.toLowerCase())) this.type = 'beverages';
    }

    checkArgumentsValidity() {
        if (!['hrana', 'pice', 'piće'].includes(this.type.toLowerCase())) exitWithMessage(`Unknown type: ${this.type}`);
        if (this.categoryName == undefined) exitWithMessage('Category name cannot be undefined!');
        if (this.name == undefined) exitWithMessage('Name cannot be undefined!');
        if (this.price == undefined) exitWithMessage('Price cannot be undefined!');
    }
  }

  module.exports = Item;