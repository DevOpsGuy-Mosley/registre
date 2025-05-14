// filepath: c:\Dev\registre\src\controllers\personnelController.js
const Personnel = require('../models/Personnel');

// Créer un nouveau personnel
exports.createPersonnel = async (req, res) => {
    try {
        const personnel = new Personnel(req.body);
        await personnel.save();
        res.status(201).redirect('/personnel/list');
    } catch (error) {
        res.status(400).render('personnel/create', { error: error.message });
    }
};

// Lister tout le personnel
exports.listPersonnel = async (req, res) => {
    try {
        const personnels = await Personnel.find();
        res.render('personnel/list', { personnels });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Afficher le formulaire d'édition
exports.editPersonnelForm = async (req, res) => {
    try {
        const personnel = await Personnel.findById(req.params.id);
        res.render('personnel/edit', { personnel });
    } catch (error) {
        res.status(404).send(error);
    }
};

// Mettre à jour le personnel
exports.updatePersonnel = async (req, res) => {
    try {
        await Personnel.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/personnel/list');
    } catch (error) {
        res.status(400).render('personnel/edit', { error: error.message });
    }
};

// Supprimer le personnel
exports.deletePersonnel = async (req, res) => {
    try {
        await Personnel.findByIdAndDelete(req.params.id);
        res.redirect('/personnel/list');
    } catch (error) {
        res.status(500).send(error);
    }
};