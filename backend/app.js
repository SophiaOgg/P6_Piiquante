const express = require('express');
const mongoose = require('mongoose');
const app = express();
const helmet = require('helmet');
const path = require('path');

// Les routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// const Sauce = require('./models/sauce');


mongoose.connect(`mongodb+srv://${ process.env.LOGIN }:${ process.env.PASSWORD }@${ process.env.CLUSTER }/${ process.env.DATABASE }?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(express.json());
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet({crossOriginResourcePolicy: { policy: "same-site"}}));

module.exports = app;