var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var noteSchema = new Schema({
  text: String
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note; // Export the Note model