const bodyParser = require('body-parser');
const express = require('express');
const path = require("path");
require('dotenv').config();
var cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./queries');

app.use(cors())
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static('client/build'));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.post('/users', db.createUser);
app.delete('/users', db.deleteUser);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
