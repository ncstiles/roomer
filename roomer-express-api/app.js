require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const matchRoute = require("./routes/routes");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("tiny"));
app.use(express.json());

app.get("/tester", (req, res) => {
  res.status(200).send({ hai: "bai" });
});

app.use("", matchRoute);

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use((error, req, res, next) => {
  let message = error.message
    ? error.message
    : "Something wen't wrong in the application";
  let status = error.status ? error.status : 500;

  const errorObj = {
    status: status,
    message: message,
  };

  res.status(status).send({ error: errorObj });
  next();
});

module.exports = app;
