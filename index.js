const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const books = require("./routes/api/books");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB URL
const db = process.env.MONGODB_URL;

// Connect to DB
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log("error: ", err));

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/books", books);

// Server Static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);
