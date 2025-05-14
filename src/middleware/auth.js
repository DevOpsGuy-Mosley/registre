// middleware/auth.js

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  req.session.message = { type: 'error', text: 'Vous devez être connecté pour accéder à cette page.' };
  res.redirect('/auth/login');
};

const isGuest = (req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  res.redirect('/dashboard');
};

module.exports = {
  isAuthenticated,
  isGuest
};