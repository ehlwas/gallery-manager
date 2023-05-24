require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const router = require('./routes/router');

const app = express();

// Static Web Page
app.get('/', (_, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Form running on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error)
  })