const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const admin = require('firebase-admin');
require('dotenv').config()
const serviceAccount = require("./configs/webgenesis-burj-al-arab-firebase-adminsdk-2jvot-15138e1e8a.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://Burj-Al-Arab.firebaseio.com'
  });
app.use(cors());
app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.42gqz.mongodb.net/Burj-Al-Arab?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const bookings = client.db("Burj-Al-Arab").collection("Bookings");
//  Store Data in Database 
  app.post('/addBooking', (req, res) =>{
      const newBooking = req.body;
      bookings.insertOne(newBooking)
      .then(result => {
          res.send(result.insertedCount > 0);
      })
  })



  //    read data and Make a api
  app.get('/bookings', (req, res) => {
      const bearer = req.headers.authorization;
        if(bearer && bearer.startsWith('Bearer ')){
          const idToken = bearer.split(' ')[1];
        // idToken comes from the client app
            admin.auth().verifyIdToken(idToken)
            .then((decodedToken) => {
            const tokenEmail = decodedToken.email;
            const queryEmail = req.query.email;
            if(tokenEmail == queryEmail){
                bookings.find({email: req.query.email})
                .toArray((err, document) => {
                    res.status(200).send(document)
                })
            }else{
                res.status(401).send('Un Authorized Access')
            }
            })
            .catch((error) => {
                res.status(401).send('Un Authorized Access')
            });
      }else{
        res.status(401).send('Un Authorized Access')
      }  
  })
});
app.listen(4000, () => {
  console.log('login success')
})