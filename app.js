const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv/config");

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Import Routes
const usersRoute = require("./routes/users");
const shopsRoute = require("./routes/shops")

app.use("/users", usersRoute)
app.use("/shops", shopsRoute);


//Connecting to DB
mongoose.connect(process.env.DB_CONNECTION, () =>
  console.log("connected to DB")
);

//Listening to server
app.listen(3000);

