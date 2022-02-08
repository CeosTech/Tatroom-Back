const express = require("express");
const res = require("express/lib/response");
const bcrypt = require('bcrypt'); // In order to hash the password
const jwt = require('jsonwebtoken'); // Token for JWT
const dotenv = require('dotenv');
const mongoose = require("mongoose");

const router = express.Router();
const Shop = require("../models/Shop");

// ====================
// get config vars friom .env
// ====================
dotenv.config();
TOKEN_SECRET = process.env.TOKEN_SECRET; // OUR SECRET KEY

//Inserts new shop
router.post("/", async (req, res) => {
  console.log(req.body)
  let password = await bcrypt.hash(req.body.password, 10) 
  const shop = new Shop({
    username: req.body.username,
    parlorName: req.body.parlorName,
    managerLastName: req.body.managerLastName,
    managerName: req.body.managerName,
    siretNumber: req.body.siretNumber,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    zipcode: req.body.zipcode,
    city: req.body.city,
    password: password,
  });
  try {
    const savedShop = await shop.save().then(result => {
      console.log('Saved !')
    });
    res.status(200).json(savedShop);
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err });
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

//================= AUTHENTICATION
function tokenGenerator(username){
  return jwt.sign({data: username}, TOKEN_SECRET, { expiresIn: '1d' })
}

// Send a token
router.post("/token/", (req, res) => {
  const token = tokenGenerator(req.body.username)
  res.status(200).json({token: token})
})

router.post("/authentification/", (req, res) =>{
  let username = req.body.username
  let password = req.body.password
  console.log(username)
  if(username !== undefined && password !== undefined){
    const query = Shop.find({ username: username });
  }else{
    res.status(401).json({error: "The credentials are incorrects"})
  }
})



module.exports = router;
