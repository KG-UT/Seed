const log = console.log;

const express = require("express");

const path = require("path");

// starting the express server
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  log(`Listening on port ${port}...`);
});


// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// express-session for dealing with user sessions
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

/***********************************************************/
//				SESSION HANDLNG
/***********************************************************/
app.use(
  session({
    secret: "oursecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10800000, // 3 hours
      httpOnly: true
    }
  })
);


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


let userCollectionRef = db.collection('users');

/**************** user Routes ***************/


/**** LOGIN/LOGOUT *****/

// login user (Creates user if they don't already exist)
app.post("/api/login", (req, res) => {
  
    const username = req.body.username
    req.session.username = username

    userCollectionRef.doc(username)
    .set({user: username})
    .catch(error => {
        res.status(500).send(error);
    });
  });

// logout
app.get("/api/logout", (req, res) => {
  
    req.session.destroy(error => {
      if (error) {
        res.status(500).send(error);
      } else {
          log('logged out successfully')
      }
    });
  });


/******* Virtual Credit Card ******/  
// make a transaction
app.post("/api/card", (req, res) => {
    const username = req.session.username
    const item = req.body.item
    const price = req.body.price

    const userTransactionRef = userRef.doc(username).collection('transactions')
    userTransactionRef.add({
        item: item,
        price: price
    }).then(transaction => {
        userBudgetRef = userRef.doc(username).collection('budget').doc(item)
        // if that item has a monthly budget, then add to the current spending on that item
        userBudgetRef.get().then(doc => {
          if (doc.exists) {
            const itemBudgetData = userBudgetRef.get().data()
            // donate money to charity if we are already over cap
            if (itemBudgetData.monthlySpending >= itemBudgetData.monthlyCap){
              userTransactionRef.add({
                item: itemBudgetData.charity,
                price: itemBudgetData.charityDonation*price
              }).catch(error => {"error donating money to charity"})
            }
            // update monthly spending on that item
            userBudgetRef.set({
              monthlySpending: itemBudgetData.monthlySpending + price
            }).catch(error => {"error updating monthly spending"})
          }
        })

    }).catch(error => {
        res.status(500).send(error);
    });
  });

// get all the user's transactions
app.get("/api/card", (req, res) => {
    username = req.session.username

    const userTransactionRef = userRef.doc(username).collection('transactions')
    res.send(userTransactionRef.get().data())
  });


/***** Budget and charity tax ******/

// Create or update a budget + impose "charity tax"
app.post("/api/budget/create", (req, res) => {
  const username = req.session.username
  const item = req.body.item
  const monthlyBudget = req.body.monthlyBudget
  const charity = req.body.charity
  const charityDonation = req.body.charityDonation

  const userBudgetRef = userRef.doc(username).collection('budget')
  userBudgetRef.doc(item).set({
    monthlyBudget: monthlyBudget,
    charity: charity,
    charityDonation: charityDonation
  })
});

/****** Get all charity payments ******/
app.get("/api/charity", (req, res) => {
  const username = req.session.username
  const userTransactions = userRef.doc(username).collection('transactions').get()
  let charity
  let totalPaid
  const charityPayments = [];

  const userCharities = userRef.doc('testUser').collection('charities').select('charity').get()
  userCharities.foreach(documentSnapshot => {
    charity = documentSnapshot.data().charity
    totalPaid = 0

    userTransactions.foreach(transactionSnapshot => {
      if (charity == transactionSnapshot.data().item){
        totalPaid = totalPaid + transactionSnapshot.data().price
      }
    })
    
    charityPayments.push({charity: charity, totalDonated: totalPaid})
  })
  res.send(charityPayments)
});


/******* Add a charity ******/
app.post("/api/charity", (req, res) => {
  const username = req.session.username
  const userCharitiesRef = userRef.doc(username).collection('charities')
  const charity = req.body.charity
  userCharitiesRef.add({
    charity: charity
  })
});
