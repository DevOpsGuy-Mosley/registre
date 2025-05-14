require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Connexion à MongoDB avec les options recommandées
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Middlewares
app.use(express.urlencoded({ extended: true })); // Pour parser les données de formulaire
app.use(express.json()); // Pour parser les données JSON
app.use(express.static(path.join(__dirname, 'public'))); // Servir les fichiers statiques

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Configuration des sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 jour
}));

// Middleware pour rendre les informations de session disponibles dans les vues
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId; // Ou req.session.user si vous stockez l'objet utilisateur
  res.locals.message = req.session.message; // Pour les messages flash
  delete req.session.message;
  next();
});

// Import des routes
const authRoutes = require('./src/routes/auth');
const personnelRoutes = require('./src/routes/personnel');
const { isAuthenticated } = require('./src/middleware/auth');

// Application des routes
app.use('/auth', authRoutes);
app.use('/personnel', personnelRoutes);

// Route principale
app.get('/', (req, res) => {
  res.render('index', { title: 'Accueil' }); // Exemple, vous créerez index.ejs
});

// Route du dashboard
app.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const Personnel = require('./src/models/Personnel');
    const personnels = await Personnel.find({ userId: req.session.userId }).sort({ dateEmbauche: -1 });
    res.render('dashboard', {
      title: 'Tableau de bord',
      username: req.session.username,
      personnels: personnels
    });
  } catch (error) {
    console.error("Erreur lors du chargement du dashboard:", error);
    req.session.message = { type: 'error', text: 'Erreur lors du chargement de vos informations.' };
    res.redirect('/');
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
