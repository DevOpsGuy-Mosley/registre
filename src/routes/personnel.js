// routes/personnel.js
const express = require('express');
const router = express.Router();
const Personnel = require('../models/Personnel');
const { isAuthenticated } = require('../middleware/auth');

// GET /personnel/new - Afficher le formulaire pour créer une nouvelle fiche
router.get('/new', isAuthenticated, (req, res) => {
    res.render('personnel/form', { 
        title: 'Ajouter une Fiche Personnel',
        error: null,
        fiche: undefined,
        username: req.session.username
    });
});

// POST /personnel - Soumettre les données du formulaire et créer une nouvelle fiche
router.post('/', isAuthenticated, async (req, res) => {
    const { nom, prenoms, phone, genre, profession, departement, salaire, dateEmbauche, nombreEnfants, situationMatrimoniale } = req.body;

    try {
        const nouvelleFiche = new Personnel({
            userId: req.session.userId,
            nom,
            prenoms,
            phone,
            genre,
            profession,
            departement,
            salaire,
            dateEmbauche,
            nombreEnfants,
            situationMatrimoniale
        });

        await nouvelleFiche.save();
        req.session.message = { type: 'success', text: 'Fiche de renseignement enregistrée avec succès !' };
        res.redirect('/dashboard');

    } catch (error) {
        console.error(error);
        let errorMessage = "Une erreur s'est produite lors de l'enregistrement de la fiche.";
        if (error.errors) {
            errorMessage = Object.values(error.errors).map(e => e.message).join(', ');
        }
        res.render('personnel/form', {
            title: 'Ajouter une Fiche Personnel',
            error: errorMessage,
            fiche: req.body,
            username: req.session.username
        });
    }
});

// GET /personnel/edit/:id - Afficher le formulaire de modification
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const fiche = await Personnel.findOne({ _id: req.params.id, userId: req.session.userId });
        if (!fiche) {
            req.session.message = { type: 'error', text: 'Fiche non trouvée.' };
            return res.redirect('/dashboard');
        }
        res.render('personnel/form', {
            title: 'Modifier la Fiche Personnel',
            error: null,
            fiche: fiche,
            username: req.session.username
        });
    } catch (error) {
        console.error(error);
        req.session.message = { type: 'error', text: 'Erreur lors du chargement de la fiche.' };
        res.redirect('/dashboard');
    }
});

// POST /personnel/update/:id - Mettre à jour une fiche
router.post('/update/:id', isAuthenticated, async (req, res) => {
    try {
        const fiche = await Personnel.findOne({ _id: req.params.id, userId: req.session.userId });
        if (!fiche) {
            req.session.message = { type: 'error', text: 'Fiche non trouvée.' };
            return res.redirect('/dashboard');
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            fiche[key] = updates[key];
        });

        await fiche.save();
        req.session.message = { type: 'success', text: 'Fiche mise à jour avec succès !' };
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        let errorMessage = "Une erreur s'est produite lors de la mise à jour de la fiche.";
        if (error.errors) {
            errorMessage = Object.values(error.errors).map(e => e.message).join(', ');
        }
        res.render('personnel/form', {
            title: 'Modifier la Fiche Personnel',
            error: errorMessage,
            fiche: req.body,
            username: req.session.username
        });
    }
});

// GET /personnel/delete/:id - Supprimer une fiche
router.get('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const fiche = await Personnel.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
        if (!fiche) {
            req.session.message = { type: 'error', text: 'Fiche non trouvée.' };
        } else {
            req.session.message = { type: 'success', text: 'Fiche supprimée avec succès.' };
        }
    } catch (error) {
        console.error(error);
        req.session.message = { type: 'error', text: 'Erreur lors de la suppression de la fiche.' };
    }
    res.redirect('/dashboard');
});

module.exports = router;