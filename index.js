const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
res.send('Hello World!')
})


//server
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wthiz.mongodb.net/vengari?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const VengariCollection = client.db("vengari").collection("products");
 

  app.post('/addProduct',(req, res)=> {
    const newProduct =req.body;
    VengariCollection.insertOne(newProduct)

    .then(result => {
      console.log('inserted ', result.insertedCount)
      res.send(res.insertedCount > 0)
    })
  })


  app.get('/products', (req, res) => {
    VengariCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.delete('/delete/:id' , (req, res)=> {
    VengariCollection.deleteOne({_id: ObjectID(req.params.id)})
    .then((result) =>{
      console.log(result);
    })
  })

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})