const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/create", async(req, res) => {
    let { username, password } = req.body.user;
    try {
        const User = await User.create({
            username,
            password: bcrypt.hashSync(password, 13),
        });

        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to register user",
            });
        }
    }
});

router.post("/login", async(req, res) => {
    let { username, password } = req.body.user;
    try {
        const loginUser = await User.findOne({
            where: {
                username: username
            }
        });

        if (loginUser) {

            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if (passwordComparison) {

                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect email or password"
                });
            }

        } else {
            res.status(401).json({
                message: "Username or password do not match our records"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log in user"
        })
    }
});

module.exports = router;