const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

// Les routes
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

const Thing = require('./models/Things');


mongoose.connect('mongodb+srv://sophia45:saucepiiquante@cluster0.dpm0pif.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(express.json());



app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

const path = require('path');

app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;