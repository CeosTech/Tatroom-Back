const express = require("express");
const res = require("express/lib/response");
const bcrypt = require("bcrypt"); // In order to hash the password
const jwt = require("jsonwebtoken"); // Token for JWT
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const router = express.Router();
const Shop = require("../models/Shop");

// ====================
// get config vars from .env
// ====================
dotenv.config();
TOKEN_SECRET = process.env.TOKEN_SECRET; // OUR SECRET KEY

/**
 * Main functions for open and close connection from the MongoDB database
 */
//Connecting to DB
async function connectDB() {
  await mongoose
    .connect(process.env.DB_CONNECTION)
    .then((res) => {
      console.log("Connected to MongoDB !");
    })
    .catch((err) => {
      console.log("ERREUR CONNEXION");
      console.log(err);
    });
}

// Disconnect from the DB
async function disconnectDB() {
  await mongoose.connection
    .close()
    .then((res) => {
      console.log("Disconnected from MongoDB !");
    })
    .catch((err) => {
      console.log(err);
    });
}
//=================

//Inserts new shop
router.post("/", async (req, res) => {
  await connectDB().then(async () => {
    console.log(req.body);
    let password = await bcrypt.hash(req.body.password, 10); // Hash the password provided
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
      profilePic: req.body.profilePic,
      city: req.body.city,
      password: password,
    });
    try {
      //Save the object
      const savedShop = await shop.save().then((result) => {
        disconnectDB();
      });
      res.status(200).json(savedShop);
      return;
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err });
      return;
    }
  });
});

//Retrieves all shops
router.get("/", async (req, res) => {
  console.log("===== GET SHOPS ===========");
  await connectDB() .then(async ()=>{
    const shops = await Shop.find().then(async (res)=>{
      console.log("=============SUCCESS=============")
      console.log(res)
      res.status(200).json(res);
      disconnectDB()
      return;
    }).catch((err)=>{
      console.log(err.response)
    });
  })
  //res.status(200).json();
});

//Retrieves specific shop
router.get("/:shopId", async (req, res) => {
  console.log("============SHOP ID=======")
  await connectDB().then(async () => {
    try {
      const shop = await Shop.findById(req.params.shopId);
      res.json(shop);
      return;
    } catch (err) {
      res.json({ message: err });
      return;
    }
  });
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

//================= AUTHENTICATION ====================

//--- Start functions
/**
 * Generate a token
 * @param {*} username ; { username: User's username}
 * @returns token ; { token: for the authentification }
 */
function tokenGenerator(username) {
  return jwt.sign({ data: username }, TOKEN_SECRET, { expiresIn: "1d" });
}

/**
 * verify a token symmetric - synchronous
 * @param {*} token ; { username: User's username}
 * @returns {data, boolean} ; boolean: true if the token is correct otherwise false ; data : from token decoded
 */
function verifyToken(token) {
  const result = jwt.verify(token, TOKEN_SECRET, function (err, decoded) {
    // err
    // decoded undefined
    if (err) {
      console.log(err);
      return { data: null, verify: false };
    } else if (decoded === undefined) {
      console.log("undefined");
      return { data: null, verify: false };
    }
    console.log(decoded);
    return { data: decoded, verify: true };
  });
  console.log(result);
  return result;
}

/**
 *
 * @param {password, hash} ; {password: password to compare to the hash, hash: password stocked in the DB }
 * @return {boolean} ; true if the password is correct otherwise false.
 */
async function checkPassword(password, hash) {
  if (!password || !hash) {
    return false;
  }
  let result = await bcrypt.compare(password, hash);
  return result;
}

//--- End functions

// Send a token
router.post("/token/", (req, res) => {
  const token = tokenGenerator(req.body.username);
  res.status(200).json({ token: token });
});

// Check if the credentials (username + password) are corrects
router.post("/authentification/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username !== undefined && password !== undefined) {
    await connectDB().then(async () => {
      const query = await Shop.findOne({ username: username }).then((res) => {
        disconnectDB();
        console.log(res);
        return res;
      });
      if (query === null) {
        res
          .status(401)
          .json({ error: "The credentials provided are incorrects" });
        return;
      }
      const hash = query.get("password"); // Retrieve password from the query result
      const passwordChecker = await checkPassword(password, hash);
      if (passwordChecker) {
        res.status(200).json({ token: tokenGenerator(username) }); // if the password is correct, we send the token
        return;
      }
      res.status(401).json({ conn: false });
    });
    return;
  } else {
    res.status(401).json({ error: "The credentials are incorrects" });
  }
});

router.post("/verify-token", (req, res) => {
  const authHeader = req.headers;
  const token = authHeader.token;
  console.log(token);
  if (token !== undefined && token !== null && token !== "") {
    const verif = verifyToken(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiQ2Vvc1RlY2giLCJpYXQiOjE2NDQ0MTg1MDcsImV4cCI6MTY0NDUwNDkwN30.DglwEvSzDl9YRQhPippmhkafQUecyomTCabqz-smm-s"
    );
    if (verif.verify) {
      res.status(200).json({ conn: true, data: verif.data });
      return;
    }
    res.status(401).json({ conn: false });
    return;
  }
  res.status(401).json();
});

module.exports = router;
