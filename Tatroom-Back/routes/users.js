const express = require("express");
const res = require("express/lib/response");

const router = express.Router();
const User = require("../models/User");

//Inserts new user
router.post("/", async (req, res) => {
  const user = new User({
    lastname: req.body.lastname,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    zipcode: req.body.zipcode,
    city: req.body.city,
    password: req.body.password,
  });
  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: error });
  }
});

//Retrieves all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

//Retrieves specific user
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
});

//Deletes specific user
router.delete("/:userId", async (req, res) => {
  try {
    const removedUser = await User.remove({ _id: req.params.userId });
    res.json(removedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

//Updates specific user
router.patch("/:userId", async (req, res) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.userId },
      { $set: { name: req.body.name } }
    );
    res.json({ updatedUser });
  } catch (err) {
    res.json({ message: err });
  }
});


module.exports = router;
