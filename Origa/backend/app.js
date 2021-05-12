var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb+srv://babu:test@babuk.p7n6q.mongodb.net/myFirstDatabase";
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var aggResult={};
const path = require('path');
const router = express.Router();



router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

router.get('/avgBillOrderCount', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myFirstDatabase = db.db("myFirstDatabase");
    myFirstDatabase.collection("User").aggregate([
      { "$lookup": {
        "from": "Order",
        "localField": "_id",
        "foreignField": "userId",
        "as": "orderDetails" },
      }, 
      { "$unwind": "$orderDetails" },
      { "$group": {
          "_id" : "$orderDetails.userId",
          "averageBillValue" : { "$avg": "$orderDetails.subtotal" },
          "noOfOrders" :{"$sum": 1} }
      }
    ]).toArray(function(err, dbres) {
      if (err) throw err;
      aggResult=dbres;
      res.send(JSON.stringify(dbres));
      db.close();
    });
  });
});

router.get('/updateInfo', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myFirstDatabase = db.db("myFirstDatabase");
    aggResult.forEach(element => {
      var query = { _id: element._id };
      var values = {$set: {noOfOrders:element.noOfOrders } };
      myFirstDatabase.collection("User").updateMany(query, values, function(err, dbres) {
        if (err) throw err;
        res.send({success: true, message :"Successfully updated"});
        db.close();
      });
    });
  });
});

router.get('/userInsert', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myFirstDatabase = db.db("myFirstDatabase");
    var myobj = [{name:'Rahul'},{name:'Ramesh'},{name:'Ankita'}];
    myFirstDatabase.collection("User").insertMany(myobj, function(err, dbres) {
      if (err) throw err;
      console.log("Number of documents inserted: " + dbres.insertedCount);
      db.close();
      res.send('<h1>successfully inserted the documents!</h1>');
    });
  });
});

router.get('/orderInsert', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myFirstDatabase = db.db("myFirstDatabase");
    var myobj = [
      {subtotal:500,  date:'23 January 2019', userId: ObjectId("6099b7d8f85dfd0b3a3d82bd")},
      {subtotal:400,  date:'16 March 2019',   userId: ObjectId("6099b7d8f85dfd0b3a3d82be")},
      {subtotal:150,  date:'20 March 2019',   userId: ObjectId("6099b7d8f85dfd0b3a3d82bd")},
      {subtotal:700,  date:'25 March 2019',   userId: ObjectId("6099b7d8f85dfd0b3a3d82bd")},
      {subtotal:200,  date:'21 Feb 2019',     userId: ObjectId("6099b7d8f85dfd0b3a3d82bf")},
      {subtotal:1500, date:'22 Feb 2019',     userId: ObjectId("6099b7d8f85dfd0b3a3d82bf")},
      {subtotal:1200, date:'16 April 2019',   userId: ObjectId("6099b7d8f85dfd0b3a3d82bd")},
      {subtotal:1600, date:'1 May 2019',      userId: ObjectId("6099b7d8f85dfd0b3a3d82be")},
      {subtotal:900,  date:'23 May 2019',     userId: ObjectId("6099b7d8f85dfd0b3a3d82be")},
      {subtotal:700,  date:'13 April 2019',   userId: ObjectId("6099b7d8f85dfd0b3a3d82bd")}
      ];
    myFirstDatabase.collection("Order").insertMany(myobj, function(err, dbres) {
      if (err) throw err;
      console.log("Number of documents inserted: " + dbres.insertedCount);
      res.send('<h1>successfully inserted the documents!</h1>');
      db.close();
    });
  });
});

router.get('*', function(req, res) {  
  res.send({success: false, message :"Endpoint does not exists!"}); 
});

app.use("/", router);
app.listen(process.env.port || 5000);
console.log("Running at Port 5000");
