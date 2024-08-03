// controllers.js

let players = [
];

const home = (req, res) => {
    res.render('index', { players });
};

const removeOldEntries = () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now - 1 * 60 * 1000); // 5 Minuten in Millisekunden

    // Iteriere über alle Spieler und deren Charaktere
    players.forEach(player => {
        player.characters = player.characters.filter(character => {
            const lastUpdated = new Date(character.LastUpdated);
            return lastUpdated >= fiveMinutesAgo; // Behalte nur die Charaktere, die in den letzten 5 Minuten aktualisiert wurden
        });

        // Entferne den Spieler, wenn er keine Charaktere mehr hat
        if (player.characters.length === 0) {
            const index = players.indexOf(player);
            if (index !== -1) {
                players.splice(index, 1);
            }
        }
    });

    console.log('Old entries removed');
};

// Setze ein Intervall, das alle 5 Minuten die Funktion `removeOldEntries` aufruft
setInterval(removeOldEntries, 1 * 60 * 1000); // 5 Minuten in Millisekunden

const validateCharacter = (character) => {
    // Validierung des Namens
    if (typeof character.Name !== 'string' || character.Name.length < 3) {
        console.error('Invalid Name: Must be a string with at least 3 characters.');
        return false;
    }
    
    // Validierung der CharacterClass
    if (typeof character.CharacterClass !== 'string' || character.CharacterClass.length === 0) {
        console.error('Invalid CharacterClass: Must be a non-empty string.');
        return false;
    }

    // Validierung des Levels
    if (typeof character.Level !== 'number' || character.Level < 0) {
        console.error('Invalid Level: Must be a non-negative number.');
        return false;
    }

    // Validierung der aktuellen XP
    if (typeof character.CurrentXP !== 'number' || character.CurrentXP < 0) {
        console.error('Invalid CurrentXP: Must be a non-negative number.');
        return false;
    }

    // Validierung der benötigten XP
    if (typeof character.NeededXP !== 'number' || character.NeededXP < 0) {
        console.error('Invalid NeededXP: Must be a non-negative number.');
        return false;
    }

    // Validierung des Alive-Status
    if (typeof character.IsAlive !== 'boolean') {
        console.error('Invalid IsAlive: Must be a boolean.');
        return false;
    }

    // Validierung der Ausrüstung
    if (!Array.isArray(character.Equipment) || character.Equipment.some(item => !validateItem(item))) {
        console.error('Invalid Equipment: Must be an array of valid items.');
        return false;
    }

    // Validierung der abgeschlossenen Quests
    if (!Array.isArray(character.CompletedQuests) || character.CompletedQuests.some(quest => !validateQuest(quest))) {
        console.error('Invalid CompletedQuests: Must be an array of valid quests.');
        return false;
    }

    return true;
};

// Hilfsfunktionen zur Validierung von Ausrüstungsgegenständen
const validateItem = (item) => {
    return typeof item.ItemName === 'string' && item.ItemName.length > 0 &&
           typeof item.ItemLevel === 'number' && item.ItemLevel >= 0;
};

// Hilfsfunktionen zur Validierung von Quests
const validateQuest = (quest) => {
    return typeof quest.QuestName === 'string' && quest.QuestName.length > 0;
};


const addCharacter = (req, res) => {
    const { steamName, character } = req.body;

    if (!validateCharacter(character)) {
        return res.status(400).send('Invalid Character Data');
    }

    // Finde den Spieler anhand des Steam-Namens
    let player = players.find(p => p.steamName === steamName);

    if (player) {
        // Überprüfe, ob der Charakter bereits existiert
        let charIndex = player.characters.findIndex(c => c.Name === character.Name);

        if (charIndex === -1) {
            // Charakter existiert nicht, füge ihn hinzu
            player.characters.push(character);
            res.status(200).send({ message: 'Character added successfully' });
        } else {
            // Charakter existiert bereits
            res.status(400).send({ message: 'Character with this name already exists for this player' });
        }
    } else {
        // Spieler existiert nicht, füge Spieler und Charakter hinzu
        players.push({
            steamName,
            characters: [character]
        });
        res.status(200).send({ message: 'Player and character added successfully' });
    }
};


const getPlayers = (req, res) => {
    res.json(players);
}

const updateCharacter = (req, res) => {
    const { steamName, character } = req.body;
    let player = players.find(p => p.steamName === steamName);
    if (player) {
        let charIndex = player.characters.findIndex(c => c.Name === character.Name);
        if (charIndex !== -1) {
            player.characters[charIndex] = character;
        }
    }
    res.redirect('/');
};

const error = (req, res) => {
    res.status(404).send('404 - Page Not Found');
};

module.exports = { home, addCharacter, updateCharacter, getPlayers, error };
