if (process.env.NODE_ENV !== 'production') {require('dotenv').config()}
const assert = require("assert");

const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

const cors = require("cors");
app.use(cors());

const MongoClient = require("mongodb").MongoClient;

// Serve the static files from the React app
const path = require("path");
app.use(express.static(path.join(__dirname, "client/build")));

//create new MongoClient with options
const client = new MongoClient(process.env.URI, {
	useNewUrlParser: true,
	poolSize: process.env.POOL_SIZE,
	useUnifiedTopology: true,
});

//connect client (must be done before using client to access DB)
client.connect((err) => {
  if (err) {
    console.error(err);
  }

  //specify DB to access
  app.db = client.db(process.env.DB_NAME);

  //call expressJS to listen to port (now that DB is ready)
  app.listen(process.env.PORT || port, () => {
    console.log(`API site listening at http://localhost:${port}`);
    app.emit("ready");
  });
});

/*
 * ROUTES START HERE
 */
const profile_routes = require("./routes/profile_routes");
app.use("/api", profile_routes);

const admin_routes = require("./routes/admin_routes");
app.use("/admin", admin_routes);

const user_routes = require("./routes/user_routes");
app.use("/user", user_routes);

// Handles any requests that don't match the ones above
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

module.exports = app;
