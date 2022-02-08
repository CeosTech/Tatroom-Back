const express = require("express");
const res = require("express/lib/response");

const router = express.Router();
const Shop = require("../models/Shop");

//Inserts new shop
router.post("/", async (req, res) => {
  const shop = new Shop({
    parlorName: req.body.parlorName,
    managerLastName: req.body.managerLastName,
    managerName: req.body.managerName,
    siretNumber: req.body.siretNumber,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    zipcode: req.body.zipcode,
    city: req.body.city,
    password: req.body.password,
  });
  try {
    const savedShop = await shop.save();
    res.json(savedShop);
  } catch (err) {
    res.json({ message: error });
  }
});

//Retrieves all shops
router.get("/", async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.json({ message: err });
  }
});

//Retrieves specific shop
router.get("/:shopId", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    res.json(shop);
  } catch (err) {
    res.json({ message: err });
  }
});

//Deletes specific shop
router.delete("/:shopId", async (req, res) => {
  try {
    const removedShop = await Shop.remove({ _id: req.params.shopId });
    res.json(removedShop);
  } catch (err) {
    res.json({ message: err });
  }
});

//Updates specific shop
router.patch("/:shopId", async (req, res) => {
  try {
    const updatedShop = await Shop.updateOne(
      { _id: req.params.shopId },
      { $set: { name: req.body.name } }
    );
    res.json({ updatedShop });
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
