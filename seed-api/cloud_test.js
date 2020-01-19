const log = console.log;

const express = require("express");

const path = require("path");

// starting the express server
const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  log(`Listening on port ${port}...`);
});

/*********** DATABASE SETUP  ****************/

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products to be used
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyDDUxozwkzhQIxeKi--jYTwTPNztnPmFvk",
    authDomain: "seed-1964d.firebaseapp.com",
    databaseURL: "https://seed-1964d.firebaseio.com",
    projectId: "seed-1964d",
    storageBucket: "seed-1964d.appspot.com",
    messagingSenderId: "376075131031",
    appId: "1:376075131031:web:161ddb90726dd264b571d2",
    measurementId: "G-JG26075MMK"
  };
  
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

// initialize an instance of cloud firestore 
const admin = require('firebase-admin');

let serviceAccount = require('./seed-1964d-e268a739dfe5');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

/******  test addition and stuff ******/
let userRef = db.collection('users');



/************ Initial items put in database, just for testing **********/
/************ consider these as the Schema ********/
user = userRef.doc('testUser').set({user: 'testUser'})
let userCharitiesRef = userRef.doc('testUser').collection('charities')
userCharity = userCharitiesRef.add({charity: "Sick kids"})

let userBudgetRef = userRef.doc('testUser').collection('budget')
userBudget = userBudgetRef.doc("bubble tea").set({
    monthlySpending: 17,
    monthlyCap: 20,
    charity: "Sick kids",
    charityDonation: 0.05
})

let userTransactionRef = userRef.doc('testUser').collection('transactions')
userTransaction1 = userTransactionRef.add({
    item: "bubble tea",
    price: 5
})
