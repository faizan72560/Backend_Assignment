const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT;

const errormiddleware = require("./utils/errorMiddleware");
const cors = require("cors");
const corsOpts = {
  // origin: 'http://localhost:3000',
  origin: process.env.LOCALPORT,
  credentials: true,
  methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


const user = require("./routes/userRoutes");
app.use("/api/v1", user);
const DB = process.env.DATABASE;
app.use(errormiddleware);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });



app.listen(port, () => {
  console.log(`started on ${port}`);
});
