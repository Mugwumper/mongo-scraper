var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title:    { type: String, required: true, unique: true },
  link:     { type: String, required: true },
  summary:  { type: String },
  byLine:   { type: String },
  isSaved:  { type: Boolean, default: false },
  // link to the Note collection
  note:     { type: [{ type: Schema.Types.ObjectId, ref: 'Note'}]}
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article; //export the Article model