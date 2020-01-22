const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Load user Model
const User = require("../../models/User");
const validateRegistration = require("../../validation/register");

// @route  POST /api/users/register
// @desc   Register new user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegistration(req.body);

  if (!isValid) return res.status(400).json(errors);

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    }

    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(() =>
            res.json({ message: "You have successfully registered" })
          );
      });
    });
  });
});

module.exports = router;
