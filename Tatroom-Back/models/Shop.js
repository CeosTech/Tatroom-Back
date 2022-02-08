const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
  parlorName: { type: String, required: true },
  managerLastName: { type: String, required: true },
  managerName: { type: String, required: true },
  siretNumber: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  zipcode: { type: Number, required: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
//   profilePic:
//   gallery:
//   styles:
});

module.exports = mongoose.model("Shops", shopSchema);
