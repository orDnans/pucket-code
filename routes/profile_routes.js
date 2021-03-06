const express = require("express");
const router = express.Router();
const contact_me_controller = require("../controllers/contact_me_controller.js");
const recaptcha = require("../middleware/recaptcha.js");

router.get("/", (req, res) => {
	collection = req.app.db.collection("homepage");
	collection.find({}).toArray((err, docs) => {
		if (err) {
			throw err;
		}
		res.status(200).send(docs);
	});
});

router.get("/about-me", (req, res) => {
	collection = req.app.db.collection("aboutMe");
	collection.find({}).toArray((err, docs) => {
		if (err) {
			throw err;
		}
		res.status(200).send(docs);
	});
});

router.get("/academic-experiences", (req, res) => {
	collection = req.app.db.collection("academicExperience");
	collection.find({}, { sort: { startDate: -1 } }).toArray((err, docs) => {
		if (err) {
			throw err;
		}
		res.status(200).send(docs);
	});
});

router.get("/hobbies", (req, res) => {
	collection = req.app.db.collection("hobbies");
	collection.find({}).toArray((err, data) => {
		if (err) {
			throw err;
		}
		res.status(200).send(data);
	});
});

router.get("/title", (req, res) => {
	collection = req.app.db.collection("websiteTitle");
	collection.find({}).toArray((err, data) => {
		if (err) {
			throw err;
		}
		res.status(200).send(data);
	});
});

router.post(
	"/contact-me",
	recaptcha.recaptcha,
	contact_me_controller.sendContactMe
);
module.exports = router;
