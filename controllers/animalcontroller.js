const express = require("express");
const router = express.Router();
let validateSession = require("../middleware/validate-session");
const { Animal } = require("../models");

/*
============================================
    Create animal
============================================
*/

router.post("/create", validateSession, async(req, res) => {
    const { name, legNumber, predator } = req.body.animal;
    const { id } = req.user;
    const animalEntry = {
        name,
        legNumber,
        predator,
        userId: id
    }
    try {
        const newAnimal = await Animal.create(animalEntry);
        res.status(200).json(newAnimal)
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
===========================================
    Get user animals
===========================================
*/

router.get('/mine', validateSession, async(req, res) => {
    const { id } = req.user;
    try {
        const userAnimals = await Animal.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userAnimals);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
============================================
    Get all animals
============================================
*/

router.get('/', async(req, res) => {
    try {
        const allAnimals = await Animal.findAll();
        res.status(200).json(
            allAnimals
        );
    } catch (error) {
        res.status(500).json({
            error: `You have an error: ${error}`
        });
    }
});

/*
============================================
    Get animals by name
============================================
*/

router.get('/:name', async(req, res) => {
    const { name } = req.params;
    try {
        const results = await Animal.findAll({
            where: { name: name }
        });
        res.status(200).json(
            results
        );
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
});

/*
============================================
    Delete animal
============================================
*/

router.delete('/delete/:name', validateSession, async(req, res) => {
    const animalToDelete = req.params.name;
    try {
        const query = {
            where: {
                name: animalToDelete
            }
        };

        await Animal.destroy(query);
        res.status(200).json({
            message: `The ${animalToDelete} is now extinct.`
        });
    } catch (error) {
        res.status(500).json({
            message: `Somehow this animal survived extinction: ${error}`
        });
    }
});

/*
============================================
    Update animal
============================================
*/

router.put('/update/:id', validateSession, async(req, res) => {
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
        });
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong!',
            error: err
        });
    }
});

module.exports = router;