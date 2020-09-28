const assert = require("assert");
const fs = require("fs");
const cors = require("cors");

const express = require("express");
const app = express();
const port = 5000;

const MongoClient = require("mongodb").MongoClient;

app.use(cors());

// Serve the static files from the React app
const path = require("path");
app.use(express.static(path.join(__dirname, "client/build")));

//read json to get config properties, might change over to heroku environment variables
fs.readFile("mongoProperties.json", "utf8", (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	dbProperties = JSON.parse(data);

	//create new MongoClient with options
	const client = new MongoClient(dbProperties.url, {
		useNewUrlParser: true,
		poolSize: dbProperties.poolSize,
		useUnifiedTopology: true,
	});

	//connect client (must be done before using client to access DB)
	client.connect((err) => {
		if (err) {
			console.error(err);
		}

		//specify DB to access
		app.db = client.db(dbProperties.dbName);

		//call expressJS to listen to port (now that DB is ready)
		app.listen(port, () => {
			console.log(`API site listening at http://localhost:${port}`);
		});
	});
});

/*
 * ROUTES START HERE
 */
// Handles any requests that don't match the ones above
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.get("/api", (req, res) => {
	res.send("Hello World!");
});

app.get("/api/academic-experiences", (req, res) => {
	collection = req.app.db.collection("academicExperience");
	collection.find({}).toArray((err, docs) => {
		if (err) {
			throw err;
		}
		res.send(docs);
	});
});

app.get("/api/hobbies", (req, res) => {
	collection = req.app.db.collection("hobbies");
	collection.find({}).toArray((err, data) => {
		if (err) {
			throw err;
		}
		res.send(data);
	});
});

app.get("/api/contact", (req, res) => {
	res.send("Contact");
});

const contact_me_routes = require("./routes/contact_me_routes");
app.use("/home", contact_me_routes);