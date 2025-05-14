// filepath: c:\Dev\registre\src\middleware\validation.js
const { body, validationResult } = require('express-validator');

// Middleware de validation pour l'inscription
const validateRegistration = [
  body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis.'),
  body('email').isEmail().withMessage('Veuillez entrer une adresse e-mail valide.'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Middleware de validation pour la mise à jour du personnel
const validatePersonnelUpdate = [
  body('name').optional().notEmpty().withMessage('Le nom ne peut pas être vide.'),
  body('email').optional().isEmail().withMessage('Veuillez entrer une adresse e-mail valide.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRegistration,
  validatePersonnelUpdate
};