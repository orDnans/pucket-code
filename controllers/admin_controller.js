if (process.env.NODE_ENV !== 'production') {require('dotenv').config()}
const mongo = require("mongodb");
const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");

const imgur = require("./imgur_controller");

var refreshToken = function (req, res) {
  db = req.app.db;
  imgur.refreshAccess(db, (status) => {
    if (status == 200) {
      res.send("Refreshed Token!");
    } else {
      res.send("Something went wrong. Token not refreshed");
    }
  });
};

var addNewEntry = async function (req, res) {
  var section = req.body.section;
  var title = req.body.title;
  var description = req.body.description;
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var alignment = req.body.alignment;

  const collection = req.app.db.collection(section);

  if (!req.file) {
    console.log("No file uploaded");
    if (section == "hobbies") {
      collection.insertOne({
        title: title,
        description: description,
        image: "",
        alignment: alignment,
      });
    } else {
      collection.insertOne({
        title: title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description: description,
        image: "",
        alignment: alignment,
      });
    }
  } else {
    console.log("image uploaded");

    imgur.imgurUpload(req.app.db, req.file.path, (imageURL) => {
      if (imageURL == null) {
        console.log("Some error occurred imageURL null");
        res.send("Some error occurred! imageURL null");
      } else {
        console.log("Image uploaded!");
        if (section == "hobbies") {
          collection.insertOne({
            title: title,
            description: description,
            image: imageURL,
            alignment: alignment,
          });
        } else {
          collection.insertOne({
            title: title,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            description: description,
            image: imageURL,
            alignment: alignment,
          });
        }
        res.send("Uploaded!");
      }
    });
  }
};

//editEntry
var editEntry = function (req, res) {
  var section = req.body.section;
  var idString = req.body._id;
  var title = req.body.title;
  var description = req.body.description;
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var imageUrl = req.body.imageUrl;
  var alignment = req.body.alignment;

  var id = new mongo.ObjectID(idString);
  const collection = req.app.db.collection(section);

  if (!req.file) {
    console.log("No new photos");
    if (section == "hobbies") {
      collection.updateOne(
        { _id: id },
        {
          $set: {
            title: title,
            description: description,
            image: imageUrl,
            alignment: alignment,
          },
        }
      );
    } else {
      collection.updateOne(
        { _id: id },
        {
          $set: {
            title: title,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            description: description,
            image: imageUrl,
            alignment: alignment,
          },
        }
      );
    }

    res.send("Edited, no new picture!");
  } else {
    console.log("New photo uploaded");

    //delete previous photo
    collection.findOne({ _id: id }).then((result) => {
      if (result.image == null) {
        console.log("none found");
      } else {
        var oldImage = result.image;
        var imgurRegex = /(http(s*)):\/\/i.imgur.com\/([a-zA-Z0-9_\s]*)\./;
        var match = imgurRegex.exec(oldImage);
        var imageHash = match[3];

        imgur.imgurDelete(req.app.db, imageHash);
      }
    });

    //upload new photo
    var imagePath = req.file.path;
    imgur.imgurUpload(req.app.db, req.file.path, (imageURL) => {
      if (!imageURL) {
        console.log("Image upload failed.");
        res.send("Image upload failed. No edits are made");
      } else {
        if (section == "hobbies") {
          collection.updateOne(
            { _id: id },
            {
              $set: {
                title: title,
                description: description,
                image: imageURL,
                alignment: alignment,
              },
            }
          );
        } else {
          collection.updateOne(
            { _id: id },
            {
              $set: {
                title: title,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                description: description,
                image: imageURL,
                alignment: alignment,
              },
            }
          );
        }

        res.send("Edited!");
      }
    });
  }
};

module.exports.refreshToken = refreshToken;
module.exports.addNewEntry = addNewEntry;
module.exports.editEntry = editEntry;
