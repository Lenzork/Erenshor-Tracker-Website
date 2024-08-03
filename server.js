const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressRoutes = require('./express-routes'); // Importiere den Router aus der express-routes.js-Datei
//const fetch = require('node-fetch'); // Stelle sicher, dass node-fetch installiert ist

const app = express();
const port = process.env.PORT || 3000; // Verwende die Umgebungsvariable PORT oder 3000 als Standard

// Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Verbinde Express-Routen
app.use('/', expressRoutes); // Nutze den exportierten Router aus express-routes.js

app.use((req, res, next) => {
    res.redirect('/404');
  })
  
  // Starte den Server
  app.listen(port, () => {
    console.log(`Webseite ist unter http://localhost:${port} verfügbar.`);
  });