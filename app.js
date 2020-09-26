const express = require("express");
const app = express();
const port = 5000;

var contact_me_routes = require('./routes/contact_me_routes');

app.use("/home", contact_me_routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/academic-experiences", (req, res) => {
  res.send("Academic Experiences");
});

app.get("/hobbies", (req, res) => {
  res.send("Academic Experiences");
});

app.get("/contact", (req, res) => {
  res.send("Contact");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

  