const firebase = require("firebase/app");
require("firebase/firestore");

//TODO: your firebaseConfig
const firebaseConfig = {
    apiKey: "your_api_key",
    authDomain: "your_data",
    databaseURL: "your_data",
    projectId: "your_data",
    storageBucket: "your_data",
    messagingSenderId: "your_data",
    appId: "your_data",
    measurementId: "your_data"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const palatals = ['č', 'ć', 'đ', 'ž', 'š'];
const normalLetters = ['c', 'c', 'd', 'z', 's'];


module.exports.addToFirestore = async function (items, barId) {
    if (!(await doesBarExists(barId))) throw `Bar ${barId} does not exist! Plese create one here: https://console.firebase.google.com/u/0/project/site-afa05/firestore/data~2Fusers~2Fb041`;

    for (item of items) {
        await addCategory(item, barId);
        await addItem(item, barId);
        console.log(`Added ${item.toString}`);
    }
}

async function addCategory(category, barId) {
    const normalizedCategory = _normalizeCategoryId(category);


    try {
        await db.collection('coffe_shops')
            .doc(barId)
            .collection('categories')
            .doc(normalizedCategory)
            .update({
                name: category.categoryName,
                type: category.type == 'beverages' ? 0 : 1
            });
    } catch (categoryDoesNotExist) {
        await db.collection('coffe_shops')
            .doc(barId)
            .collection('categories')
            .doc(normalizedCategory)
            .set({
                name: category.categoryName,
                type: category.type == 'beverages' ? 0 : 1
            });
    }

}

function _normalizeCategoryId(category) {
    const lowercase = category.categoryName.toLowerCase();
    const words = lowercase.split(' ');
    var result = '';
    for (word of words) {
        result = result.concat(`${word}_`);
    }
    for (var i = 0; i < palatals.length; i++) {
        result = result.replace(palatals[i], normalLetters[i]);
    }
    return result.slice(0, -1);
}

async function addItem(item, barId) {
    await db.collection('coffe_shops')
        .doc(barId)
        .collection('categories')
        .doc(_normalizeCategoryId(item))
        .collection(item.type)
        .doc(item.name['hr'])
        .set({
            name: item.name,
            price: item.price,
            timestamp: item.timestamp,
            description: item.description,
            imageUrl: item.imageUrl,
            amount: item.amount,
            barId: barId
        });
}

async function doesBarExists(barId) {
    const doc = await db.collection('users').doc(barId).get();
    if (doc.exists) return true;
    return false;
}