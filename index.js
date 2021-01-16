const express = require('express');
const app = express();
const port = 5000;
var url = 'mongodb://wkdgywls03:ronharry23@192.249.18.247:27017/?authSource=test&readPreference=primary&appname=MongoDB%20Compass&ssl=false';

const mongoose = require('mongoose');
mongoose.connect(url,{useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false
}).then( () => console.log('Mongo DB connnect...'))
  .catch(err => console.log(err));


app.get('/users',(req,res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))