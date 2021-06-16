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

router.get('/', async(req, res) => {
    try {
        const allAnimals = await Animal.findAll();
        res.status(200).json(
            allAnimals
        )
    } catch (error) {
        res.status(500).json({
            error: `You have an error: ${error}`
        })
    }
});

router.delete('/delete/:name', async(req, res) => {
    const animalToDelete = req.params.name;
    try {
        const query = {
            where: {
                name: animalToDelete
            }
        };

        await Animal.destroy(query);
        res.status(200).json({
            message: `The animal ${animalToDelete} has been deleted.`
        });
    } catch (error) {
        res.status(500).json({
            message: `There was an issue deleting this animal: ${error}`,
            error,
        });
    }
});

router.put('/update/:id', async(req, res) => {
    const { name, legNumber, predator } = req.body.animal;

    const query = {
        where: {
            id: req.params.id
        }
    }

    const updatedAnimal = {
        name: name,
        legNumber: legNumber,
        predator: predator
    }

    try {
        const update = await Animal.update(updatedAnimal, query);
        res.status(200).json({
            message: 'Animal evolved!',
            update
        })
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong!'
        });
    }
});

module.exports = router;