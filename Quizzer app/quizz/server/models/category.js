const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  _id: { type: String, required: false },
  name: {type: String, required: true}
});

module.exports = {categorySchema}
