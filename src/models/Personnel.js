const mongoose = require('mongoose');

const personnelSchema = new mongoose.Schema({
  userId: { // Pour lier cette fiche à un utilisateur
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nom: { type: String, required: [true, 'Le nom est requis'] },
  prenoms: { type: String, required: [true, 'Les prénoms sont requis'] },
  phone: { type: String, required: [true, 'Le numéro de téléphone est requis'] },
  genre: { type: String, enum: ['Masculin', 'Féminin', 'Autre'], required: [true, 'Le genre est requis'] },
  profession: { type: String, required: [true, 'La profession est requise'] },
  departement: { type: String, required: [true, 'Le département est requis'] },
  salaire: { type: Number, required: [true, 'Le salaire est requis'], min: 0 },
  dateEmbauche: { type: Date, required: [true, "La date d'embauche est requise"] },
  nombreEnfants: { type: Number, default: 0, min: 0 },
  situationMatrimoniale: {
    type: String,
    enum: ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)', 'En couple'],
    required: [true, 'La situation matrimoniale est requise']
  }
}, { timestamps: true });

const Personnel = mongoose.model('Personnel', personnelSchema);
module.exports = Personnel;