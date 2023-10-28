const express = require("express");
const PORT = require("./config");

const app = express();

const Sequelize = require("sequelize");
const sequelize = new Sequelize("tealeaf", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

sequelize.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

const cors = require("cors");
const allowedOrigins = ["http://localhost:5173"];

const routes = require("./routes/route");

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is included in the allowedOrigins array.
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

app.use("/api", routes);
