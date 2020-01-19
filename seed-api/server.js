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


// login user
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

// make purchases for credit card

app.post("/api/card", (req, res) => {
    

    userCollectionRef.doc(username)
    .set({user: username})
    .catch(error => {
        res.status(500).send(error);
    });
  });
