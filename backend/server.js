const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

let favorites = [];

app.post('/favorites', (req, res) => {
    const { id, title, image } = req.body;
    if (!favorites.find(fav => fav.id === id)) {
        favorites.push({ id, title, image });
        res.status(201).send({ message: 'Recipe added to favorites' });
    } else {
        res.status(400).send({ message: 'Recipe already in favorites' });
    }
});

app.get('/favorites', (req, res) => {
    res.status(200).send(favorites);
});

app.get('/favorites/:id', (req, res) => {
    const { id } = req.params;
    const favorite = favorites.find(fav => fav.id === id);
    if (favorite) {
        res.status(200).send(favorite);
    } else {
        res.status(404).send({ message: 'Recipe not found in favorites' });
    }
});

app.delete('/favorites/:id', (req, res) => {
    const { id } = req.params;
    favorites = favorites.filter(fav => fav.id !== id);
    res.status(200).send({ message: 'Recipe removed from favorites' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});