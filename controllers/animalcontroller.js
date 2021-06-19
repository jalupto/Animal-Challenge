const express = require("express");
const router = express.Router();
const validateSession = require("../middleware/validate-session");
const { Animal } = require("../models");

/*
============================================
    Create animal
============================================
*/

router.post("/create", validateSession, async(req, res) => {
    const { name, legNumber, predator } = req.body.animal;
    const animalEntry = {
        name,
        legNumber,
        predator,
        userId: req.user.id
    };
    try {
        const newAnimal = await Animal.create(animalEntry);
        res.status(200).json({
            message: 'A new animal is born!',
            newAnimal
        });
    } catch (err) {
        res.status(500).json({
            message: 'Animal did not survive incubation',
            error: err
        });
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
    Update animal
============================================
*/

router.put('/update/:id', validateSession, async(req, res) => {
    const { name, legNumber, predator } = req.body.animal;

    const query = {
        where: {
            id: req.params.id,
            userId: req.user.id
        }
    };

    const updatedAnimal = {
        name: name,
        legNumber: legNumber,
        predator: predator
    };

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

/*
============================================
    Delete animal
============================================
*/

router.delete('/delete/:name', validateSession, async(req, res) => {
    const animalToDelete = req.params.name;
    try {

        let animal = await Animal.findOne({
            where: {
                name: animalToDelete,
                userId: req.user.id
            }
        });

        if (animal) {
            const query = {
                where: {
                    id: animal.id,
                    userId: req.user.id
                }
            };

            await Animal.destroy(query);
            res.status(200).json({
                message: `The ${animalToDelete} is now extinct.`
            });
        } else {
            res.status(200).json({
                message: 'Animal not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `Somehow this animal survived extinction: ${error}`
        });
    }
});

module.exports = router;