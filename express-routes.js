// router.js

const express = require('express');
const router = express.Router();
const { home, addCharacter, getPlayers, updateCharacter, error } = require('./controllers'); // Importiere Controller-Funktionen

// Definiere Routen
router.get('/', home);
router.post('/addCharacter', addCharacter);
router.put('/updateCharacter', updateCharacter);
router.get('/getPlayers', getPlayers);
//router.get('/player/:id', playerLookUp);
router.get('/404', error);

// Exportiere den Router
module.exports = router;
