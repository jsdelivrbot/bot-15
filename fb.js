/*
* AUTHOR: @marinamcculloch
*
* FUNCTIONALITY: INITIALISE FIREBASE DATABASE
*
* */

var exports = module.exports = {};
var db;

initialiseFirebaseDB = function () {
    var admin = require('firebase-admin');

    var serviceAccount = require('../../onboardapp/app/serviceAccount/on-boarding-5d949.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://on-boarding-5d949.firebaseio.com'
    });

    db = admin.database();
    exports.db = db;



}

initialiseFirebaseDB();





