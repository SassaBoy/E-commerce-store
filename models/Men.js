const mongoose = require('mongoose');

const menItemSchema = new mongoose.Schema({
  title: String,
  category: String,
  price: Number,
  image: String,
});

const Men = mongoose.model('Men', menItemSchema);

module.exports = Men;
