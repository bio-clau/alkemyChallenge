//imports
require("dotenv").config({ path: "./.env" });

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middlewares/error");
const multer = require("multer");
const path = require("path");

//Initializations
connectDB();
const app = express();

//Middlewares
app.use(
  cors({
    origin: `http://localhost:${process.env.FRONT_PORT}`,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//configure multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});
app.use(multer({ storage: storage }).single("image"));

//Routes
//routes to authentication
app.use("/api/auth", require("./routes/r-auth"));

//private routes - characters
app.use("/api/p-char", require("./routes/r-p-char"));

//Error Handler - the las middleware
app.use(errorHandler);

//Server
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//inhandledRejection prettier :P
process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged error: ${err}`);
  //Stops the server from accepting new connections and keeps existing connections.
  server.close(() => {
    process.exit(1);
  });
});
