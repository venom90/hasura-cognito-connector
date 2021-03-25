// Initialize
require('./initialize');

const express = require('express');
const app = express();
const port = process.env.PORT || 3008;

// Bodyparser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Include routes
require('./routes')(app);

// Listen on port
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});