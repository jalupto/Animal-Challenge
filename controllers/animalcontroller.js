const express = require("express");
const router = express.Router();
const { Animal } = require("../models");

router.post("/create", async(req, res) => {
    const { name, legNumber, predator } = req.body.animal;
    const animalEntry = {
        name,
        legNumber,
        predator
    }
    try {
        const newAnimal = await Animal.create(animalEntry);
        res.status(200).json(newAnimal)
    } catch (err) {
        res.status(500).json({ error: err });
    }
    // Animal.create(animalEntry)
});

router.get('/list', (req, res) => {
    res.send('This is the list of animals.')
});

module.exports = router;