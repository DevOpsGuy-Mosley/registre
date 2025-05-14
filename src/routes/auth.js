// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isGuest, isAuthenticated } = require('../middleware/auth');

// GET /auth/register - Afficher le formulaire d'inscription
router.get('/register', isGuest, (req, res) => {
  res.render('auth/register', { title: 'Inscription', error: null, success: null });
});

// POST /auth/register - Gérer la soumission du formulaire d'inscription
router.post('/register', isGuest, async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render('auth/register', { title: 'Inscription', error: 'Les mots de passe ne correspondent pas.', success: null, username });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('auth/register', { title: 'Inscription', error: 'Ce nom d\'utilisateur existe déjà.', success: null, username });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    req.session.message = { type: 'success', text: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' };
    res.redirect('/auth/login');

  } catch (error) {
    console.error(error);
    let errorMessage = "Une erreur s'est produite lors de l'inscription.";
    if (error.errors) { // Erreurs de validation Mongoose
        errorMessage = Object.values(error.errors).map(e => e.message).join(', ');
    }
    res.render('auth/register', { title: 'Inscription', error: errorMessage, success: null, username });
  }
});

// GET /auth/login - Afficher le formulaire de connexion
router.get('/login', isGuest, (req, res) => {
  res.render('auth/login', { title: 'Connexion', error: null, username: '' });
});

// POST /auth/login - Gérer la soumission du formulaire de connexion
router.post('/login', isGuest, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('auth/login', { title: 'Connexion', error: 'Nom d\'utilisateur ou mot de passe incorrect.', username });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('auth/login', { title: 'Connexion', error: 'Nom d\'utilisateur ou mot de passe incorrect.', username });
    }

    req.session.userId = user._id; // Stocker l'ID de l'utilisateur dans la session
    req.session.username = user.username; // Optionnel: stocker le username
    req.session.message = { type: 'success', text: `Bienvenue ${user.username} !` };
    res.redirect('/dashboard'); // Rediriger vers le tableau de bord ou la page principale
  } catch (error) {
    console.error(error);
    res.render('auth/login', { title: 'Connexion', error: 'Une erreur s\'est produite.', username });
  }
});

// GET /auth/logout - Déconnexion
router.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      return res.redirect('/'); // Ou une page d'erreur
    }
    res.clearCookie('connect.sid'); // Nom du cookie de session par défaut
    res.redirect('/auth/login');
  });
});

module.exports = router;